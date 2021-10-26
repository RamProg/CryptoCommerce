import DAOInterface from "../../DAO/DAOInterface";
import { ConditionsType } from "../../model/Product";
type ObjectWithId = {
  id: string;
};

const products: ObjectWithId[] = [];
const messages: ObjectWithId[] = [];
const carts: ObjectWithId[] = [];

export default class Memory implements DAOInterface {
  getAll = async (table: string) => {
    return eval(table);
  };

  getAllWithConditions = async (table: string, conditions: ConditionsType) => {
    let array = eval(table);
    let minPrice: number = conditions.minPrice ? conditions.minPrice : 0;
    let minStock: number = conditions.minStock ? conditions.minStock : 0;
    let maxPrice: number = conditions.maxPrice
      ? conditions.maxPrice
      : Number.MAX_SAFE_INTEGER;
    let maxStock: number = conditions.maxStock
      ? conditions.maxStock
      : Number.MAX_SAFE_INTEGER;
    const { name, code } = conditions;
    if (name) array = array.filter((e: { name: string }) => e.name === name);
    if (code) array = array.filter((e: { code: string }) => e.code === code);
    array = array.filter(
      (e: { price: number }) => e.price <= maxPrice && e.price >= minPrice
    );
    array = array.filter(
      (e: { stock: number }) => e.stock <= maxStock && e.stock >= minStock
    );
    return array;
  };

  getOne = async (table: string, id: string) => {
    return [eval(table).find((e: { id: string }) => e.id === id)];
  };

  addElement = async (table: string, product: object) => {
    eval(table).push(product);
    return product;
  };

  deleteElement = async (table: string, id: string) => {
    const idx = eval(table).findIndex((e: ObjectWithId) => e.id === id);
    return eval(table).splice(idx, 1);
  };

  updateElement = async (table: string, id: string, element: object) => {
    const idx = eval(table).findIndex((e: ObjectWithId) => e.id === id);
    console.log(idx);
    if (idx) {
      eval(table)[idx] = element;
      return element;
    } else {
      return {};
    }
  };

  addElementToArray = async (table: string, newElementToAdd: object) => {
    if (!eval(table)[0]?.products) eval(table).push({ id: "1", products: [] });
    if (newElementToAdd) eval(table)[0].products.push(newElementToAdd);
    return newElementToAdd;
  };

  removeElementFromCollection = async (table: string, idToRemove: string) => {
    const idx = eval(table)[0].products.findIndex(
      (e: ObjectWithId) => e.id === idToRemove
    );
    const result = eval(table)[0].products[idx];
    eval(table)[0].products.splice(idx, 1);
    return result;
  };
}
