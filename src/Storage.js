import Log from "@novemberizing/log";

import StorageAdapterFactory from "./storage/adapter/Factory.js";
import StorageExtensionFactory from "./storage/extension/Factory.js";

import StorageExceptionUninitialized from "./storage/exception/Uninitialized.js";

export default class Storage {
    static #tag = "Storage";

    #url = null;
    #adapter = null;
    #extension = null;

    get url(){ return this.#url; }

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

    async query(sql, ...args) {
        Log.v(Storage.#tag, `query(${JSON.stringify(sql)}, ${JSON.stringify(args)})`);

        return this.#extension.query(sql, ...args);
    }

    async close() {
        Log.v(Storage.#tag, `close()`);

        await this.#adapter.close();
    }
}
