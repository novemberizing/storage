import Log from "@novemberizing/log";

import fs from "fs/promises";
import path from "path";

import StorageAdapter from "../Adapter.js";
import StorageExceptionUnsupported from "../exception/Unsupported.js";

export default class StorageAdapterFile extends StorageAdapter {
    static #tag = "StorageAdapterFile";

    #path = null;
    #extension = null;

    constructor(url, config = undefined) {
        super(url, config);

        Log.v(StorageAdapterFile.#tag, `constructor(${JSON.stringify(url)}, ${JSON.stringify(config)})`);

        this.#path = url.hostname + url.pathname;
        this.#extension = path.extname(url.pathname);
    }

    async query(sql, ...args) {
        Log.v(StorageAdapterFile.#tag, `query(${JSON.stringify(sql)}, ${JSON.stringify(args)})`);
        switch(sql) {
            case "get":     return await this.get();
            case "set":     return await this.set(args[0]);
            case "del":     return await this.del();
        }

        throw new StorageExceptionUnsupported(`StorageAdapterFile.query(${sql}, ${args})`);
    }

    async get() {
        Log.v(StorageAdapterFile.#tag, `get()`);

        try {
            const data = await fs.readFile(this.#path, { encoding: "utf8" });

            if(data === "") {
                return null;
            }

            if(this.#extension === ".json") {
                return JSON.parse(data);
            }

            return data;
        } catch(e) {
            Log.w(StorageAdapterFile.#tag, e);

            return undefined;
        }
    }

    async set(value) {
        Log.v(StorageAdapterFile.#tag, `set(${JSON.stringify(value)})`);

        if(value === undefined) {
            await fs.unlink(this.#path);

            return value;
        }
        if(value === null) {
            if(this.#extension === ".json") {
                await fs.writeFile(this.#path, "null", { encoding: "utf8" });
            } else {
                await fs.writeFile(this.#path, "", { encoding: "utf8" });
            }

            return value;
        }

        switch(this.#extension) {
            case ".json":       value = JSON.stringify(value, null, "\t");      break;
        }

        await fs.writeFile(this.#path, value, { encoding: "utf8" });

        return value;
    }

    async del() {
        Log.v(StorageAdapterFile.#tag, `del()`);

        try {
            await fs.unlink(this.#path);
        } catch(e) {
            Log.w(StorageAdapterFile.#tag, e);
        }
        
        return undefined;
    }
}