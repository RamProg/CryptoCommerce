import options from "../../db/options/connectionMariaDB";
const knex = require("knex")(options);

export const initializeMariaDB = async () => {
  // console.log("voy a tratar de inicializar");

  await knex.schema.dropTableIfExists("products");
  // console.log("Tabla borrada...");

  await knex.schema.createTable("products", (table) => {
    table.increments("id"),
      table.timestamp("timestamp").defaultTo(knex.fn.now()),
      table.string("name"),
      table.string("description"),
      table.string("code"),
      table.string("thumbnail"),
      table.integer("price"),
      table.integer("stock");
  });
  // console.log("table created");
};

export const getAllProducts = async () => {
  try {
    return await knex.from("products").select("*");
  } catch (error) {
    console.log(error);
  }
  return [];
};

export const getProductFromDB = async (id: string) => {
  try {
    const response = await knex.from("products").where("id", "=", id);
    console.log("getProductFromDB", response);

    if (response.length) return response;
  } catch (error) {
    console.log(error);
  }
  return;
};

export const addProductToDB = async (product) => {
  try {
    const response = await knex("products").insert(product);
    return response;
  } catch (error) {
    console.log(error);
  }
  return;
};

export const deleteProductFromDB = async (id) => {
  try {
    const response = await knex.from("products").where("id", "=", id).del();
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
  }
  return;
};

export const updateProductFromDB = async (id, product) => {
  try {
    const response = await knex
      .from("products")
      .where("id", "=", id)
      .update(product);
    return response;
  } catch (error) {
    console.log(error);
  }
  return;
};
