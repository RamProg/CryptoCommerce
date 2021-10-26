import DAOInterface from "../../DAO/DAOInterface";
import options from "./options";
const knex = require("knex")(options);
import { ConditionsType } from "../../model/Product";

export const initializeMariaDB = async () => {
  // console.log("voy a tratar de inicializar");

  await knex.schema.dropTableIfExists("products");
  await knex.schema.dropTableIfExists("carts");
  // console.log("Tabla borrada...");

  await knex.schema.createTable(
    "products",
    (table: {
      increments: (arg0: string) => any;
      timestamp: (arg0: string) => {
        (): any;
        new (): any;
        defaultTo: { (arg0: any): any; new (): any };
      };
      string: (arg0: string) => any;
      integer: (arg0: string) => any;
    }) => {
      table.increments("id"),
        table.timestamp("timestamp").defaultTo(knex.fn.now()),
        table.string("name"),
        table.string("description"),
        table.string("code"),
        table.string("thumbnail"),
        table.integer("price"),
        table.integer("stock");
    }
  );

  await knex.schema.createTable(
    "carts",
    (table: {
      increments: (arg0: string) => any;
      timestamp: (arg0: string) => {
        (): any;
        new (): any;
        defaultTo: { (arg0: any): any; new (): any };
      };
      string: (arg0: string) => any;
    }) => {
      table.increments("id"),
        table.timestamp("timestamp").defaultTo(knex.fn.now()),
        table.string("products");
    }
  );
  // console.log("table created");
};

export default class DAOMySQL implements DAOInterface {
  getAll = async (table: string) => {
    try {
      return await knex.from(table).select("*");
    } catch (error) {
      console.log(error);
    }
    return [];
  };

  getAllWithConditions = async (table: string, conditions: ConditionsType) => {
    let minPrice: number = conditions.minPrice ? conditions.minPrice : 0;
    let minStock: number = conditions.minStock ? conditions.minStock : 0;
    let maxPrice: number = conditions.maxPrice
      ? conditions.maxPrice
      : Number.MAX_SAFE_INTEGER;
    let maxStock: number = conditions.maxStock
      ? conditions.maxStock
      : Number.MAX_SAFE_INTEGER;
    const { name, code } = conditions;
    const SQLConditions: any = {};
    if (name) SQLConditions.name = name;
    if (code) SQLConditions.code = code;
    try {
      const query = await knex
        .from(table)
        .select("*")
        .whereBetween("price", [minPrice, maxPrice])
        .whereBetween("stock", [minStock, maxStock])
        .where(SQLConditions);
      return query;
    } catch (error) {
      console.log(error);
    }
    return [];
  };

  getOne = async (table: string, id: string) => {
    try {
      const response = await knex.from(table).where("id", "=", id);
      console.log("getProductFromDB", response);

      if (response.length) return response;
    } catch (error) {
      console.log(error);
    }
    return;
  };

  addElement = async (table: string, product: object) => {
    try {
      const response = await knex(table).insert(product);
      return response;
    } catch (error) {
      console.log(error);
    }
    return;
  };

  deleteElement = async (table: string, id: string) => {
    try {
      const response = await knex.from(table).where("id", "=", id).del();
      console.log(response);

      return response;
    } catch (error) {
      console.log(error);
    }
    return;
  };

  updateElement = async (table: string, id: string, product: any) => {
    try {
      const response = await knex
        .from(table)
        .where("id", "=", id)
        .update(product);
      return response;
    } catch (error) {
      console.log(error);
    }
    return;
  };

  addElementToArray = async (table: string, newElementToAdd: object) => {
    try {
      const { id } = newElementToAdd as { id: string };
      await knex(table).insert({ products: id });
    } catch (error) {
      console.log(error);
    }
    return newElementToAdd;
  };

  removeElementFromCollection = async (table: string, idToRemove: string) => {
    try {
      const response = await knex.from(table).where("id", "=", idToRemove);
      await knex.from(table).where("id", "=", idToRemove).del();
      return response;
    } catch (error) {
      console.log(error);
    }
  };
}
