export default {
  client: "sqlite3",
  connection: {
    filename: "src/db/sqlite/messages.sqlite",
  },
  useNullAsDefault: true,
};

console.log("Conectando a la base de datos...");
