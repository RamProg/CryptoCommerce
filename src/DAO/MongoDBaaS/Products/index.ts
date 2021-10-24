import { Schema, Mongoose, model, Model } from "mongoose";
import { connect, close } from "../options/connectionMongoDB";
import ProductDAOInterface from "../../ProductDAOInterface";

const ProductSchema: Schema = new Schema({
  timestamp: { type: Date, require: true },
  name: { type: String, require: true, max: 50 },
  description: { type: String, require: true, max: 140 },
  code: { type: String, require: true, max: 5 },
  thumbnail: { type: String, require: true, max: 140 },
  price: { type: Number, require: true },
  stock: { type: Number, require: true },
});

export default class ProductDAOMongoDBaaS implements ProductDAOInterface {
  Product = model("products", ProductSchema);
  getAllProducts = async () => {
    try {
      await connect();
      const products = await this.Product.find();
      await close();
      return products;
    } catch (error) {
      console.log(error);
      await close();
      return [];
    }
  };

  getProductFromDB = async (_id: string) => {
    try {
      await connect();
      const response = await this.Product.find({ _id });
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

  addProductToDB = async (product) => {
    try {
      await connect();
      const p = new this.Product(product);
      await p.save();
    } catch (error) {
      console.log(error);
    }
    await close();
    return;
  };

  deleteProductFromDB = async (id) => {
    console.log("voy a borrar");
    try {
      await connect();
      const response = await this.Product.findByIdAndDelete(id);
      console.log("esto tengo que borrar", response);
    } catch (error) {
      console.log(error);
    }
    await close();
    return;
  };

  updateProductFromDB = async (_id, product) => {
    try {
      await connect();
      const response = await this.Product.updateOne({ _id }, product);
      close();
      return response;
    } catch (error) {
      console.log(error);
    }
    close();
    return;
  };
}
