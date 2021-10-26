import Product from "./Product";
import DAOFactory from "../DAO/DAOFactory";
import DAOInterface from "../DAO/DAOInterface";
import persistanceType from "../DAO/config";

const table = "carts";

const DAO: DAOInterface = new DAOFactory().getDAO(persistanceType);
export default class Cart {
  id: string;
  timestamp: string;
  products: Product[];
  constructor() {
    this.id = "1";
    this.timestamp = new Date().getTime().toString();
    this.products = [];
    // this.fillProductsWithData();
  }
  // private async fillProductsWithData(): Promise<void> {
  //   try {
  //     const response: string = fs.readFileSync("./src/data/cart.json", "utf-8");
  //     this.products = JSON.parse(response)?.products || [];
  //   } catch (error: Error | unknown) {
  //     console.log(error);
  //   }
  //   return;
  // }

  static async getCart() {
    try {
      const response = await DAO.getAll(table);
      return response;
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  static async addToCart(product: Product) {
    try {
      const response = await DAO.addElementToArray(table, product[0]);
      return response;
    } catch (error) {
      console.log(error);
    }
    return;
  }

  static async removeFromCart(id: string) {
    try {
      const response = await DAO.removeElementFromCollection(table, id);
      if (Object.keys(response).length) return response;
    } catch (error) {
      console.log(error);
    }
    return;
  }

  // async addToCart(product: Product) {
  //   const oldCartProducts: Product[] = this.products;
  //   const newCartProducts: Product[] = oldCartProducts.length
  //     ? [...oldCartProducts, product]
  //     : [product];
  //   this.products = newCartProducts;

  //   const newCart = {
  //     id: this.id,
  //     timestamp: this.timestamp,
  //     products: this.products,
  //   };
  //   try {
  //     fs.writeFileSync("./src/data/cart.json", JSON.stringify(newCart));
  //   } catch (error: Error | unknown) {
  //     console.log(error);
  //   }
  //   return newCart;
  // }

  // async removeFromCart(id: string) {
  //   let idx: number = this.products.findIndex((e) => e.id === id);
  //   if (idx === -1) return;
  //   const cartWithoutElement = [...this.products];
  //   cartWithoutElement.splice(idx, 1);
  //   const removedElement = this.products[idx];
  //   this.products = cartWithoutElement;
  //   try {
  //     const read = fs.readFileSync("./src/data/cart.json", "utf-8");
  //     const oldCart = JSON.parse(read);
  //     oldCart.products = this.products;
  //     fs.writeFileSync("./src/data/cart.json", JSON.stringify(oldCart));
  //   } catch (error: Error | unknown) {
  //     console.log(error);
  //   }
  //   return removedElement;
  // }
}
