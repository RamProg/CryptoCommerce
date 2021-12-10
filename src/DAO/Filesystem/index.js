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
const fs_1 = __importDefault(require("fs"));
class Memory {
    constructor() {
        this.getAll = (table) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = fs_1.default.readFileSync(`src/DAO/Filesystem/data/${table}.json`, "utf-8");
                return JSON.parse(response);
            }
            catch (error) {
                console.log(error);
            }
            return [];
        });
        this.getAllWithConditions = (table, conditions) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = fs_1.default.readFileSync(`src/DAO/Filesystem/data/${table}.json`, "utf-8");
                let parsed = JSON.parse(response);
                let minPrice = conditions.minPrice ? conditions.minPrice : 0;
                let minStock = conditions.minStock ? conditions.minStock : 0;
                let maxPrice = conditions.maxPrice
                    ? conditions.maxPrice
                    : Number.MAX_SAFE_INTEGER;
                let maxStock = conditions.maxStock
                    ? conditions.maxStock
                    : Number.MAX_SAFE_INTEGER;
                const { name, code } = conditions;
                if (name)
                    parsed = parsed.filter((e) => e.name === name);
                if (code)
                    parsed = parsed.filter((e) => e.code === code);
                parsed = parsed.filter((e) => e.price <= maxPrice && e.price >= minPrice);
                parsed = parsed.filter((e) => e.stock <= maxStock && e.stock >= minStock);
                return parsed;
            }
            catch (error) {
                console.log(error);
            }
            return [];
        });
        this.getOne = (table, id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = fs_1.default.readFileSync(`src/DAO/Filesystem/data/${table}.json`, "utf-8");
                const list = JSON.parse(response);
                const element = list.find((e) => e.id === id);
                return [element];
            }
            catch (error) {
                console.log(error);
            }
            return [];
        });
        this.getOneByUsername = (table, username) => __awaiter(this, void 0, void 0, function* () {
            return [];
        });
        this.addElement = (table, element) => __awaiter(this, void 0, void 0, function* () {
            try {
                const oldElements = yield this.getAll(table);
                const allElements = (oldElements === null || oldElements === void 0 ? void 0 : oldElements.length)
                    ? [...oldElements, element]
                    : [element];
                const allElementsString = JSON.stringify(allElements);
                fs_1.default.writeFileSync(`src/DAO/Filesystem/data/${table}.json`, allElementsString);
            }
            catch (error) {
                console.log(error);
            }
            return {};
        });
        this.deleteElement = (table, id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = fs_1.default.readFileSync(`src/DAO/Filesystem/data/${table}.json`, "utf-8");
                const list = JSON.parse(response);
                const element = list.find((e) => e.id === id);
                const newList = list.filter((e) => e.id !== id);
                fs_1.default.writeFileSync(`src/DAO/Filesystem/data/${table}.json`, JSON.stringify(newList));
                return element;
            }
            catch (error) {
                console.log(error);
            }
            return;
        });
        this.updateElement = (table, id, element) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = fs_1.default.readFileSync(`src/DAO/Filesystem/data/${table}.json`, "utf-8");
                const list = [...JSON.parse(response)];
                const idx = list.findIndex((e) => e.id === id);
                list[idx] = element;
                fs_1.default.writeFileSync(`src/DAO/Filesystem/data/${table}.json`, JSON.stringify(list));
                return list[idx];
            }
            catch (error) {
                console.log(error);
            }
            return undefined;
        });
        this.addElementToArray = (table, newElementToAdd) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = fs_1.default.readFileSync(`src/DAO/Filesystem/data/${table}.json`, "utf-8");
                let list = JSON.parse(response);
                if (!(list === null || list === void 0 ? void 0 : list.length)) {
                    list = [{ id: "1", timestamp: new Date().toString(), products: [] }];
                }
                list[0].products.push(newElementToAdd);
                fs_1.default.writeFileSync(`src/DAO/Filesystem/data/${table}.json`, JSON.stringify(list));
            }
            catch (error) {
                console.log(error);
            }
            return newElementToAdd;
        });
        this.removeElementFromCollection = (table, idToRemove) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = fs_1.default.readFileSync(`src/DAO/Filesystem/data/${table}.json`, "utf-8");
                const list = JSON.parse(response);
                const idx = list[0].products.findIndex((e) => e.id === idToRemove);
                const result = list[0].products[idx];
                list[0].products.splice(idx, 1);
                fs_1.default.writeFileSync(`src/DAO/Filesystem/data/${table}.json`, JSON.stringify(list));
                return result;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = Memory;
