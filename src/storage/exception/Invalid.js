import StorageException from "../Exception.js";

export default class StorageExceptionInvalid extends StorageException {
    constructor(message, original = undefined) {
        super(message, original);
    }
}