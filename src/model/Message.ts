import DAOFactory from "../DAO/DAOFactory";
import DAOInterface from "../DAO/DAOInterface";
import persistanceType from "../DAO/config";
import { normalize, denormalize, schema } from "normalizr";

export const authorSchema = new schema.Entity("author", {}, { idAttribute: "email" });

export const messageSchema = new schema.Entity("message");

export const chatSchema = new schema.Entity("chat", {
  author: authorSchema,
  message: messageSchema,
});

const table = "messages";

const DAO: DAOInterface = new DAOFactory().getDAO(persistanceType);
export default class Message {
  mail: string;
  name: string;
  lastname: string;
  age: number;
  alias: string;
  avatar: string;
  time: string;
  content: string;
  constructor(
    mail: string,
    name: string,
    lastname: string,
    age: number,
    alias: string,
    avatar: string,
    time: string,
    content: string
  ) {
    this.mail = mail;
    this.name = name;
    this.lastname = lastname;
    this.age = age;
    this.alias = alias;
    this.avatar = avatar;
    this.time = time;
    this.content = content;
  }

  static getAllMessages = async function (): Promise<object> {
    try {
      const response = { id: "1", ...(await DAO.getAll(table)) };

      const normalized = normalize(response, chatSchema);

      const denormalized = denormalize(
        normalized.result,
        chatSchema,
        normalized.entities
      );
      delete denormalized.id;

      return denormalized;
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return [];
  };

  static async addMessage(
    mail: string,
    name: string,
    lastname: string,
    age: number,
    alias: string,
    avatar: string,
    time: string,
    content: string
  ): Promise<void> {
    const newMessage: Message = new Message(
      mail,
      name,
      lastname,
      age,
      alias,
      avatar,
      time,
      content
    );
    try {
      console.log("new message", newMessage);

      await DAO.addElement(table, newMessage);
    } catch (error: Error | unknown) {
      console.log(error);
    }
  }
}
