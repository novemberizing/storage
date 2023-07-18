/**
 * @module      StorageAdapterMemory
 */
import Log from "@novemberizing/log";

import StorageAdapter from "../Adapter.js";

import StorageExceptionUninitialized from "../exception/Uninitialized.js";
import StorageExceptionUnsupported from "../exception/Unsupported.js";

/**
 * @class
 * 
 * Memory based storage adapter
 */
export default class StorageAdapterMemory extends StorageAdapter {
    static #tag = "StorageAdapterMemory";

    static #map = new Map();

    #name = null;

    get name(){ return this.#name; }

    /**
     * Create storage adapter memory
     * 
     * @param {URL}     url         URL containing storage access information
     * @param {Object}  config      Configuration that contains the information needed to create an adapter for storage located at the URL
     */
    constructor(url, config = undefined) {
        super(url, config);

        Log.v(StorageAdapterMemory.#tag, `constructor(${JSON.stringify(url)}, ${JSON.stringify(config)})`);

        if(!url.pathname) {
            throw new StorageExceptionUninitialized(`StorageAdapterMemory.constructor(${url}, ${config})`);
        }

        this.#name = url.hostname + url.pathname;
    }

    /**
     * Execute the command and return the result
     * 
     * @param   {String} sql        command
     * @param   {...any} args       argument
     * @return                      result
     */
    async query(sql, ...args) {
        Log.v(StorageAdapterMemory.#tag, `query(${JSON.stringify(sql)}, ${JSON.stringify(args)})`);
        
        switch(sql) {
            case "get":     return this.get();
            case "set":     return this.set(args[0]);
            case "del":     return this.del();
        }

        throw new StorageExceptionUnsupported(`StorageAdapterMemory.query(${sql}, ${args})`)
    }

    /**
     * Close adapter
     * 
     */
    async close() {
        Log.v(StorageAdapterMemory.#tag, `close()`);
    }

    /**
     * Get all data in the memory
     * 
     * @return  Object      data stored in memory
     */
    get() {
        Log.v(StorageAdapterMemory.#tag, `get()`);
        return StorageAdapterMemory.#map.get(this.#name);
    }

    /**
     * Set data in the memory
     * 
     * @param {Object} value        data
     * @returns Object              stored data
     */
    set(value) {
        Log.v(StorageAdapterMemory.#tag, `set(${value})`);

        StorageAdapterMemory.#map.set(this.#name, value)

        return value;
    }

    /**
     * Delete data in the memory
     * 
     * @return Object               always return undefined
     */
    del() {
        Log.v(StorageAdapterMemory.#tag, `del()`);

        StorageAdapterMemory.#map.delete(this.#name);

        return undefined;
    }
}