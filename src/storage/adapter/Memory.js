import Log from "@novemberizing/log";

import StorageAdapter from "../Adapter.js";

import StorageExceptionUninitialized from "../exception/Uninitialized.js";
import StorageExceptionUnsupported from "../exception/Unsupported.js";

export default class StorageAdapterMemory extends StorageAdapter {
    static #tag = "StorageAdapterMemory";

    static #map = new Map();

    #name = null;

    get name(){ return this.#name; }

    constructor(url, config = undefined) {
        super(url, config);

        Log.v(StorageAdapterMemory.#tag, `constructor(${JSON.stringify(url)}, ${JSON.stringify(config)})`);

        if(!url.pathname) {
            throw new StorageExceptionUninitialized(`StorageAdapterMemory.constructor(${url}, ${config})`);
        }

        this.#name = url.hostname + url.pathname;
    }

    async query(sql, ...args) {
        Log.v(StorageAdapterMemory.#tag, `query(${JSON.stringify(sql)}, ${JSON.stringify(args)})`);
        
        switch(sql) {
            case "get":     return this.get();
            case "set":     return this.set(args[0]);
            case "del":     return this.del();
        }

        throw new StorageExceptionUnsupported(`StorageAdapterMemory.query(${sql}, ${args})`)
    }

    async close() {
        Log.v(StorageAdapterMemory.#tag, `close()`);
    }

    get() {
        Log.v(StorageAdapterMemory.#tag, `get()`);
        return StorageAdapterMemory.#map.get(this.#name);
    }

    set(value) {
        Log.v(StorageAdapterMemory.#tag, `set(${value})`);

        StorageAdapterMemory.#map.set(this.#name, value)

        return value;
    }

    del() {
        Log.v(StorageAdapterMemory.#tag, `del()`);

        StorageAdapterMemory.#map.delete(this.#name);

        return undefined;
    }
}