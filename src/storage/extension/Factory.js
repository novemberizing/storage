import Log from "@novemberizing/log";

import path from "path";

import StorageExtension from "../Extension.js";

import StroageExtensionConfig from "./Config.js";
import StroageExtensionJson from "./Json.js";

export default class StorageExtensionFactory {
    static #tag = "StorageExtensionFactory";

    static #extensions = new Map();

    static {
        StorageExtensionFactory.#extensions.set("", StorageExtension);

        StorageExtensionFactory.#extensions.set(".json", StroageExtensionJson);
    }

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