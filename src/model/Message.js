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
const DAOFactory_1 = __importDefault(require("../DAO/DAOFactory"));
const config_1 = __importDefault(require("../DAO/config"));
const table = "messages";
const DAO = new DAOFactory_1.default().getDAO(config_1.default);
class Message {
    constructor(mail, time, content) {
        this.mail = mail;
        this.time = time;
        this.content = content;
    }
    static addMessage(mail, time, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new Message(mail, time, content);
            try {
                DAO.addElement(table, newMessage);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = Message;
Message.getAllMessages = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield DAO.getAll(table);
            return response;
        }
        catch (error) {
            console.log(error);
        }
        return [];
    });
};
