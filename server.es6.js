"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// Server
const express_1 = __importStar(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
// Model
const Product_1 = __importDefault(require("./src/model/Product"));
const Message_1 = __importDefault(require("./src/model/Message"));
// Libraries
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const moment_1 = __importDefault(require("moment"));
const _product = new Product_1.default();
const app = express_1.default();
const httpServer = new http_1.Server(app);
const io = new socket_io_1.Server(httpServer);
const PORT = Number(process.env.PORT) || 8080;
const productsRouter = express_1.Router();
httpServer.listen(PORT, () => {
    console.log("Server listening on port", PORT);
});
httpServer.on("error", (error) => console.log("Error en servidor", error));
io.on("connection", (socket) => {
    socket.on("update", (data) => {
        const { title, price, thumbnail } = data;
        const newProduct = _product.save(new Product_1.default(title, price, thumbnail));
        io.sockets.emit("refresh", newProduct);
    });
    socket.on("newMessage", (data) => {
        const time = moment_1.default().format("DD/MM/YYYY HH:MM:SS").toString();
        data.time = `[${time}]: `;
        Message_1.default.addMessage(data.mail, data.time, data.content);
        io.sockets.emit("newChat", data);
    });
});
app.engine("hbs", express_handlebars_1.default({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
}));
app.set("views", "./views");
app.set("view engine", "hbs");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.use("/api", productsRouter);
app.get("/products/view", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("partials/list", { data: _product.getProducts() });
}));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("layouts/index", {
        data: _product.getProducts(),
        messages: yield Message_1.default.getAllMessages(),
    });
}));
productsRouter.get("/products/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(_product.getProducts());
}));
productsRouter.get("/products/list/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const products = _product.getProducts();
    if (!(products === null || products === void 0 ? void 0 : products.length))
        res.json({ error: "No available data" });
    const product = _product.getProduct((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    product ? res.json(product) : res.json({ error: "Product doesn't exist" });
}));
productsRouter.post("/products/save", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, price, thumbnail } = req.body;
    _product.save(new Product_1.default(title, price, thumbnail));
}));
productsRouter.put("/products/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { title, price, thumbnail } = req.body;
    res.json(_product.update((_b = req.params) === null || _b === void 0 ? void 0 : _b.id, title, price, thumbnail));
}));
productsRouter.delete("/products/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    res.json(_product.delete((_c = req.params) === null || _c === void 0 ? void 0 : _c.id));
}));
