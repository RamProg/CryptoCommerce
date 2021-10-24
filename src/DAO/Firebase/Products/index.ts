import { db } from "../options/connectionFirebase";
import ProductDAOInterface from "../../ProductDAOInterface";

export default class ProductDAOFirebase implements ProductDAOInterface {
  getAllProducts = async () => {
    const result: any[] = [];
    try {
      const messagesRef = db.collection("products");
      const snapshot = await messagesRef.get();
      snapshot.forEach((doc) => {
        result.push(doc.data());
      });
      return result;
    } catch (error) {
      console.log(error);
    }
    return result;
  };

  getProductFromDB = async (id: string) => {
    const result: any[] = [];
    try {
      const messagesRef = db.collection("products");
      const snapshot = await messagesRef.doc(id).get();
      snapshot.data() && result.push(snapshot.data());
      return result;
    } catch (error) {
      console.log(error);
    }
    return result.length ? result[0] : [];
  };

  addProductToDB = async (product) => {
    delete product["id"];
    const data = { ...product };
    try {
      const messagesRef = db.collection("products");
      await messagesRef.doc().set(data);
    } catch (error) {
      console.log(error);
    }
    return;
  };

  deleteProductFromDB = async (id: string) => {
    const result: any[] = [];
    try {
      result.push(await this.getProductFromDB(id));
      const messagesRef = db.collection("products");
      await messagesRef.doc(id).delete();
    } catch (error) {
      console.log(error);
    }
    return result.length ? result[0] : [];
  };

  updateProductFromDB = async (id, product) => {
    const result: any[] = [];
    try {
      const messagesRef = db.collection("products");
      await messagesRef.doc(id).set(product);
      result.push(await this.getProductFromDB(id));
    } catch (error) {
      console.log(error);
    }
    return result.length ? result[0] : [];
  };
}
