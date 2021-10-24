import MongoDBLocal from "./MongoDBLocal/Products";
import MongoDBaaS from "./MongoDBaaS/Products";
import Firebase from "./Firebase/Products";

export default class ProductFactory {
  getMessageDAO(persistanceType) {
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
