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
const mongoose_1 = require("mongoose");
const connectionMongoDB_1 = require("./options/connectionMongoDB");
const ProductSchema = new mongoose_1.Schema({
    timestamp: { type: Date, require: true },
    name: { type: String, require: true, max: 50 },
    description: { type: String, require: true, max: 140 },
    code: { type: String, require: true, max: 5 },
    thumbnail: { type: String, require: true, max: 140 },
    price: { type: Number, require: true },
    stock: { type: Number, require: true },
});
const CartSchema = new mongoose_1.Schema({
    timestamp: Date,
    products: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "products",
        },
    ],
});
class ProductDAOMongoLocal {
    constructor() {
        this.products = mongoose_1.model("products", ProductSchema);
        this.carts = mongoose_1.model("carts", CartSchema);
        this.getAll = (table) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield connectionMongoDB_1.connect();
                const collection = yield eval("this." + table).find();
                yield connectionMongoDB_1.close();
                return collection;
            }
            catch (error) {
                console.log(error);
                yield connectionMongoDB_1.close();
                return [];
            }
        });
        this.getAllWithConditions = (table, conditions) => __awaiter(this, void 0, void 0, function* () {
            let minPrice = conditions.minPrice ? conditions.minPrice : 0;
            let minStock = conditions.minStock ? conditions.minStock : 0;
            let maxPrice = conditions.maxPrice
                ? conditions.maxPrice
                : Number.MAX_SAFE_INTEGER;
            let maxStock = conditions.maxStock
                ? conditions.maxStock
                : Number.MAX_SAFE_INTEGER;
            const { name, code } = conditions;
            try {
                yield connectionMongoDB_1.connect();
                const mongoConditions = {};
                if (name)
                    mongoConditions.name = name;
                if (code)
                    mongoConditions.code = code;
                mongoConditions.price = { $lte: maxPrice, $gte: minPrice };
                mongoConditions.stock = { $lte: maxStock, $gte: minStock };
                const collection = yield eval("this." + table).find(mongoConditions);
                yield connectionMongoDB_1.close();
                return collection;
            }
            catch (error) {
                console.log(error);
                yield connectionMongoDB_1.close();
                return [];
            }
        });
        this.getOne = (table, _id) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield connectionMongoDB_1.connect();
                const response = yield eval("this." + table).find({ _id });
                if (response.length) {
                    yield connectionMongoDB_1.close();
                    return response;
                }
            }
            catch (error) {
                console.log(error);
                yield connectionMongoDB_1.close();
                return undefined;
            }
        });
        this.getOneByUsername = (table, username) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield connectionMongoDB_1.connect();
                const response = yield eval("this." + table).find({ username });
                if (response.length) {
                    yield connectionMongoDB_1.close();
                    return response;
                }
            }
            catch (error) {
                console.log(error);
                yield connectionMongoDB_1.close();
                return undefined;
            }
        });
        this.addElement = (table, element) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield connectionMongoDB_1.connect();
                const e = new (eval("this." + table))(element);
                yield e.save();
            }
            catch (error) {
                console.log(error);
            }
            yield connectionMongoDB_1.close();
            return element;
        });
        this.deleteElement = (table, id) => __awaiter(this, void 0, void 0, function* () {
            console.log("voy a borrar");
            try {
                yield connectionMongoDB_1.connect();
                const result = yield eval("this." + table).findById(id);
                const response = yield eval("this." + table).findByIdAndDelete(id);
                console.log("esto tengo que borrar", response);
                return result;
            }
            catch (error) {
                console.log(error);
            }
            yield connectionMongoDB_1.close();
        });
        this.updateElement = (table, id, element) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield connectionMongoDB_1.connect();
                const response = yield eval("this." + table).updateOne({ id }, element);
                connectionMongoDB_1.close();
                return response;
            }
            catch (error) {
                console.log(error);
            }
            connectionMongoDB_1.close();
            return;
        });
        this.addElementToArray = (table, newElementToAdd) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield connectionMongoDB_1.connect();
                const carts = yield eval("this." + table).find();
                if (!carts.length) {
                    console.log("creo un carrito");
                    const newCart = {
                        timestamp: new Date().toString(),
                        products: [newElementToAdd],
                    };
                    const e = new (eval("this." + table))(newCart);
                    yield e.save();
                    carts.push(newCart);
                }
                else {
                    console.log("ya hay  carrito, solo agrego");
                    yield eval("this." + table).updateOne({}, {
                        $push: {
                            products: newElementToAdd,
                        },
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
            yield connectionMongoDB_1.close();
            return newElementToAdd;
        });
        this.removeElementFromCollection = (table, idToRemove) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield connectionMongoDB_1.connect();
                const carts = yield eval("this." + table).find();
                if (carts.length) {
                    yield eval("this." + table).updateOne({}, { $pull: { products: idToRemove } });
                }
            }
            catch (error) {
                console.log(error);
            }
            yield connectionMongoDB_1.close();
            return {};
        });
    }
}
exports.default = ProductDAOMongoLocal;
