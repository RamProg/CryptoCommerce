export default {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "productos",
  },
  pool: { min: 0, max: 7 },
};

console.log("Conectando a la base de datos...");
