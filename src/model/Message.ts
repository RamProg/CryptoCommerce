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

  static getAllMessages = async function (): Promise<object[]> {
    try {
      const response: string = fs.readFileSync(
        "./src/data/messages.json",
        "utf-8"
      );
      return JSON.parse(response);
    } catch (error: Error | unknown) {
      console.log(error);
    }
    return [];
  };

  static async addMessage(
    mail: string,
    time: string,
    content: string
  ): Promise<void> {
    const oldMessages: object[] = await this.getAllMessages();
    const newMessage: Message = new Message(mail, time, content);
    const allMessages: object[] = oldMessages?.length
      ? [...oldMessages, newMessage]
      : [newMessage];
    const allMessagesString: string = JSON.stringify(allMessages);
    try {
      fs.writeFileSync("./src/data/messages.json", allMessagesString);
    } catch (error: Error | unknown) {
      console.log(error);
    }
  }
}
