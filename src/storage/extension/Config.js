/**
 * @module      StorageExtensionConfig
 */
import _ from "lodash";

import Log from "@novemberizing/log";

import StorageExtension from "../Extension.js";

import StorageExceptionUninitialized from "../exception/Uninitialized.js";
import StorageExceptionUnsupported from "../exception/Unsupported.js";

/**
 * @class
 * 
 * Storage Extension Config
 * 
 * Storage extension object by configuration
 */
export default class StroageExtensionConfig extends StorageExtension {
    static #tag = "StroageExtensionConfig";

    static #types = new Map();

    /**
     * Register object type.
     * 
     * @param {Object}  type        object type
     */
    static reg(type) {
        StroageExtensionConfig.#types.set(type.name, type);
    }

    #config = null;

    /**
     * Create storate extension config object.
     * 
     * @param {URL}             url         URL containing storage access information
     * @param {StorageAdapter}  adapter     Storage adapter object
     * @param {Object}          config      Settings that define extended commands
     */
    constructor(url, adapter, config) {
        super(url, adapter);

        if(!config) {
            throw new StorageExceptionUninitialized();
        }

        this.#config = config;
    }

    /**
     * If there is an extended command, the defined command is substituted and executed.
     * Otherwise, the command given through the adapter is executed.
     * 
     * @param   {String} name       command
     * @param   {...any} args       argument
     * @return                      result
     */
    async query(name, ...args) {
        Log.v(StroageExtensionConfig.#tag, `query(${JSON.stringify(name)}, ${JSON.stringify(args)})`);

        const func = this.#config[name];

        if(func) {
            const result = func.sql ? await super.query(func.sql, ...args) : undefined;

            if(func.result === undefined) {
                return result;
            }

            if(func.result === null) {
                return null;
            }

            if(func.result && !Array.isArray(func.result)) {
                func.result = [func.result];
            }

            return func.result.reduce((accumulator, current) => {
                if(current) {
                    if(current.get) {
                        if(Array.isArray(accumulator)) {
                            return accumulator.map(o => _.get(o, current.get));
                        }
                        return _.get(accumulator, current.get);
                    } else if(current.type) {
                        const Type = StroageExtensionConfig.#types.get(current.type);
                        if(Type) {
                            if(Array.isArray(accumulator)) {
                                return accumulator.map(o => new Type(o));
                            }
                            return new Type(accumulator);
                        }

                        throw new StorageExceptionUnsupported();
                    } else if(current.value) {
                        return current.value;
                    }
                }
                return accumulator;
            }, result);
        }

        return super.query(name, ...args);
    }
}