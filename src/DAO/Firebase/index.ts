import DAOInterface from "../../DAO/DAOInterface";
import { db } from "./options/connectionFirebase";
import admin from "firebase-admin";
import { ConditionsType } from "../../model/Product";

export default class Memory implements DAOInterface {
  getAll = async (table: string) => {
    const result: any[] = [];
    try {
      const collectionRef = db.collection(table);
      const snapshot = await collectionRef.get();
      snapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
      });
      return result;
    } catch (error) {
      console.log(error);
    }
    return result;
  };

  getAllWithConditions = async (table: string, conditions: ConditionsType) => {
    let result: any[] = [];
    try {
      let minPrice: number = conditions.minPrice ?? 0;
      let minStock: number = conditions.minStock ?? 0;
      let maxPrice: number = conditions.maxPrice ?? Number.MAX_SAFE_INTEGER;
      let maxStock: number = conditions.maxStock ?? Number.MAX_SAFE_INTEGER;
      console.log("conditions on firebase", conditions);

      const { name, code } = conditions;
      let collectionRef = db.collection(table);

      const snapshot = await collectionRef.get();
      snapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
      });
      if (name) result = result.filter((e: { name: string }) => e.name === name);
      if (code) result = result.filter((e: { code: string }) => e.code === code);
      result = result.filter(
        (e: { price: number }) => e.price <= maxPrice && e.price >= minPrice
      );
      result = result.filter(
        (e: { stock: number }) => e.stock <= maxStock && e.stock >= minStock
      );
      return result;
    } catch (error) {
      console.log(error);
    }
    return result;
  };

  getOne = async (table: string, id: string) => {
    const result: any[] = [];
    try {
      const collectionRef = db.collection(table);
      const snapshot = await collectionRef.doc(id).get();
      snapshot.data() && result.push({ id: snapshot.id, ...snapshot.data() });
      return result;
    } catch (error) {
      console.log(error);
    }
    return result.length ? result[0] : [];
  };

  getOneByUsername = async (table: string, username: string) => {
    return [];
  };
  
  addElement = async (table: string, element: object) => {
    delete element["id"];
    const data = { ...element };
    try {
      const collectionRef = db.collection(table);
      await collectionRef.doc().set(data);
    } catch (error) {
      console.log(error);
    }
    return element;
  };

  deleteElement = async (table: string, id: string) => {
    const result: any[] = [];
    try {
      result.push(await this.getOne(table, id));
      const collectionRef = db.collection("products");
      await collectionRef.doc(id).delete();
    } catch (error) {
      console.log(error);
    }
    return result.length ? result[0] : [];
  };

  updateElement = async (table: string, id: string, element: object) => {
    const result: any[] = [];
    try {
      const collectionRef = db.collection("products");
      await collectionRef.doc(id).set(element);
      result.push(await this.getOne(table, id));
    } catch (error) {
      console.log(error);
    }
    return result.length ? result[0] : [];
  };

  addElementToArray = async (table: string, newElementToAdd: object) => {
    try {
      await db.collection(table).doc().set(newElementToAdd);
    } catch (error) {
      console.log(error);
    }
    return newElementToAdd;
  };

  removeElementFromCollection = async (table: string, idToRemove: string) => {
    try {
      console.log("idToRemove", idToRemove);

      // const doc = await db.collection(table).doc(idToRemove).get();
      // const data = { id: doc.id, ...doc.data() };
      const response = await db
        .collection(table)
        .where("id", "==", idToRemove)
        .get();
      if (!response.docs.length) return {};
      const element = response.docs[0];
      await db.collection(table).doc(element.id).delete();
      return element;
    } catch (error) {
      console.log(error);
    }
    return {};
  };
}
