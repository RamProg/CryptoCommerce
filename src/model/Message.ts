import _messages from "../data/messages.json";
import fs from "fs";

export default class Message {
  mail: string;
  time: string;
  content: string;
  constructor(mail: string, time: string, content: string) {
    this.mail = mail;
    this.time = time;
    this.content = content;
  }

  static getAllMessages = async function (): Promise<object[] | void> {
    try {
      const response = fs.readFileSync("./src/data/messages.json", "utf-8");
      return JSON.parse(response);
    } catch (error) {
      console.log(error);
    }
  };

  static async addMessage(
    mail: string,
    time: string,
    content: string
  ): Promise<void> {
    const oldMessages = await this.getAllMessages();
    const newMessage = new Message(mail, time, content);
    const allMessages = oldMessages?.length
      ? [...oldMessages, newMessage]
      : [newMessage];
    const allMessagesString = JSON.stringify(allMessages);
    try {
      fs.writeFileSync("./src/data/messages.json", allMessagesString);
    } catch (error) {
      console.log(error);
    }
  }
}
