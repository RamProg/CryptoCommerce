import { Schema, model } from "mongoose";
import { connect, close } from "../options/connectionMongoDB";
import MessageDAOInterface from "../../MessageDAOInterface";

const MessageSchema: Schema = new Schema({
  mail: { type: String, require: true, max: 50 },
  time: { type: String, require: true, max: 50 },
  content: { type: String, require: true, max: 140 },
});


export default class MessageDAOMongoDBLocal implements MessageDAOInterface {
  Message = model("messages", MessageSchema);
  getAllMessagesFromDB = async () => {
    try {
      await connect();
      const messages = await this.Message.find();
      await close();
      return messages;
    } catch (error) {
      console.log(error);
    }
    await close();
    return [];
  };

  addMessageToDB = async (message) => {
    try {
      await connect();

      const m = new this.Message(message);
      await m.save();
    } catch (error) {
      console.log(error);
    }
    await close();
    return;
  };
}
