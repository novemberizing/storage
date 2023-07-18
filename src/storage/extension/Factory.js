/**
 * @module      StorageExtensionFactory
 */
import Log from "@novemberizing/log";

import path from "path";

import StorageExtension from "../Extension.js";

import StroageExtensionConfig from "./Config.js";
import StroageExtensionJson from "./Json.js";

/**
 * @class
 * 
 * Storage Extension Factory
 * 
 * Create storage extension object by extension of storage URL or defined extension setting.
 * 
 */
export default class StorageExtensionFactory {
    static #tag = "StorageExtensionFactory";

    static #extensions = new Map();

    static {
        StorageExtensionFactory.#extensions.set("", StorageExtension);

        StorageExtensionFactory.#extensions.set(".json", StroageExtensionJson);
    }

    /**
     * Generate storate extension object.
     * 
     * @param {URL}             url         URL containing storage access information
     * @param {StorageAdapter}  adapter     Storage adapter object
     * @param {Object}          config      Extension settings
     * @return  StorageExtension            Storage extension object
     */
    static gen(url, adapter, config = undefined) {
        Log.v(StorageExtensionFactory.#tag, `StorageExtensionFactory.gen(${url}, ${adapter}, ${config})`);

        // EXTENSION BUILDER ...

        if(config) {
            return new StroageExtensionConfig(url, adapter, config);
        }

        const Extension = StorageExtensionFactory.#extensions.get(path.extname(url.pathname));

        if(Extension) {
            return new Extension(url, adapter, config);
        }

        return new StorageExtension(url, adapter);
    }
}