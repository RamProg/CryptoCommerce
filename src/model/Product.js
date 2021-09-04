"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var products_json_1 = __importDefault(require("../data/products.json"));
var products = products_json_1.default;
var Product = /** @class */ (function () {
    function Product(title, price, thumbnail) {
        this.getProducts = function () {
            return products;
        };
        this.id = this.generateId().toString();
        this.title = title !== null && title !== void 0 ? title : "";
        this.price = price !== null && price !== void 0 ? price : 0;
        this.thumbnail = thumbnail !== null && thumbnail !== void 0 ? thumbnail : "";
    }
    Product.prototype.generateId = function () {
        return products.length + 1;
    };
    Product.prototype.getProduct = function (id) {
        return products.find(function (e) { return e.id === id; });
    };
    Product.prototype.save = function (product) {
        products.push(product);
        return product;
    };
    Product.prototype.update = function (id, title, price, thumbnail) {
        var product = this.getProduct(id);
        if (product) {
            title && (product.title = title);
            price && (product.price = price);
            thumbnail && (product.thumbnail = thumbnail);
        }
        return product;
    };
    Product.prototype.delete = function (id) {
        var deleted = products.find(function (e) { return e.id === id; });
        products = products.filter(function (e) { return e.id !== id; });
        return deleted;
    };
    return Product;
}());
exports.default = Product;
