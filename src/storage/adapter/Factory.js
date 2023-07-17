import Log from "@novemberizing/log";

import StorageAdapterMemory from "./Memory.js";
import StorageAdapterFile from "./File.js";
import StorageAdapterDatabaseMysql from "./database/Mysql.js";

import StorageExceptionUnsupported from "../exception/Unsupported.js";

export default class StorageAdapterFactory {
    static #tag = "StorageAdapterFactory";
    
    static #adapters = new Map();

    static {
        StorageAdapterFactory.#adapters.set("mem:", StorageAdapterMemory);
        StorageAdapterFactory.#adapters.set("fs:", StorageAdapterFile);
        StorageAdapterFactory.#adapters.set("mysql:", StorageAdapterDatabaseMysql);
    }

    static gen(url, config = undefined) {
        Log.v(StorageAdapterFactory.#tag, `gen(${url}, ${config})`);

        const AdapterClass = StorageAdapterFactory.#adapters.get(url.protocol);
        if(AdapterClass) {
            return new AdapterClass(url, config);
        }

        throw new StorageExceptionUnsupported(`StorageAdapterFactory.gen(${url}, ${config})`);
    }
}