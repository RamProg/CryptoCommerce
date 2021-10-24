import mongoose from "mongoose";

const URI = "mongodb://localhost:27017/ecommerce";
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 1000,
};

export async function connect() {
  try {
    console.log("Conectando a la base de datos...");
    await mongoose.connect(URI, dbOptions);
    console.log("conecté");
  } catch (error) {
    console.log(error);
  }
  return;
}

export async function close() {
  try {
    console.log("voy a cerrar conexión");
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    console.log("cerre conexión");
  } catch (error) {
    console.log(error);
  }
  return;
}
