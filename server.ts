// Server
import express, { Router, Request, Response } from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";

// Model
import Product from "./src/model/Product";
import Message from "./src/model/Message";
// import Cart from "./src/model/Cart";

// Libraries
import handlebars from "express-handlebars";
import moment from "moment";

// DB
import { connect } from "./src/db/options/connectionMongoDB";

connect();

const app = express();
const httpServer: HttpServer = new HttpServer(app);
const io: IOServer = new IOServer(httpServer);

const PORT: number = Number(process.env.PORT) || 8080;

const productsRouter: Router = Router();
// const cartRouter: Router = Router();

const administrator: boolean = true;
// const cart: Cart = new Cart();

httpServer.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});

httpServer.on("error", (error) => console.log("Error en servidor", error));

io.on("connection", (socket) => {
  socket.on("update", (data) => {
    const { name, description, code, thumbnail, price, stock } = data;
    const newProduct: any = Product.save(
      name,
      description,
      code,
      thumbnail,
      price,
      stock
    );

    io.sockets.emit("refresh", newProduct);
  });
  socket.on("newMessage", (data) => {
    const time = moment().format("DD/MM/YYYY HH:MM:SS").toString();
    data.time = `[${time}]: `;
    Message.addMessage(data.mail, data.time, data.content);
    io.sockets.emit("newChat", data);
  });
});

const hbsOptions = {
  extname: ".hbs",
  defaultLayout: "index.hbs",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
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
// app.use("/cart", cartRouter);

app.get("/products/view", async (req: Request, res: Response) => {
  res.render("partials/list", { data: await Product.getProducts() });
});

app.get("/", async (req: Request, res: Response) => {
  res.render("layouts/index", {
    data: await Product.getProducts(),
    messages: await Message.getAllMessages(),
  });
});

productsRouter.get("/list", async (req: Request, res: Response) => {
  res.json(await Product.getProducts());
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
      description: "ruta /add m??todo POST no autorizado",
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
      description: "ruta /update/:id m??todo PATCH no autorizado",
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
      description: "ruta /delete/:id m??todo DELETE no autorizado",
    });
    return;
  }
  const result = await Product.delete(req.params?.id);
  console.log(result);

  if (!result) res.json({ error: "The element does not exist." });
  res.json(result);
});

// cartRouter.get("/list", async (req: Request, res: Response) => {
//   res.json(cart.getCart());
// });

// cartRouter.get("/list/:id", async (req: Request, res: Response) => {
//   res.json(cart.getCart()); // for this deliverable I'm only using one default cart
// });

// cartRouter.post("/add/:id_product", async (req: Request, res: Response) => {
//   const product: object | undefined = await Product.getProduct(
//     req.params?.id_product
//   );
//   if (product) {
//     await cart.addToCart(product as Product);
//     res.json({ success: "Succesfully added to cart" });
//   } else {
//     res.json({ error: "The provided id does not exist." });
//   }
// });

// cartRouter.delete("/delete/:id", async (req: Request, res: Response) => {
//   const remove = await cart.removeFromCart(req.params?.id?.toString());
//   if (remove) res.json({ success: "Succesfully removed from cart" });
//   else res.json({ success: "The provided id does not exist in this cart." });
// });
