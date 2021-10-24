import MongoDBLocal from "./MongoDBLocal/Messages";
import MongoDBaaS from "./MongoDBaaS/Messages";
import Firebase from "./Firebase/Messages";

export default class MessageFactory {
  getMessageDAO(persistanceType) {
    console.log("persistanceType", persistanceType);

    switch (persistanceType) {
      case 5:
        return new MongoDBLocal();
      case 6:
        return new MongoDBaaS();
      case 7:
        return new Firebase();
      default:
        return new MongoDBLocal();
    }
  }
}
