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
exports.initializeMariaDB = void 0;
const options_1 = __importDefault(require("./options"));
const knex = require("knex")(options_1.default);
const initializeMariaDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("voy a tratar de inicializar");
    yield knex.schema.dropTableIfExists("products");
    yield knex.schema.dropTableIfExists("carts");
    // console.log("Tabla borrada...");
    yield knex.schema.createTable("products", (table) => {
        table.increments("id"),
            table.timestamp("timestamp").defaultTo(knex.fn.now()),
            table.string("name"),
            table.string("description"),
            table.string("code"),
            table.string("thumbnail"),
            table.integer("price"),
            table.integer("stock");
    });
    yield knex.schema.createTable("carts", (table) => {
        table.increments("id"),
            table.timestamp("timestamp").defaultTo(knex.fn.now()),
            table.string("products");
    });
    // console.log("table created");
});
exports.initializeMariaDB = initializeMariaDB;
class DAOMySQL {
    constructor() {
        this.getAll = (table) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield knex.from(table).select("*");
            }
            catch (error) {
                console.log(error);
            }
            return [];
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
            const SQLConditions = {};
            if (name)
                SQLConditions.name = name;
            if (code)
                SQLConditions.code = code;
            try {
                const query = yield knex
                    .from(table)
                    .select("*")
                    .whereBetween("price", [minPrice, maxPrice])
                    .whereBetween("stock", [minStock, maxStock])
                    .where(SQLConditions);
                return query;
            }
            catch (error) {
                console.log(error);
            }
            return [];
        });
        this.getOne = (table, id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield knex.from(table).where("id", "=", id);
                console.log("getProductFromDB", response);
                if (response.length)
                    return response;
            }
            catch (error) {
                console.log(error);
            }
            return;
        });
        this.getOneByUsername = (table, username) => __awaiter(this, void 0, void 0, function* () {
            return [];
        });
        this.addElement = (table, product) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield knex(table).insert(product);
                return response;
            }
            catch (error) {
                console.log(error);
            }
            return;
        });
        this.deleteElement = (table, id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield knex.from(table).where("id", "=", id).del();
                console.log(response);
                return response;
            }
            catch (error) {
                console.log(error);
            }
            return;
        });
        this.updateElement = (table, id, product) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield knex
                    .from(table)
                    .where("id", "=", id)
                    .update(product);
                return response;
            }
            catch (error) {
                console.log(error);
            }
            return;
        });
        this.addElementToArray = (table, newElementToAdd) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = newElementToAdd;
                yield knex(table).insert({ products: id });
            }
            catch (error) {
                console.log(error);
            }
            return newElementToAdd;
        });
        this.removeElementFromCollection = (table, idToRemove) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield knex.from(table).where("id", "=", idToRemove);
                yield knex.from(table).where("id", "=", idToRemove).del();
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = DAOMySQL;
