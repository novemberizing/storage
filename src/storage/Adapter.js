/**
 * @module      StorageAdapter
 */
import Log from "@novemberizing/log";

import StorageExceptionUnimplemented from "./exception/Unimplemented.js";
import StorageExceptionUninitialized from "./exception/Uninitialized.js";

/**
 * @class
 * 
 * Storage adapter object
 * 
 * A storage adapter object is an object that executes commands on storage and outputs the results.
 */
export default class StorageAdapter {
    static #tag = "StorageAdapter";

    #url = null;
    #config = null;

    get url(){ return this.#url; }
    get config(){ return this.#config; }

    /**
     * Create a storage adapter object
     * 
     * @param {Object} url          URL containing storage access information
     * @param {Object} config       Additional information required to use the adapter
     */
    constructor(url, config = undefined) {
        Log.v(StorageAdapter.#tag, `constructor(${url}, ${config})`);

        if(!url) {
            throw new StorageExceptionUninitialized(`StorageAdapter.constructor(${url}, ${config})`);
        }

        this.#url = url;
        this.#config = config;
    }

    /**
     * Executes commands to storage and outputs results
     * 
     * @param {Object} sql      command
     * @param {...any} args     arguments
     * @return  Object          result
     */
    async query(sql, ...args) {
        Log.v(StorageAdapter.#tag, `query(${JSON.stringify(sql)}, ${JSON.stringify(args)})`);

        throw new StorageExceptionUnimplemented(`StorageAdapter.query(${sql}, ${args})`);
    }

    /**
     * Terminate the connection with the storage
     */
    async close() {
        Log.v(StorageAdapter.#tag, `close()`);
    }
}