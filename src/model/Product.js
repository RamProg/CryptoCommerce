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
const table = "products";
const DAO = new DAOFactory_1.default().getDAO(config_1.default);
const getLastId = () => {
    return 0;
};
let lastId = getLastId();
class Product {
    constructor(name, description, code, thumbnail, price, stock) {
        this.id = Product.generateId().toString();
        this.timestamp = new Date().getTime().toString();
        this.name = name;
        this.description = description;
        this.code = code;
        this.thumbnail = thumbnail;
        this.price = price;
        this.stock = stock;
    }
    static generateId() {
        return (++lastId).toString();
    }
    static getProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield DAO.getOne(table, id);
                return response;
            }
            catch (error) {
                console.log(error);
            }
            return;
        });
    }
    static save(name, description, code, thumbnail, price, stock) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProduct = new Product(name, description, code, thumbnail, price, stock);
            try {
                yield DAO.addElement(table, newProduct);
            }
            catch (error) {
                console.log(error);
            }
            return newProduct;
        });
    }
    static update(id, name, description, code, thumbnail, price, stock) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundProducts = yield this.getProduct(id);
            const productToUpdate = foundProducts ? foundProducts[0] : undefined;
            console.log("busque un producto");
            if (!productToUpdate)
                return;
            if (name)
                productToUpdate.name = name;
            if (description)
                productToUpdate.description = description;
            if (code)
                productToUpdate.code = code;
            if (thumbnail)
                productToUpdate.thumbnail = thumbnail;
            if (price)
                productToUpdate.price = price;
            if (stock)
                productToUpdate.stock = stock;
            try {
                console.log("me tengoq ue meter a actualizar");
                yield DAO.updateElement(table, id, productToUpdate);
            }
            catch (error) {
                console.log(error);
            }
            return productToUpdate;
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.getProduct(id);
            try {
                yield DAO.deleteElement(table, id);
                return product;
            }
            catch (error) {
                console.log(error);
            }
            return;
        });
    }
}
exports.default = Product;
Product.getProducts = function () {
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
Product.getProductsIf = function (conditions) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Object.keys(conditions))
            return yield Product.getProducts();
        try {
            const response = yield DAO.getAllWithConditions(table, conditions);
            return response;
        }
        catch (error) {
            console.log(error);
        }
        return [];
    });
};
