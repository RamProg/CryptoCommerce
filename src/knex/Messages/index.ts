import options from "../../db/options/connectionSqlite";
const knex = require("knex")(options);

export const initializeSqlite = async () => {
  // console.log("voy a tratar de inicializar");
  try {
    await knex.schema.dropTableIfExists("messages");
    // console.log("Tabla borrada...");

    await knex.schema.createTable("messages", (table) => {
      table.increments("id"),
        table.string("mail"),
        table.timestamp("time").defaultTo(knex.fn.now()),
        table.string("content");
    });
  } catch (error) {}
};

export const getAllMessagesFromDB = async () => {
  try {
    return await knex.from("messages").select("*");
  } catch (error) {
    console.log(error);
  }
  return [];
};

export const addMessageToDB = async (message) => {
  try {
    const response = await knex("messages").insert(message);
    return response;
  } catch (error) {
    console.log(error);
  }
  return;
};