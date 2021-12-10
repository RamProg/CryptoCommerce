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
const connectionFirebase_1 = require("./options/connectionFirebase");
class Memory {
    constructor() {
        this.getAll = (table) => __awaiter(this, void 0, void 0, function* () {
            const result = [];
            try {
                const collectionRef = connectionFirebase_1.db.collection(table);
                const snapshot = yield collectionRef.get();
                snapshot.forEach((doc) => {
                    result.push(Object.assign({ id: doc.id }, doc.data()));
                });
                return result;
            }
            catch (error) {
                console.log(error);
            }
            return result;
        });
        this.getAllWithConditions = (table, conditions) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            let result = [];
            try {
                let minPrice = (_a = conditions.minPrice) !== null && _a !== void 0 ? _a : 0;
                let minStock = (_b = conditions.minStock) !== null && _b !== void 0 ? _b : 0;
                let maxPrice = (_c = conditions.maxPrice) !== null && _c !== void 0 ? _c : Number.MAX_SAFE_INTEGER;
                let maxStock = (_d = conditions.maxStock) !== null && _d !== void 0 ? _d : Number.MAX_SAFE_INTEGER;
                console.log("conditions on firebase", conditions);
                const { name, code } = conditions;
                let collectionRef = connectionFirebase_1.db.collection(table);
                const snapshot = yield collectionRef.get();
                snapshot.forEach((doc) => {
                    result.push(Object.assign({ id: doc.id }, doc.data()));
                });
                if (name)
                    result = result.filter((e) => e.name === name);
                if (code)
                    result = result.filter((e) => e.code === code);
                result = result.filter((e) => e.price <= maxPrice && e.price >= minPrice);
                result = result.filter((e) => e.stock <= maxStock && e.stock >= minStock);
                return result;
            }
            catch (error) {
                console.log(error);
            }
            return result;
        });
        this.getOne = (table, id) => __awaiter(this, void 0, void 0, function* () {
            const result = [];
            try {
                const collectionRef = connectionFirebase_1.db.collection(table);
                const snapshot = yield collectionRef.doc(id).get();
                snapshot.data() && result.push(Object.assign({ id: snapshot.id }, snapshot.data()));
                return result;
            }
            catch (error) {
                console.log(error);
            }
            return result.length ? result[0] : [];
        });
        this.getOneByUsername = (table, username) => __awaiter(this, void 0, void 0, function* () {
            return [];
        });
        this.addElement = (table, element) => __awaiter(this, void 0, void 0, function* () {
            delete element["id"];
            const data = Object.assign({}, element);
            try {
                const collectionRef = connectionFirebase_1.db.collection(table);
                yield collectionRef.doc().set(data);
            }
            catch (error) {
                console.log(error);
            }
            return element;
        });
        this.deleteElement = (table, id) => __awaiter(this, void 0, void 0, function* () {
            const result = [];
            try {
                result.push(yield this.getOne(table, id));
                const collectionRef = connectionFirebase_1.db.collection("products");
                yield collectionRef.doc(id).delete();
            }
            catch (error) {
                console.log(error);
            }
            return result.length ? result[0] : [];
        });
        this.updateElement = (table, id, element) => __awaiter(this, void 0, void 0, function* () {
            const result = [];
            try {
                const collectionRef = connectionFirebase_1.db.collection("products");
                yield collectionRef.doc(id).set(element);
                result.push(yield this.getOne(table, id));
            }
            catch (error) {
                console.log(error);
            }
            return result.length ? result[0] : [];
        });
        this.addElementToArray = (table, newElementToAdd) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield connectionFirebase_1.db.collection(table).doc().set(newElementToAdd);
            }
            catch (error) {
                console.log(error);
            }
            return newElementToAdd;
        });
        this.removeElementFromCollection = (table, idToRemove) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("idToRemove", idToRemove);
                // const doc = await db.collection(table).doc(idToRemove).get();
                // const data = { id: doc.id, ...doc.data() };
                const response = yield connectionFirebase_1.db
                    .collection(table)
                    .where("id", "==", idToRemove)
                    .get();
                if (!response.docs.length)
                    return {};
                const element = response.docs[0];
                yield connectionFirebase_1.db.collection(table).doc(element.id).delete();
                return element;
            }
            catch (error) {
                console.log(error);
            }
            return {};
        });
    }
}
exports.default = Memory;
