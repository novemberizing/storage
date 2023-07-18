/**
 * @module      Storage
 */
import Log from "@novemberizing/log";

import StorageAdapterFactory from "./storage/adapter/Factory.js";
import StorageExtensionFactory from "./storage/extension/Factory.js";

import StorageExceptionUninitialized from "./storage/exception/Uninitialized.js";

/**
 * @class
 * 
 * A storage object is an object that can perform queries by accessing the storage specified by URL.
 */
export default class Storage {
    static #tag = "Storage";

    #url = null;
    #adapter = null;
    #extension = null;

    get url(){ return this.#url; }

    /**
     * Create a storage object.
     * 
     * @param {Object} config  config
     * 
| Field     | Type   | Description                                               |
| --------- | ------ | --------------------------------------------------------- |
| url       | URL    | URL containing storage information                        |
| adapter   | Object | Additional information needed to create a storage adapter |
| extension | Object | Additional features used by the agent                     |
     */
    constructor(config = undefined) {
        Log.v(Storage.#tag, `constructor(${JSON.stringify(config)})`);

        try {
            this.#url = new URL(config.url);
            this.#adapter = StorageAdapterFactory.gen(this.#url, config.adapter);
            this.#extension = StorageExtensionFactory.gen(this.#url, this.#adapter, config.extension);
        } catch(e) {
            throw new StorageExceptionUninitialized(`Storage.constructor(${JSON.stringify(config)})`, e);
        }
    }

    /**
     * Executes commands to storage
     * 
     * @param   {String}    sql     command
     * @param   {...any}    args    arguments
     * @return  Object              result      
     */
    async query(sql, ...args) {
        Log.v(Storage.#tag, `query(${JSON.stringify(sql)}, ${JSON.stringify(args)})`);

        return this.#extension.query(sql, ...args);
    }

    /**
     * Close storage.
     * 
     * @example     await o.close();
     */
    async close() {
        Log.v(Storage.#tag, `close()`);

        await this.#adapter.close();
    }
}
