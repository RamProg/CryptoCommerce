import { db } from "../options/connectionFirebase";
import MessageDAOInterface from "../../MessageDAOInterface";

export default class Firebase implements MessageDAOInterface {
  getAllMessagesFromDB = async () => {
    const result: any[] = [];
    try {
      const messagesRef = db.collection("messages");
      const snapshot = await messagesRef.get();
      snapshot.forEach((doc) => {
        result.push(doc.data());
      });
      return result;
    } catch (error) {
      console.log(error);
    }
    return result;
  };

  addMessageToDB = async (message) => {
    const data = {...message}
    try {
      const messagesRef = db.collection("messages");
      await messagesRef.doc().set(data);
    } catch (error) {
      console.log(error);
    }
    return;
  };
}
