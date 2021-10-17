import { Schema, Mongoose, model, Model } from "mongoose";
import { connect, close } from "../../db/options/connectionMongoDB";

const ProductSchema: Schema = new Schema({
  timestamp: { type: Date, require: true },
  name: { type: String, require: true, max: 50 },
  description: { type: String, require: true, max: 140 },
  code: { type: String, require: true, max: 5 },
  thumbnail: { type: String, require: true, max: 140 },
  price: { type: Number, require: true },
  stock: { type: Number, require: true },
});

const Product = model("products", ProductSchema);

export const getAllProducts = async () => {
  try {
    await connect();
    const products = await Product.find();
    await close();
    return products;
  } catch (error) {
    console.log(error);
    await close();
    return [];
  }
};

export const getProductFromDB = async (_id: string) => {
  try {
    await connect();
    const response = await Product.find({ _id });
    if (response.length) {
      await close();
      return response;
    }
  } catch (error) {
    console.log(error);
    await close();
    return undefined;
  }
};

export const addProductToDB = async (product) => {
  try {
    await connect();
    const p = new Product(product);
    await p.save();
  } catch (error) {
    console.log(error);
  }
  await close();
  return;
};

export const deleteProductFromDB = async (id) => {
  console.log("voy a borrar");
  try {
    await connect();
    const response = await Product.findByIdAndDelete(id);
    console.log("esto tengo que borrar", response);
  } catch (error) {
    console.log(error);
  }
  await close();
  return;
};

export const updateProductFromDB = async (_id, product) => {
  try {
    await connect();
    const response = await Product.updateOne({ _id }, product);
    close();
    return response;
  } catch (error) {
    console.log(error);
  }
  close();
  return;
};
