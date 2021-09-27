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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Server
var express_1 = __importStar(require("express"));
var http_1 = require("http");
var socket_io_1 = require("socket.io");
// Model
var Product_1 = __importDefault(require("./src/model/Product"));
var Message_1 = __importDefault(require("./src/model/Message"));
// Libraries
var express_handlebars_1 = __importDefault(require("express-handlebars"));
var moment_1 = __importDefault(require("moment"));
var _product = new Product_1.default();
var app = (0, express_1.default)();
var httpServer = new http_1.Server(app);
var io = new socket_io_1.Server(httpServer);
var PORT = Number(process.env.PORT) || 8080;
var productsRouter = (0, express_1.Router)();
httpServer.listen(PORT, function () {
    console.log("Server listening on port", PORT);
});
httpServer.on("error", function (error) { return console.log("Error en servidor", error); });
io.on("connection", function (socket) {
    socket.on("update", function (data) {
        var title = data.title, price = data.price, thumbnail = data.thumbnail;
        var newProduct = _product.save(new Product_1.default(title, price, thumbnail));
        io.sockets.emit("refresh", newProduct);
    });
    socket.on("newMessage", function (data) {
        var time = (0, moment_1.default)().format("DD/MM/YYYY HH:MM:SS").toString();
        data.time = "[" + time + "]: ";
        Message_1.default.addMessage(data.mail, data.time, data.content);
        io.sockets.emit("newChat", data);
    });
});
app.engine("hbs", (0, express_handlebars_1.default)({
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
app.get("/products/view", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.render("partials/list", { data: _product.getProducts() });
        return [2 /*return*/];
    });
}); });
app.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _b = (_a = res).render;
                _c = ["layouts/index"];
                _d = {
                    data: _product.getProducts()
                };
                return [4 /*yield*/, Message_1.default.getAllMessages()];
            case 1:
                _b.apply(_a, _c.concat([(_d.messages = _e.sent(),
                        _d)]));
                return [2 /*return*/];
        }
    });
}); });
productsRouter.get("/products/list", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json(_product.getProducts());
        return [2 /*return*/];
    });
}); });
productsRouter.get("/products/list/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var products, product;
    var _a;
    return __generator(this, function (_b) {
        products = _product.getProducts();
        if (!(products === null || products === void 0 ? void 0 : products.length))
            res.json({ error: "No available data" });
        product = _product.getProduct((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
        product ? res.json(product) : res.json({ error: "Product doesn't exist" });
        return [2 /*return*/];
    });
}); });
productsRouter.post("/products/save", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, price, thumbnail;
    return __generator(this, function (_b) {
        _a = req.body, title = _a.title, price = _a.price, thumbnail = _a.thumbnail;
        _product.save(new Product_1.default(title, price, thumbnail));
        return [2 /*return*/];
    });
}); });
productsRouter.put("/products/update/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, price, thumbnail;
    var _b;
    return __generator(this, function (_c) {
        _a = req.body, title = _a.title, price = _a.price, thumbnail = _a.thumbnail;
        res.json(_product.update((_b = req.params) === null || _b === void 0 ? void 0 : _b.id, title, price, thumbnail));
        return [2 /*return*/];
    });
}); });
productsRouter.delete("/products/delete/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        res.json(_product.delete((_a = req.params) === null || _a === void 0 ? void 0 : _a.id));
        return [2 /*return*/];
    });
}); });
