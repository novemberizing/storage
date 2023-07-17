import Log from "@novemberizing/log";

export default class StorageException extends Error {
    static #tag = "StorageException";

    #original = null;

    get original(){ return this.#original; }

    constructor(message, original = undefined) {
        super(message);

        this.#original = original;

        if(this.#original) {
            Log.w(StorageException.#tag, original);
        }
    }
}