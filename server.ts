// Server
import express, { Router, Request, Response } from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";

// Model
import Product from "./src/model/Product";
import Message from "./src/model/Message";
import Cart from "./src/model/Cart";

// Libraries
import handlebars from "express-handlebars";
import moment from "moment";
import session, { MongoClientOptions } from "express-session";
import MongoStore from "connect-mongo";

// Database
import { initializeMariaDB } from "./src/DAO/MySQL";
import { initializeSQLite } from "./src/DAO/SQLite";
import persistanceType from "./src/DAO/config";

// Functions
import getFakeData from "./src/utils/Faker";

const advancedOptions: MongoClientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const app = express();
const httpServer: HttpServer = new HttpServer(app);
const io: IOServer = new IOServer(httpServer);

if (persistanceType + 1 === 3) initializeMariaDB(); // the add is to prevent a ts error
if (persistanceType + 1 === 5) initializeSQLite(); // the add is to prevent a ts error

const PORT: number = Number(process.env.PORT) || 8080;

const productsRouter: Router = Router();
const cartRouter: Router = Router();

const administrator: boolean = true;
// const cart: Cart = new Cart();

httpServer.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});

httpServer.on("error", (error) => console.log("Error en servidor", error));

io.on("connection", (socket) => {
  socket.on("update", async (data) => {
    const { name, description, code, thumbnail, price, stock } = data;
    const newProduct: any = await Product.save(
      name,
      description ? description : "",
      code ? code : "",
      thumbnail,
      price,
      stock ? stock : 0
    );

    io.sockets.emit("refresh", newProduct);
  });
  socket.on("newMessage", (data) => {
    const time = moment().format("DD/MM/YYYY HH:MM:SS").toString();
    data.time = `[${time}]: `;
    Message.addMessage(data.mail, data.time, data.content);
    io.sockets.emit("newChat", data);
  });
  socket.on("login", (name) => {});
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

app.engine("hbs", handlebars(hbsOptions));

app.set("views", "./views");
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/products", productsRouter);
app.use("/cart", cartRouter);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://rama:rama@cluster0.do4gw.mongodb.net/ecommerce?retryWrites=true&w=majority",
      mongoOptions: advancedOptions,
    }),
    secret: "secreto",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 10 * 60 * 1000,
    },
  })
);

app.get("/products/view", async (req: Request, res: Response) => {
  res.render("partials/list", { data: await Product.getProducts() });
});

app.get("/logout", async (req: any, res: Response) => {
  req.session.name = undefined;
  res.render("./layouts/bye", { layout: "bye" });
});

app.get("/", async (req: any, res: Response) => {
  if (!req.query.name && !req.session?.name)
    res.render("layouts/login", { layout: "login" });
  else {
    if (!req.session?.name) req.session.name = req.query.name;
    const productsData: any[] = [];
    if (Object.keys(req.query).length) {
      const response = await Product.getProductsIf(req.query);
      productsData.push(...response);
    } else {
      const response = await Product.getProducts();
      productsData.push(...response);
    }
    res.render("layouts/index", {
      data: productsData,
      messages: await Message.getAllMessages(),
      username: req.session.name,
    });
  }
});

productsRouter.get("/list", async (req: Request, res: Response) => {
  let fullResponse: object[] = [];
  const { name, code, minPrice, maxPrice, minStock, maxStock } = req.query;
  if (name || code || minPrice || maxPrice || minStock || maxStock) {
    fullResponse = await Product.getProductsIf(req.query);
  } else {
    fullResponse = await Product.getProducts();
  }
  res.json(fullResponse);
});

productsRouter.get("/test-view", async (req: Request, res: Response) => {
  const DEFAULT_QTY: number = 10;
  let qty = DEFAULT_QTY;
  if (req.query.qty) {
    let temp: number = Number(req.query.qty);
    if (!isNaN(qty)) qty = temp;
  }
  if (qty === 0) res.json({ error: "There are no available products." });
  else {
    const response: object[] = getFakeData(qty);
    res.json(response);
  }
});

productsRouter.get("/list/:id", async (req: Request, res: Response) => {
  const products: any = await Product.getProducts();
  if (!products?.length) res.json({ error: "No available data" });
  const product: object | undefined = await Product.getProduct(req.params?.id);
  product ? res.json(product) : res.json({ error: "Product doesn't exist" });
});

productsRouter.post("/add", async (req: Request, res: Response) => {
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
      error:
        "Insufficient parameters. Must contain name, description, code, thumbnail, price and stock",
    });
  } else {
    try {
      Product.save(
        name,
        description,
        code,
        thumbnail,
        Number(price),
        Number(stock)
      );
      res.json({
        success: "The product was added",
      });
    } catch (error) {
      console.log(error);
    }
  }
});

productsRouter.patch("/update/:id", async (req: Request, res: Response) => {
  if (!administrator) {
    res.json({
      error: -1,
      description: "ruta /update/:id método PATCH no autorizado",
    });
    return;
  }
  const { name, description, code, thumbnail, price, stock } = req.body;
  res.json(
    await Product.update(
      req.params?.id,
      name,
      description,
      code,
      thumbnail,
      Number(price),
      Number(stock)
    )
  );
});

productsRouter.delete("/delete/:id", async (req: Request, res: Response) => {
  if (!administrator) {
    res.json({
      error: -1,
      description: "ruta /delete/:id método DELETE no autorizado",
    });
    return;
  }
  const result = await Product.delete(req.params?.id);
  console.log(result);

  if (!result) res.json({ error: "The element does not exist." });
  res.json(result);
});

cartRouter.get("/list", async (req: Request, res: Response) => {
  res.json(await Cart.getCart());
});

cartRouter.get("/list/:id", async (req: Request, res: Response) => {
  res.json(await Cart.getCart()); // for this deliverable I'm only using one default cart
});

cartRouter.post("/add/:id_product", async (req: Request, res: Response) => {
  const product: object | undefined = await Product.getProduct(
    req.params?.id_product
  );
  if (product) {
    await Cart.addToCart(product as Product);
    res.json({ success: "Succesfully added to cart" });
  } else {
    res.json({ error: "The provided id does not exist." });
  }
});

cartRouter.delete("/delete/:id", async (req: Request, res: Response) => {
  const remove = await Cart.removeFromCart(req.params?.id?.toString());
  if (remove) res.json({ success: "Succesfully removed from cart" });
  else res.json({ success: "The provided id does not exist in this cart." });
});
