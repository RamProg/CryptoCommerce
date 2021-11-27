"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const nodeecommerce_c37d5_firebase_adminsdk_e7rf5_f07f40d228_1 = __importDefault(require("./nodeecommerce-c37d5-firebase-adminsdk-e7rf5-f07f40d228"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(nodeecommerce_c37d5_firebase_adminsdk_e7rf5_f07f40d228_1.default),
    databaseURL: "firebase-adminsdk-e7rf5@nodeecommerce-c37d5.iam.gserviceaccount.com",
});
exports.db = firebase_admin_1.default.firestore();
// export async function connect() {
//   try {
//     console.log("Conectando a la base de datos...");
//     await mongoose.connect(URI, dbOptions);
//     console.log("conecté");
//   } catch (error) {
//     console.log(error);
//   }
//   return;
// }
// export async function close() {
//   try {
//     console.log("voy a cerrar conexión");
//     if (mongoose.connection) {
//       await mongoose.connection.close();
//     }
//     console.log("cerre conexión");
//   } catch (error) {
//     console.log(error);
//   }
//   return;
// }
