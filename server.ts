import express, { Router } from "express";
import { Server } from "http";
import Product from "./src/model/Product";
import ejs from 'ejs'

const _product: Product = new Product();

const app = express();

const PORT: number = Number(process.env.PORT) || 8080;

const productsRouter: Router = Router();

const server: Server = app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});

server.on("error", (error) => console.log("Error en servidor", error));

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api", productsRouter);

app.get("/products/view", async (req: any, res: any) => {
  res.render("./layouts/index", { data: _product.getProducts() });
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
  res.redirect("../../");
});

productsRouter.put("/products/update/:id", async (req: any, res: any) => {
  const { title, price, thumbnail } = req.body;
  res.json(_product.update(req.params?.id, title, price, thumbnail));
});

productsRouter.delete("/products/delete/:id", async (req: any, res: any) => {
  res.json(_product.delete(req.params?.id));
});
