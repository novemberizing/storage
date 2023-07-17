import StorageExceptionInvalid from "../Invalid.js";

export default class StorageExceptionInvalidParameter extends StorageExceptionInvalid {
    constructor(message, original = undefined) {
        super(message, original);
    }
}