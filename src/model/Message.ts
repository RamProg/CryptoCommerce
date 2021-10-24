import MessageFactory from "../DAO/MessageFactory";
import MessageInterface from "../DAO/MessageDAOInterface";
import persistanceType from "../DAO/config";

const messageDAO: MessageInterface = new MessageFactory().getMessageDAO(persistanceType);
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
      const response = await messageDAO.getAllMessagesFromDB();
      return response;
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
    const newMessage: Message = new Message(mail, time, content);
    try {
      messageDAO.addMessageToDB(newMessage);
    } catch (error: Error | unknown) {
      console.log(error);
    }
  }
}
