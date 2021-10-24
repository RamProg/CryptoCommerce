import ProductFactory from "../DAO/ProductFactory";
import ProductInterface from "../DAO/ProductDAOInterface";
import persistanceType from "../DAO/config";

const messageDAO: ProductInterface = new ProductFactory().getMessageDAO(persistanceType);

const getLastId = () => {
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
      const response = await messageDAO.getAllProducts();
      return response;
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return [];
  };

  private static generateId(): string {
    return (++lastId).toString();
  }

  static async getProduct(id: string): Promise<any | undefined> {
    try {
      const response = await messageDAO.getProductFromDB(id);
      return response;
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
    const newProduct: Product = new Product(
      name,
      description,
      code,
      thumbnail,
      price,
      stock
    );
    try {
      await messageDAO.addProductToDB(newProduct);
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
    const foundProducts = await this.getProduct(id);
    const productToUpdate = foundProducts ? foundProducts[0] : undefined;

    if (!productToUpdate) return;
    if (name) productToUpdate.name = name;
    if (description) productToUpdate.description = description;
    if (code) productToUpdate.code = code;
    if (thumbnail) productToUpdate.thumbnail = thumbnail;
    if (price) productToUpdate.price = price;
    if (stock) productToUpdate.stock = stock;
    try {
      await messageDAO.updateProductFromDB(id, productToUpdate);
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return productToUpdate;
  }

  static async delete(id: string): Promise<object | undefined> {
    const product = await this.getProduct(id);
    try {
      await messageDAO.deleteProductFromDB(id);
      return product;
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return;
  }
}
