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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
// Server
const express_1 = __importStar(require("express"));
const https_1 = __importDefault(require("https"));
const socket_io_1 = require("socket.io");
const cluster_1 = __importDefault(require("cluster"));
const os_1 = require("os");
// Model
const Product_1 = __importDefault(require("./src/model/Product"));
const Message_1 = __importDefault(require("./src/model/Message"));
const Cart_1 = __importDefault(require("./src/model/Cart"));
// Libraries
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const moment_1 = __importDefault(require("moment"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const passport_1 = __importDefault(require("passport"));
const passport_facebook_1 = require("passport-facebook");
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
// Database
const MySQL_1 = require("./src/DAO/MySQL");
const SQLite_1 = require("./src/DAO/SQLite");
const config_1 = __importDefault(require("./src/DAO/config"));
// Functions
const Faker_1 = __importDefault(require("./src/utils/Faker"));
const User_1 = __importDefault(require("./src/model/User"));
const numCPUs = os_1.cpus().length;
const advancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
const httpsOptions = {
    key: fs_1.default.readFileSync("./src/utils/sslcert/cert.key"),
    cert: fs_1.default.readFileSync("./src/utils/sslcert/cert.pem"),
};
const PORT = Number(process.env.PORT) || 8081; // 8443
const app = express_1.default();
const server = https_1.default
    .createServer(httpsOptions, app)
    .listen(PORT, () => {
    console.log("Server corriendo en " + PORT);
});
const io = new socket_io_1.Server(server);
const modo = process.argv[2].toLocaleLowerCase();
if (modo === "cluster") {
    if (cluster_1.default.isPrimary) {
        console.log(`Cantidad de CPUs: ${numCPUs}`);
        console.log(`Master PID ${process.pid} is running`);
        for (let i = 0; i < numCPUs; i++) {
            cluster_1.default.fork();
        }
        cluster_1.default.on("exit", (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died`);
            cluster_1.default.fork();
        });
    }
    else {
        const PORT = process.argv[3] || 8082;
        const server = app.listen(PORT, () => {
            console.log("Servidor worker HTTP escuchando en el puerto", PORT, ". Process ID: ", process.pid);
        });
        server.on("error", (error) => console.log("Error en servidor", error));
        app.get("/", (req, res) => {
            res.send(`Servidor express en ${PORT} - PID ${process.pid} - ${moment_1.default().format("DD/MM/YYYY HH:mm")}`);
        });
    }
}
if (config_1.default + 1 === 3)
    MySQL_1.initializeMariaDB(); // the add is to prevent a ts error
if (config_1.default + 1 === 5)
    SQLite_1.initializeSQLite(); // the add is to prevent a ts error
const productsRouter = express_1.Router();
const cartRouter = express_1.Router();
const administrator = true;
// const cart: Cart = new Cart();
server.on("error", (error) => console.log("Error en servidor", error));
io.on("connection", (socket) => {
    socket.on("update", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, description, code, thumbnail, price, stock } = data;
        const newProduct = yield Product_1.default.save(name, description ? description : "", code ? code : "", thumbnail, price, stock ? stock : 0);
        io.sockets.emit("refresh", newProduct);
    }));
    socket.on("newMessage", (data) => {
        const time = moment_1.default().format("DD/MM/YYYY HH:MM:SS").toString();
        data.time = `[${time}]: `;
        Message_1.default.addMessage(data.mail, data.time, data.content);
        io.sockets.emit("newChat", data);
    });
    socket.on("login", (name) => { });
});
// @ts-ignore
const hbsOptions = {
    extname: ".hbs",
    defaultLayout: "index",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
};
app.engine("hbs", express_handlebars_1.default(hbsOptions));
app.set("views", "./views");
app.set("view engine", "hbs");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use(express_session_1.default({
    store: connect_mongo_1.default.create({
        mongoUrl: "mongodb+srv://rama:rama@cluster0.do4gw.mongodb.net/ecommerce?retryWrites=true&w=majority",
        mongoOptions: advancedOptions,
    }),
    secret: "secreto",
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 10 * 60 * 1000,
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
process.on("exit", (code) => {
    console.log("Saliendo del proceso con código:", code);
});
const clientID = (_a = process.argv[2]) !== null && _a !== void 0 ? _a : "583873459587516";
const clientSecret = (_b = process.argv[3]) !== null && _b !== void 0 ? _b : "ff9792055e390e55b6097a2e0d35dcfe";
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID,
    clientSecret,
    callbackURL: `https://localhost:${PORT}/auth/facebook/callback`,
}, function (accessToken, refreshToken, profile, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("me meti en la 135");
        let user = yield User_1.default.findOne(profile.id);
        console.log("user136", user);
        if (!user) {
            console.log("profile", profile);
            console.log("profile.displayName", profile.displayName);
            cb(null, { username: profile.displayName });
        }
        else
            cb(null, user);
    });
}));
passport_1.default.serializeUser((user, done) => {
    console.log("hago serialize");
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hago deserialize");
    done(null, user);
}));
app.get("/auth/facebook", passport_1.default.authenticate("facebook"));
app.get("/auth/facebook/callback", passport_1.default.authenticate("facebook", { failureRedirect: "/error-login" }), function (req, res) {
    console.log("me autentiqué");
    // Successful authentication, redirect home.
    console.log("req.user", req.user);
    res.redirect("/");
});
app.get("/info", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        entryArgs: process.argv,
        platformName: process.platform,
        nodeVersion: process.version,
        memoryUse: JSON.stringify(process.memoryUsage()),
        execPath: process.execPath,
        processId: process.pid,
        currentFolder: process.cwd(),
        numCPUs,
    };
    res.render("./layouts/info", { layout: "info", data });
}));
let randomsData = {};
server.on("request", (req, res) => {
    const { url, query } = req;
    if (url === "/randoms") {
        console.log("entre a randoms");
        const DEFAULT_QTY = 10000000;
        const { qty } = query;
        const top = parseInt((qty === null || qty === void 0 ? void 0 : qty.toString()) || "") || DEFAULT_QTY;
        const computo = child_process_1.fork("./src/utils/randoms.ts");
        computo.send(top);
        computo.on("message", (result) => {
            console.log(result);
            randomsData = result;
            res.end(result);
        });
    }
});
app.get("/randoms", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("./layouts/randoms", { layout: "randoms", data: randomsData });
}));
app.get("/error-login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("estoy en la ruta de errores");
    res.render("./layouts/error", { layout: "error", errorType: "Login" });
}));
app.get("/error-signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("estoy en la ruta de errores");
    res.render("./layouts/error", { layout: "error", errorType: "Signup" });
}));
app.get("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy();
    res.render("./layouts/bye", { layout: "bye" });
}));
app.get("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("layouts/login", { layout: "login" });
}));
app.get("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("layouts/signup", { layout: "signup" });
}));
app.post("/login", passport_1.default.authenticate("login", { failureRedirect: "/error-login" }), (req, res) => {
    res.redirect("/");
});
app.post("/signup", passport_1.default.authenticate("signup", { failureRedirect: "/error-signup" }), (req, res) => {
    res.redirect("/");
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("get a ./");
    console.log("req.user", req.user);
    if (!req.isAuthenticated())
        res.redirect("/login");
    else {
        // if (!req.session?.username) req.session.username = req.query.username;
        console.log("req.query", req.query);
        const productsData = [];
        if (Object.keys(req.query).length) {
            const response = yield Product_1.default.getProductsIf(req.query);
            productsData.push(...response);
        }
        else {
            const response = yield Product_1.default.getProducts();
            productsData.push(...response);
        }
        console.log("req.user", req.user);
        res.render("layouts/index", {
            data: productsData,
            messages: yield Message_1.default.getAllMessages(),
            username: req.user.username,
        });
    }
}));
app.get("/products/view", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("partials/list", { data: yield Product_1.default.getProducts() });
}));
productsRouter.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let fullResponse = [];
    const { name, code, minPrice, maxPrice, minStock, maxStock } = req.query;
    if (name || code || minPrice || maxPrice || minStock || maxStock) {
        fullResponse = yield Product_1.default.getProductsIf(req.query);
    }
    else {
        fullResponse = yield Product_1.default.getProducts();
    }
    res.json(fullResponse);
}));
productsRouter.get("/test-view", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const DEFAULT_QTY = 10;
    let qty = DEFAULT_QTY;
    if (req.query.qty) {
        let temp = Number(req.query.qty);
        if (!isNaN(qty))
            qty = temp;
    }
    if (qty === 0)
        res.json({ error: "There are no available products." });
    else {
        const response = Faker_1.default(qty);
        res.json(response);
    }
}));
productsRouter.get("/list/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const products = yield Product_1.default.getProducts();
    if (!(products === null || products === void 0 ? void 0 : products.length))
        res.json({ error: "No available data" });
    const product = yield Product_1.default.getProduct((_c = req.params) === null || _c === void 0 ? void 0 : _c.id);
    product ? res.json(product) : res.json({ error: "Product doesn't exist" });
}));
productsRouter.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!administrator) {
        res.json({
            error: -1,
            description: "ruta /add método POST no autorizado",
        });
        return;
    }
    const { name, description, code, thumbnail, price, stock } = req.body;
    if (!name || !description || !code || !thumbnail || !price || !stock) {
        res.json({
            error: "Insufficient parameters. Must contain name, description, code, thumbnail, price and stock",
        });
    }
    else {
        try {
            Product_1.default.save(name, description, code, thumbnail, Number(price), Number(stock));
            res.json({
                success: "The product was added",
            });
        }
        catch (error) {
            console.log(error);
        }
    }
}));
productsRouter.patch("/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    if (!administrator) {
        res.json({
            error: -1,
            description: "ruta /update/:id método PATCH no autorizado",
        });
        return;
    }
    const { name, description, code, thumbnail, price, stock } = req.body;
    res.json(yield Product_1.default.update((_d = req.params) === null || _d === void 0 ? void 0 : _d.id, name, description, code, thumbnail, Number(price), Number(stock)));
}));
productsRouter.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    if (!administrator) {
        res.json({
            error: -1,
            description: "ruta /delete/:id método DELETE no autorizado",
        });
        return;
    }
    const result = yield Product_1.default.delete((_e = req.params) === null || _e === void 0 ? void 0 : _e.id);
    console.log(result);
    if (!result)
        res.json({ error: "The element does not exist." });
    res.json(result);
}));
cartRouter.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield Cart_1.default.getCart());
}));
cartRouter.get("/list/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield Cart_1.default.getCart()); // for this deliverable I'm only using one default cart
}));
cartRouter.post("/add/:id_product", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const product = yield Product_1.default.getProduct((_f = req.params) === null || _f === void 0 ? void 0 : _f.id_product);
    if (product) {
        yield Cart_1.default.addToCart(product);
        res.json({ success: "Succesfully added to cart" });
    }
    else {
        res.json({ error: "The provided id does not exist." });
    }
}));
cartRouter.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    const remove = yield Cart_1.default.removeFromCart((_h = (_g = req.params) === null || _g === void 0 ? void 0 : _g.id) === null || _h === void 0 ? void 0 : _h.toString());
    if (remove)
        res.json({ success: "Succesfully removed from cart" });
    else
        res.json({ success: "The provided id does not exist in this cart." });
}));
