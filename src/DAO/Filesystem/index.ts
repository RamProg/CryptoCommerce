import DAOInterface from "../../DAO/DAOInterface";
import { ConditionsType } from "../../model/Product";
import fs from "fs";

type ObjectWithId = {
  id: string;
};

export default class Memory implements DAOInterface {
  getAll = async (table: string) => {
    try {
      const response: string = fs.readFileSync(
        `src/DAO/Filesystem/data/${table}.json`,
        "utf-8"
      );
      return JSON.parse(response);
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return [];
  };

  getAllWithConditions = async (table: string, conditions: ConditionsType) => {
    try {
      const response: string = fs.readFileSync(
        `src/DAO/Filesystem/data/${table}.json`,
        "utf-8"
      );
      let parsed = JSON.parse(response);
      let minPrice: number = conditions.minPrice ? conditions.minPrice : 0;
      let minStock: number = conditions.minStock ? conditions.minStock : 0;
      let maxPrice: number = conditions.maxPrice
        ? conditions.maxPrice
        : Number.MAX_SAFE_INTEGER;
      let maxStock: number = conditions.maxStock
        ? conditions.maxStock
        : Number.MAX_SAFE_INTEGER;
      const { name, code } = conditions;
      if (name) parsed = parsed.filter((e: { name: string }) => e.name === name);
      if (code) parsed = parsed.filter((e: { code: string }) => e.code === code);
      parsed = parsed.filter(
        (e: { price: number }) => e.price <= maxPrice && e.price >= minPrice
      );
      parsed = parsed.filter(
        (e: { stock: number }) => e.stock <= maxStock && e.stock >= minStock
      );
      return parsed;
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return [];
  };

  getOne = async (table: string, id: string) => {
    try {
      const response: string = fs.readFileSync(
        `src/DAO/Filesystem/data/${table}.json`,
        "utf-8"
      );
      const list = JSON.parse(response);
      const element = list.find((e: ObjectWithId) => e.id === id);
      return [element];
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return [];
  };

  getOneByUsername = async (table: string, username: string) => {
    return [];
  };

  addElement = async (table: string, element: object) => {
    try {
      const oldElements: object[] = await this.getAll(table);
      const allElements: object[] = oldElements?.length
        ? [...oldElements, element]
        : [element];
      const allElementsString: string = JSON.stringify(allElements);
      fs.writeFileSync(
        `src/DAO/Filesystem/data/${table}.json`,
        allElementsString
      );
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return {};
  };

  deleteElement = async (table: string, id: string) => {
    try {
      const response: string = fs.readFileSync(
        `src/DAO/Filesystem/data/${table}.json`,
        "utf-8"
      );
      const list = JSON.parse(response);
      const element = list.find((e: ObjectWithId) => e.id === id);
      const newList = list.filter((e: ObjectWithId) => e.id !== id);
      fs.writeFileSync(
        `src/DAO/Filesystem/data/${table}.json`,
        JSON.stringify(newList)
      );
      return element;
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return;
  };

  updateElement = async (table: string, id: string, element: object) => {
    try {
      const response: string = fs.readFileSync(
        `src/DAO/Filesystem/data/${table}.json`,
        "utf-8"
      );
      const list = [...JSON.parse(response)];
      const idx = list.findIndex((e: any) => e.id === id);
      list[idx] = element;
      fs.writeFileSync(
        `src/DAO/Filesystem/data/${table}.json`,
        JSON.stringify(list)
      );
      return list[idx];
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return undefined;
  };

  addElementToArray = async (table: string, newElementToAdd: object) => {
    try {
      const response: string = fs.readFileSync(
        `src/DAO/Filesystem/data/${table}.json`,
        "utf-8"
      );
      let list = JSON.parse(response);
      if (!list?.length) {
        list = [{ id: "1", timestamp: new Date().toString(), products: [] }];
      }
      list[0].products.push(newElementToAdd);
      fs.writeFileSync(
        `src/DAO/Filesystem/data/${table}.json`,
        JSON.stringify(list)
      );
    } catch (error) {
      console.log(error);
    }
    return newElementToAdd;
  };

  removeElementFromCollection = async (table: string, idToRemove: string) => {
    try {
      const response: string = fs.readFileSync(
        `src/DAO/Filesystem/data/${table}.json`,
        "utf-8"
      );
      const list = JSON.parse(response);
      const idx = list[0].products.findIndex(
        (e: ObjectWithId) => e.id === idToRemove
      );
      const result = list[0].products[idx];
      list[0].products.splice(idx, 1);
      fs.writeFileSync(
        `src/DAO/Filesystem/data/${table}.json`,
        JSON.stringify(list)
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  };
}
