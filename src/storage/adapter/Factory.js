/**
 * @module          StorageAdapterFactory
 */
import Log from "@novemberizing/log";

import StorageAdapterMemory from "./Memory.js";
import StorageAdapterFile from "./File.js";
import StorageAdapterDatabaseMysql from "./database/Mysql.js";

import StorageExceptionUnsupported from "../exception/Unsupported.js";

/**
 * @class
 * 
 * Storage adapter factory
 * 
 * Factory class to create a storage adapter with a URL and configuration
 */
export default class StorageAdapterFactory {
    static #tag = "StorageAdapterFactory";
    
    static #adapters = new Map();

    static {
        StorageAdapterFactory.#adapters.set("mem:", StorageAdapterMemory);
        StorageAdapterFactory.#adapters.set("fs:", StorageAdapterFile);
        StorageAdapterFactory.#adapters.set("mysql:", StorageAdapterDatabaseMysql);
    }

    /**
     * Generate storage adapter
     * 
     * @param   {URL} url           URL containing storage access information
     * @param   {Object} config     Additional information needed to create an adapter to use the storage located at the URL
     * @return  StorageAdapter
     */
    static gen(url, config = undefined) {
        Log.v(StorageAdapterFactory.#tag, `gen(${url}, ${config})`);

        const AdapterClass = StorageAdapterFactory.#adapters.get(url.protocol);
        if(AdapterClass) {
            return new AdapterClass(url, config);
        }

        throw new StorageExceptionUnsupported(`StorageAdapterFactory.gen(${url}, ${config})`);
    }
}