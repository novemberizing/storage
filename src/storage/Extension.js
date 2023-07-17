import Log from "@novemberizing/log";

import StorageExceptionUninitialized from "./exception/Uninitialized.js";

export default class StorageExtension {
    static #tag = "StorageExtension";

    #url = null;
    #adapter = null;

    get url(){ return this.#url; }

    constructor(url, adapter) {
        Log.v(StorageExtension.#tag, `constructor(${url}, ${adapter})`);

        if(!url || !adapter) {
            throw new StorageExceptionUninitialized(`Extension.constructor(${url}, ${adapter})`);
        }

        this.#url = url;
        this.#adapter = adapter;
    }

    async query(sql, ...args) {
        Log.v(StorageExtension.#tag, `query(${JSON.stringify(sql)}, ${JSON.stringify(args)})`);

        return await this.#adapter.query(sql, ...args);
    }
}