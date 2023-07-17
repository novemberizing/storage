import StorageException from "../Exception.js";

export default class StorageExceptionUninitialized extends StorageException {
    constructor(message, original = undefined) {
        super(message, original);
    }
}