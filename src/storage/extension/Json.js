import _ from "lodash";

import Log from "@novemberizing/log";

import StorageExtension from "../Extension.js";

import StorageExceptionUnsupported from "../exception/Unsupported.js";
import StorageExceptionInvalidParameter from "../exception/invalid/Parameter.js";

export default class StorageExtensionJson extends StorageExtension {
    static #tag = "StorageExtensionJson";

    constructor(url, adapter, config = undefined) {
        super(url, adapter, config);

        Log.v(StorageExtensionJson.#tag, `constructor(${url}, ${adapter}, ${config})`);
    }

    async query(sql, ...args) {
        Log.v(StorageExtensionJson.#tag, `query(${JSON.stringify(sql)}, ${JSON.stringify(args)})`);

        switch(sql) {
            case "get":     return await this.get(sql, args[0]);
            case "set":     return await this.set(sql, args[0], args[1]);
            case "del":     return await this.del(sql, args[0]);
        }

        throw new StorageExceptionUnsupported(`${StorageExtensionJson.#tag}.query(${JSON.stringify(sql)}, ${JSON.stringify(args)})`);
    }

    async get(sql, key) {
        Log.v(StorageExtensionJson.#tag, `get(${JSON.stringify(sql)}, ${JSON.stringify(key)})`);

        if(typeof key === "string") {
            const data = await super.query("get");

            if(data === undefined) {
                return data;
            }
            
            return key ? _.get(data, key) : data;
        } else if(typeof key === "number") {
            const data = await super.query("get");

            return data ? data[key] : undefined;
        }

        throw new StorageExceptionInvalidParameter();
    }

    async set(sql, key, value) {
        Log.v(StorageExtensionJson.#tag, `set(${JSON.stringify(sql)}, ${JSON.stringify(key)}, ${JSON.stringify(value)})`);

        if(typeof key === "string") {
            let data = await super.query("get");
            if(key) {
                if(Array.isArray(data) || typeof data === "string") {
                    throw new StorageExceptionInvalidParameter();
                }
                _.set(data || (data = {}), key, value);
            } else {
                data = value;
            }

            if(data === undefined) {
                await super.query("del");
            } else {
                await super.query("set", data);
            }

            return value;
        } else if(typeof key === "number") {
            const data = await super.query("get");

            if(Array.isArray(data) || typeof data === "string") {
                return data[key];
            }

            throw new StorageExceptionInvalidParameter();
        }

        throw new StorageExceptionInvalidParameter();
    }

    async del(sql, key) {
        Log.v(StorageExtensionJson.#tag, `del(${JSON.stringify(sql)}, ${JSON.stringify(key)})`);

        if(typeof key === "string") {
            if(key) {
                let data = await super.query("get");
                if(data === undefined) {
                    return undefined;
                }

                if(_.get(data, key)){
                    _.set(data, key, undefined);

                    await super.query("set", [data]);
                }
            } else {
                await super.query("del");
            }
            return undefined;
        }

        throw new StorageExceptionInvalidParameter();
    }
}
