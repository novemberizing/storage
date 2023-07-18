/**
 * @module          StorageAdapterDatabase
 */
import _ from "lodash";

import Log from "@novemberizing/log";

import StorageAdapter from "../Adapter.js";

/**
 * @class
 * 
 * Storage Adapter Database
 * 
 * A class that abstracts a database adapter
 */
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

    /**
     * Database adapter abstract class constructor
     * 
     * @param {URL}     url         Storage access information URL
     * @param {Object}  config      Additional information to create an adapter that uses storage located at the URL
     */
    constructor(url, config = undefined) {
        super(url, config);

        Log.v(StorageAdapterDatabase.#tag, `constructor(${JSON.stringify(url)}, ${JSON.stringify(config)})`);

        this.#host = url.hostname;
        this.#user = url.username;
        this.#port = parseInt(url.port || 3306);
        this.#database = _.nth(url.pathname.split("/"), 1);
    }
}
