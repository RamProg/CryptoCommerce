import Memory from "./Memory";
import FS from "./Filesystem";
import Firebase from "./Firebase";
import MongoDBaaS from "./MongoDBaaS";
import MongoDBLocal from "./MongoDBLocal";
import MySQL from "./MySQL";
import SQLite from "./SQLite";

export default class DAOFactory {
  getDAO(persistanceType: number) {
    switch (persistanceType) {
      case 0:
        return new Memory();
      case 1:
        return new FS();
      case 2:
        return new MySQL();
      case 4:
        return new SQLite();
      case 5:
        return new MongoDBLocal();
      case 6:
        return new MongoDBaaS();
      case 7:
        return new Firebase();
      default:
        return new Memory();
    }
  }
}
