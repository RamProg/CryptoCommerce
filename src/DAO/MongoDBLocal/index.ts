import DAOInterface from "../../DAO/DAOInterface";
import { Schema, model } from "mongoose";
import { connect, close } from "./options/connectionMongoDB";
import { ConditionsType } from "../../model/Product";

const ProductSchema: Schema = new Schema({
  timestamp: { type: Date, require: true },
  name: { type: String, require: true, max: 50 },
  description: { type: String, require: true, max: 140 },
  code: { type: String, require: true, max: 5 },
  thumbnail: { type: String, require: true, max: 140 },
  price: { type: Number, require: true },
  stock: { type: Number, require: true },
});

const CartSchema: Schema = new Schema({
  timestamp: Date,
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "products",
    },
  ],
});

type ObjectWithId = {
  id: string;
};

export default class ProductDAOMongoLocal implements DAOInterface {
  products = model("products", ProductSchema);
  carts = model("carts", CartSchema);

  getAll = async (table: string) => {
    try {
      await connect();
      const collection = await eval("this." + table).find();
      await close();
      return collection;
    } catch (error) {
      console.log(error);
      await close();
      return [];
    }
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
    try {
      await connect();
      const mongoConditions: any = {};
      if (name) mongoConditions.name = name;
      if (code) mongoConditions.code = code;
      mongoConditions.price = { $lte: maxPrice, $gte: minPrice };
      mongoConditions.stock = { $lte: maxStock, $gte: minStock };
      const collection = await eval("this." + table).find(mongoConditions);
      await close();
      return collection;
    } catch (error) {
      console.log(error);
      await close();
      return [];
    }
  };

  getOne = async (table: string, _id: string) => {
    try {
      await connect();
      const response = await eval("this." + table).find({ _id });
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

  addElement = async (table: string, element: object) => {
    try {
      await connect();
      const e = new (eval("this." + table))(element);
      await e.save();
    } catch (error) {
      console.log(error);
    }
    await close();
    return element;
  };

  deleteElement = async (table: string, id: string) => {
    console.log("voy a borrar");
    try {
      await connect();
      const result = await eval("this." + table).findById(id);
      const response = await eval("this." + table).findByIdAndDelete(id);
      console.log("esto tengo que borrar", response);
      return result;
    } catch (error) {
      console.log(error);
    }
    await close();
  };

  updateElement = async (table: string, id: string, element: object) => {
    try {
      await connect();
      const response = await eval("this." + table).updateOne({ id }, element);
      close();
      return response;
    } catch (error) {
      console.log(error);
    }
    close();
    return;
  };

  addElementToArray = async (table: string, newElementToAdd: object) => {
    try {
      await connect();
      const carts = await eval("this." + table).find();
      if (!carts.length) {
        console.log("creo un carrito");

        const newCart = {
          timestamp: new Date().toString(),
          products: [newElementToAdd],
        };
        const e = new (eval("this." + table))(newCart);
        await e.save();
        carts.push(newCart);
      } else {
        console.log("ya hay  carrito, solo agrego");

        await eval("this." + table).updateOne(
          {},
          {
            $push: {
              products: newElementToAdd,
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
    await close();
    return newElementToAdd;
  };
  
  removeElementFromCollection = async (table: string, idToRemove: string) => {
    try {
      await connect();
      const carts = await eval("this." + table).find();
      if (carts.length) {
        await eval("this." + table).updateOne(
          {},
          { $pull: { products: idToRemove } }
        );
      }
    } catch (error) {
      console.log(error);
    }
    await close();
    return {};
  };
}
