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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const DAOFactory_1 = __importDefault(require("../DAO/DAOFactory"));
const config_1 = __importDefault(require("../DAO/config"));
const DAO = new DAOFactory_1.default().getDAO(config_1.default);
const table = "users";
class User {
    constructor(username, password) {
        this.save = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield DAO.addElement(table, this);
                console.log(response);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.username = username;
        this.password = password;
    }
    static validatePassword(user, password) {
        return user.password === password;
    }
}
exports.default = User;
_a = User;
User.findOne = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield DAO.getOneByUsername(table, username);
        if (response)
            return response[0];
        else
            return response;
    }
    catch (error) {
        console.log(error);
    }
    return {};
});
User.getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield DAO.getOne(table, id);
        if (response === null || response === void 0 ? void 0 : response.length)
            return response[0];
        else
            return {};
    }
    catch (error) {
        console.log(error);
    }
    return {};
});
User.findOrCreate = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield User.getUserById(id);
        if (!Object.values(response)) {
            const newUser = new User("", "");
            yield newUser.save();
            return newUser;
        }
        return response;
    }
    catch (error) { }
    return {};
});
