import Log from "@novemberizing/log";

import StorageAdapterDatabase from "../Database.js";

import mysql from "mysql2/promise";

export default class StorageAdapterDatabaseMysql extends StorageAdapterDatabase {
    static #tag = "StorageAdapterDatabaseMysql";

    static #pools = new Map();

    static #close(user, host, port, database) {
        Log.v(StorageAdapterDatabaseMysql.#tag, `#close(${JSON.stringify(user)}, ${JSON.stringify(host)}, ${JSON.stringify(port)}, ${JSON.stringify(database)})`);
        
        const key = `mysql://${user}@${host}:${port}/${database}`;

        const o = StorageAdapterDatabaseMysql.#pools.get(key);

        if(o) {
            o.count = o.count - 1;
            if(o.count === 0) {
                StorageAdapterDatabaseMysql.#pools.delete(key);
                o.pool.end();
            }
        }
    }

    static #result(result) {
        if(result[1]) {
            if(Array.isArray(result[1][0])) {
                result = result[1].reduce((accumulator, current, index) => {
                    if(current !== undefined) {
                        if(result[0][index] && result[0][index].length === 1) {
                            accumulator.push(result[0][index][0]);
                        } else {
                            accumulator.push(result[0][index]);
                        }
                    }
                    return accumulator;
                }, []);
                if(Array.isArray(result) && result.length <= 1) {
                    result = result[0];
                    if(Array.isArray(result) && result.length <= 1) {
                        result = result[0];
                    }
                    return result;
                }
                return result;
            } else {
                return (Array.isArray(result[0]) && result[0].length <= 1) ? result[0][0] : result[0];
            }
        } else {
            return true;
        }
    }

    static #open(user, host, port, database, password) {
        Log.v(StorageAdapterDatabaseMysql.#tag, `#open(${JSON.stringify(user)}, ${JSON.stringify(host)}, ${JSON.stringify(port)}, ${JSON.stringify(database)}, ${JSON.stringify(password)})`);

        const key = `mysql://${user}@${host}:${port}/${database}`;

        let o = StorageAdapterDatabaseMysql.#pools.get(key);

        if(o) {
            o.count = o.count + 1;
        } else {
            o = {
                count: 1,
                pool: mysql.createPool({
                    host,
                    port,
                    user,
                    password,
                    database,
                    connectionLimit: 32
                })
            }
        }

        StorageAdapterDatabaseMysql.#pools.set(key, o);

        return o.pool;
    }

    #password = null;
    #pool = null;

    constructor(url, config = undefined) {
        super(url, config);

        Log.v(StorageAdapterDatabaseMysql.#tag, `constructor(${JSON.stringify(url)}, ${JSON.stringify(config)})`);

        this.#password = config.password;

        this.#pool = StorageAdapterDatabaseMysql.#open(this.user, this.host, this.port, this.database, this.#password);
    }

    async query(sql, ...args) {
        Log.v(StorageAdapterDatabaseMysql.#tag, `query(${JSON.stringify(sql)}, ${JSON.stringify(args)})`);

        if(Array.isArray(sql)) {
            const connection = await this.#pool.getConnection();

            if(connection) {
                connection.beginTransaction();

                try {
                    const result = await Promise.all(sql.map(async query => {
                        return StorageAdapterDatabaseMysql.#result(await connection.query(query));
                    }));
                    connection.commit();
                    return result;
                } catch(e) {
                    connection.rollback();
                } finally {
                    connection.release();
                }
                return undefined;
            }
        } else {
            return StorageAdapterDatabaseMysql.#result(await this.#pool.query(sql, args));
        }
    }

    async close() {
        Log.v(StorageAdapterDatabaseMysql.#tag, `close()`);

        StorageAdapterDatabaseMysql.#close(this.user, this.host, this.port, this.database);
    }
}