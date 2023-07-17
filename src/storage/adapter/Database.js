import _ from "lodash";

import Log from "@novemberizing/log";

import StorageAdapter from "../Adapter.js";

export default class StorageAdapterDatabase extends StorageAdapter {
    static #tag = "StorageAdapterDatabase";
    
    #host = null;
    #user = null;
    #port = null;
    #database = null;

    get host(){ return this.#host; }
    get user(){ return this.#user; }
    get port(){ return this.#port; }
    get database(){ return this.#database; }

    constructor(url, config = undefined) {
        super(url, config);

        Log.v(StorageAdapterDatabase.#tag, `constructor(${JSON.stringify(url)}, ${JSON.stringify(config)})`);

        this.#host = url.hostname;
        this.#user = url.username;
        this.#port = parseInt(url.port || 3306);
        this.#database = _.nth(url.pathname.split("/"), 1);
    }
}
