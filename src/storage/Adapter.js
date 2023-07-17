import Log from "@novemberizing/log";

import StorageExceptionUnimplemented from "./exception/Unimplemented.js";
import StorageExceptionUninitialized from "./exception/Uninitialized.js";

export default class StorageAdapter {
    static #tag = "StorageAdapter";

    #url = null;
    #config = null;

    get url(){ return this.#url; }
    get config(){ return this.#config; }

    constructor(url, config = undefined) {
        Log.v(StorageAdapter.#tag, `constructor(${url}, ${config})`);

        if(!url) {
            throw new StorageExceptionUninitialized(`StorageAdapter.constructor(${url}, ${config})`);
        }

        this.#url = url;
        this.#config = config;
    }

    async query(sql, ...args) {
        Log.v(StorageAdapter.#tag, `query(${JSON.stringify(sql)}, ${JSON.stringify(args)})`);

        throw new StorageExceptionUnimplemented(`StorageAdapter.query(${sql}, ${args})`);
    }

    async close() {
        Log.v(StorageAdapter.#tag, `close()`);
    }
}