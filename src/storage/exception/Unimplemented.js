import StorageException from "../Exception.js";

export default class StorageExceptionUnimplemented extends StorageException {
    constructor(message, original = undefined) {
        super(message, original);
    }
}