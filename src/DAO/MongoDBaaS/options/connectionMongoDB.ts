import mongoose from "mongoose";

const URI = "mongodb+srv://rama:rama@cluster0.do4gw.mongodb.net/ecommerce?retryWrites=true&w=majority";
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 2000,
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
