import fs from "fs";
import __products from "../data/products.json";

const getLastId = () => {
  try {
    const response: string = fs.readFileSync(
      "./src/data/products.json",
      "utf-8"
    );
    const parsedResponse = JSON.parse(response);
    return parseInt(parsedResponse[parsedResponse.length - 1].id) || 0;
  } catch (error: Error | unknown) {
    console.log(error);
  }
  return 0;
};

let lastId = getLastId();
export default class Product {
  id: string;
  timestamp: string;
  name: string;
  description: string;
  code: string;
  thumbnail: string;
  price: number;
  stock: number;
  constructor(
    name: string,
    description: string,
    code: string,
    thumbnail: string,
    price: number,
    stock: number
  ) {
    this.id = Product.generateId().toString();
    this.timestamp = new Date().getTime().toString();
    this.name = name;
    this.description = description;
    this.code = code;
    this.thumbnail = thumbnail;
    this.price = price;
    this.stock = stock;
  }

  static getProducts = async function (): Promise<any[]> {
    try {
      const response: string = fs.readFileSync(
        "./src/data/products.json",
        "utf-8"
      );
      return JSON.parse(response);
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return [];
  };

  private static generateId(): string {
    return (++lastId).toString();
  }

  static async getProduct(id: string): Promise<object | undefined> {
    try {
      const response = await this.getProducts();
      return response.find((e) => e.id === id);
    } catch (error) {
      console.log(error);
    }
    return;
  }

  static async save(
    name: string,
    description: string,
    code: string,
    thumbnail: string,
    price: number,
    stock: number
  ): Promise<Product> {
    const oldProducts: object[] = await this.getProducts();
    const newProduct: Product = new Product(
      name,
      description,
      code,
      thumbnail,
      price,
      stock
    );
    const allProducts: object[] = oldProducts?.length
      ? [...oldProducts, newProduct]
      : [newProduct];
    const allProductsString: string = JSON.stringify(allProducts);
    try {
      fs.writeFileSync("./src/data/products.json", allProductsString);
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return newProduct;
  }
  static async update(
    id: string,
    name?: string,
    description?: string,
    code?: string,
    thumbnail?: string,
    price?: number,
    stock?: number
  ) {
    const products: any = await this.getProducts();
    const productToUpdate = products.filter((e: Product) => e.id === id)[0];
    if (!productToUpdate) return;
    if (name) productToUpdate.name = name;
    if (description) productToUpdate.description = description;
    if (code) productToUpdate.code = code;
    if (thumbnail) productToUpdate.thumbnail = thumbnail;
    if (price) productToUpdate.price = price;
    if (stock) productToUpdate.stock = stock;
    try {
      fs.writeFileSync("./src/data/products.json", JSON.stringify(products));
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return productToUpdate;
  }

  static async delete(id: string): Promise<object | undefined> {
    const products: any = await this.getProducts();
    const productsWithoutElement = products.filter((e: Product) => e.id !== id);
    if (products.length === productsWithoutElement.length) return;
    try {
      fs.writeFileSync(
        "./src/data/products.json",
        JSON.stringify(productsWithoutElement)
      );
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return products.filter((e: Product) => e.id === id);
  }
}
