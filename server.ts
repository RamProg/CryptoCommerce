import express, { Router } from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer, Socket } from "socket.io";
import Product from "./src/model/Product";
import handlebars from "express-handlebars";
import Message from "./src/model/Message";
import moment from "moment";

const _product: Product = new Product();

const app = express();
const httpServer: HttpServer = new HttpServer(app);
const io: IOServer = new IOServer(httpServer);

const PORT: number = Number(process.env.PORT) || 8080;

const productsRouter: Router = Router();

httpServer.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});

httpServer.on("error", (error) => console.log("Error en servidor", error));

io.on("connection", (socket) => {
  socket.on("update", (data) => {
    const { title, price, thumbnail } = data;
    const newProduct = _product.save(new Product(title, price, thumbnail));
    io.sockets.emit("refresh", newProduct);
  });
  socket.on("newMessage", (data) => {
    const time = moment().format("DD/MM/YYYY HH:MM:SS").toString();
    data.time = `[${time}]: `;
    Message.addMessage(data.mail, data.time, data.content);
    io.sockets.emit("newChat", data);
  });
});

app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

app.set("views", "./views");
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api", productsRouter);

app.get("/products/view", async (req: any, res: any) => {
  res.render("partials/list", { data: _product.getProducts() });
});

app.get("/", async (req: any, res: any) => {
  res.render("layouts/index", {
    data: _product.getProducts(),
    messages: await Message.getAllMessages(),
  });
});

productsRouter.get("/products/list", async (req: any, res: any) => {
  res.json(_product.getProducts());
});

productsRouter.get("/products/list/:id", async (req: any, res: any) => {
  const products: object[] = _product.getProducts();
  if (!products?.length) res.json({ error: "No available data" });
  const product: object | undefined = _product.getProduct(req.params?.id);
  product ? res.json(product) : res.json({ error: "Product doesn't exist" });
});

productsRouter.post("/products/save", async (req: any, res: any) => {
  const { title, price, thumbnail } = req.body;
  _product.save(new Product(title, price, thumbnail));
});

productsRouter.put("/products/update/:id", async (req: any, res: any) => {
  const { title, price, thumbnail } = req.body;
  res.json(_product.update(req.params?.id, title, price, thumbnail));
});

productsRouter.delete("/products/delete/:id", async (req: any, res: any) => {
  res.json(_product.delete(req.params?.id));
});
