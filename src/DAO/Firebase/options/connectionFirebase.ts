import admin from "firebase-admin";
import serviceAccount from "./nodeecommerce-c37d5-firebase-adminsdk-e7rf5-f07f40d228";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL:
    "firebase-adminsdk-e7rf5@nodeecommerce-c37d5.iam.gserviceaccount.com",
});

export const db = admin.firestore();

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
