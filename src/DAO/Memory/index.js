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
Object.defineProperty(exports, "__esModule", { value: true });
const products = [];
const messages = [];
const carts = [];
class Memory {
    constructor() {
        this.getAll = (table) => __awaiter(this, void 0, void 0, function* () {
            return eval(table);
        });
        this.getAllWithConditions = (table, conditions) => __awaiter(this, void 0, void 0, function* () {
            let array = eval(table);
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
                array = array.filter((e) => e.name === name);
            if (code)
                array = array.filter((e) => e.code === code);
            array = array.filter((e) => e.price <= maxPrice && e.price >= minPrice);
            array = array.filter((e) => e.stock <= maxStock && e.stock >= minStock);
            return array;
        });
        this.getOne = (table, id) => __awaiter(this, void 0, void 0, function* () {
            return [eval(table).find((e) => e.id === id)];
        });
        this.getOneByUsername = (table, username) => __awaiter(this, void 0, void 0, function* () {
            return [];
        });
        this.addElement = (table, product) => __awaiter(this, void 0, void 0, function* () {
            eval(table).push(product);
            return product;
        });
        this.deleteElement = (table, id) => __awaiter(this, void 0, void 0, function* () {
            const idx = eval(table).findIndex((e) => e.id === id);
            return eval(table).splice(idx, 1);
        });
        this.updateElement = (table, id, element) => __awaiter(this, void 0, void 0, function* () {
            const idx = eval(table).findIndex((e) => e.id === id);
            console.log(idx);
            if (idx) {
                eval(table)[idx] = element;
                return element;
            }
            else {
                return {};
            }
        });
        this.addElementToArray = (table, newElementToAdd) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = eval(table)[0]) === null || _a === void 0 ? void 0 : _a.products))
                eval(table).push({ id: "1", products: [] });
            if (newElementToAdd)
                eval(table)[0].products.push(newElementToAdd);
            return newElementToAdd;
        });
        this.removeElementFromCollection = (table, idToRemove) => __awaiter(this, void 0, void 0, function* () {
            const idx = eval(table)[0].products.findIndex((e) => e.id === idToRemove);
            const result = eval(table)[0].products[idx];
            eval(table)[0].products.splice(idx, 1);
            return result;
        });
    }
}
exports.default = Memory;
