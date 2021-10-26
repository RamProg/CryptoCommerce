import DAOFactory from "../DAO/DAOFactory";
import DAOInterface from "../DAO/DAOInterface";
import persistanceType from "../DAO/config";

const table = "messages";

const DAO: DAOInterface = new DAOFactory().getDAO(persistanceType);
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
      const response = await DAO.getAll(table);
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
      DAO.addElement(table, newMessage);
    } catch (error: Error | unknown) {
      console.log(error);
    }
  }
}
