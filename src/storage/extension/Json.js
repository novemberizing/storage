/**
 * @module      StorageExtensionJson
 */
import _ from "lodash";

import Log from "@novemberizing/log";

import StorageExtension from "../Extension.js";

import StorageExceptionUnsupported from "../exception/Unsupported.js";
import StorageExceptionInvalidParameter from "../exception/invalid/Parameter.js";

/**
 * @class
 * 
 * Json Storage Extension
 * 
 * A storage extension object that predefines commands used in Json format storage
 */
export default class StorageExtensionJson extends StorageExtension {
    static #tag = "StorageExtensionJson";

    /**
     * Create json storate extension object
     * 
     * @param {URL}             url         URL containing storage access information
     * @param {StorageAdapter}  adapter     Storage adapter object
     * @param {Object}          config      Settings that define extended commands
     */
    constructor(url, adapter, config = undefined) {
        super(url, adapter, config);

        Log.v(StorageExtensionJson.#tag, `constructor(${url}, ${adapter}, ${config})`);
    }

    /**
     * Execute the defined extension command
     * 
     * @param   {String} sql        command
     * @param   {...any} args       argument
     * @return  Object              result
     */
    async query(sql, ...args) {
        Log.v(StorageExtensionJson.#tag, `query(${JSON.stringify(sql)}, ${JSON.stringify(args)})`);

        switch(sql) {
            case "get":     return await this.get(args[0]);
            case "set":     return await this.set(args[0], args[1]);
            case "del":     return await this.del(args[0]);
        }

        throw new StorageExceptionUnsupported(`${StorageExtensionJson.#tag}.query(${JSON.stringify(sql)}, ${JSON.stringify(args)})`);
    }

    /**
     * Get the object that exists at the given key
     *       
     * @param   {String} key        key
     * @returns Object              result
     */
    async get(key) {
        Log.v(StorageExtensionJson.#tag, `${JSON.stringify(key)})`);

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

    /**
     * Inserts a value at the location of the given key
     * 
     * @param {String} key      key
     * @param {Object} value    value
     * @return Object           inserted value
     */
    async set(key, value) {
        Log.v(StorageExtensionJson.#tag, `${JSON.stringify(key)}, ${JSON.stringify(value)})`);

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

    /**
     * Deletes the value that exists at the location of the given key
     * 
     * @param   {Object} key        key
     * @return  Object              always return undefined
     */
    async del(key) {
        Log.v(StorageExtensionJson.#tag, `${JSON.stringify(key)})`);

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
