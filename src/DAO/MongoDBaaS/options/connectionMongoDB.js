"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const URI = "mongodb+srv://rama:rama@cluster0.do4gw.mongodb.net/ecommerce?retryWrites=true&w=majority";
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 2000,
};
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Conectando a la base de datos MongoDBaaS...");
            yield mongoose_1.default.connect(URI, dbOptions);
            console.log("conecté");
        }
        catch (error) {
            console.log(error);
        }
        return;
    });
}
exports.connect = connect;
function close() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("voy a cerrar conexión");
            if (mongoose_1.default.connection) {
                yield mongoose_1.default.connection.close();
            }
            console.log("cerre conexión");
        }
        catch (error) {
            console.log(error);
        }
        return;
    });
}
exports.close = close;
