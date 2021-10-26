import DAOFactory from "../DAO/DAOFactory";
import DAOInterface from "../DAO/DAOInterface";
import persistanceType from "../DAO/config";

const table = "products";

export type ConditionsType = {
  name?: string;
  code?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
};

const DAO: DAOInterface = new DAOFactory().getDAO(persistanceType);

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
      const response = await DAO.getAll(table);
      return response;
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return [];
  };

  private static generateId(): string {
    return (++lastId).toString();
  }

  static getProductsIf = async function (
    conditions: ConditionsType
  ): Promise<any[]> {
    if (!Object.keys(conditions)) return await Product.getProducts();
    try {
      const response = await DAO.getAllWithConditions(table, conditions);
      return response;
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return [];
  };

  static async getProduct(id: string): Promise<any | undefined> {
    try {
      const response = await DAO.getOne(table, id);
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
      await DAO.addElement(table, newProduct);
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
    console.log("busque un producto");

    if (!productToUpdate) return;
    if (name) productToUpdate.name = name;
    if (description) productToUpdate.description = description;
    if (code) productToUpdate.code = code;
    if (thumbnail) productToUpdate.thumbnail = thumbnail;
    if (price) productToUpdate.price = price;
    if (stock) productToUpdate.stock = stock;
    try {
      console.log("me tengoq ue meter a actualizar");

      await DAO.updateElement(table, id, productToUpdate);
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return productToUpdate;
  }

  static async delete(id: string): Promise<object | undefined> {
    const product = await this.getProduct(id);
    try {
      await DAO.deleteElement(table, id);
      return product;
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return;
  }
}
