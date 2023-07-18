/**
 * @module      StorageExtension
 */
import Log from "@novemberizing/log";

import StorageExceptionUninitialized from "./exception/Uninitialized.js";
import StorageAdapter from "./Adapter.js";

/**
 * @class
 * 
 * An extension object that defines commands to be additionally used by the client
 * 
 */
export default class StorageExtension {
    static #tag = "StorageExtension";

    #url = null;
    #adapter = null;

    get url(){ return this.#url; }

    /**
     * Create a storage extension object
     * 
     * @param {Object}          url         URL containing storage information
     * @param {StorageAdapter}  adapter     Storage adapter object
     */
    constructor(url, adapter) {
        Log.v(StorageExtension.#tag, `constructor(${url}, ${adapter})`);

        if(!url || !adapter) {
            throw new StorageExceptionUninitialized(`Extension.constructor(${url}, ${adapter})`);
        }

        this.#url = url;
        this.#adapter = adapter;
    }

    /**
     * Executes commands to storage
     * 
     * @param   {*}         sql         command
     * @param   {...any}    args        arguments
     * @return  Object                  result
     */
    async query(sql, ...args) {
        Log.v(StorageExtension.#tag, `query(${JSON.stringify(sql)}, ${JSON.stringify(args)})`);

        return await this.#adapter.query(sql, ...args);
    }
}