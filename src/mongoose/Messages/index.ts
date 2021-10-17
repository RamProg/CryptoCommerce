import { Schema, model } from "mongoose";
import { connect, close } from "../../db/options/connectionMongoDB";

const MessageSchema: Schema = new Schema({
  mail: { type: String, require: true, max: 50 },
  time: { type: String, require: true, max: 50 },
  content: { type: String, require: true, max: 140 },
});

const Message = model("messages", MessageSchema);

export const getAllMessagesFromDB = async () => {
  try {
    await connect();
    const messages = await Message.find();
    await close();
    return messages;
  } catch (error) {
    console.log(error);
  }
  await close();
  return [];
};

export const addMessageToDB = async (message) => {
  try {
    await connect();

    const m = new Message(message);
    await m.save();
  } catch (error) {
    console.log(error);
  }
  await close();
  return;
};
