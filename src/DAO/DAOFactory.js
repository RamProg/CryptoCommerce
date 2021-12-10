"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Memory_1 = __importDefault(require("./Memory"));
const Filesystem_1 = __importDefault(require("./Filesystem"));
const Firebase_1 = __importDefault(require("./Firebase"));
const MongoDBaaS_1 = __importDefault(require("./MongoDBaaS"));
const MongoDBLocal_1 = __importDefault(require("./MongoDBLocal"));
const MySQL_1 = __importDefault(require("./MySQL"));
const SQLite_1 = __importDefault(require("./SQLite"));
class DAOFactory {
    getDAO(persistanceType) {
        switch (persistanceType) {
            case 0:
                return new Memory_1.default();
            case 1:
                return new Filesystem_1.default();
            case 2:
                return new MySQL_1.default();
            case 4:
                return new SQLite_1.default();
            case 5:
                return new MongoDBLocal_1.default();
            case 6:
                return new MongoDBaaS_1.default();
            case 7:
                return new Firebase_1.default();
            default:
                return new Memory_1.default();
        }
    }
}
exports.default = DAOFactory;
