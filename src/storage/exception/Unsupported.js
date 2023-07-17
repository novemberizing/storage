import StorageException from "../Exception.js";

export default class StorageExceptionUnsupported extends StorageException {
    constructor(message, original = undefined) {
        super(message, original);
    }
}