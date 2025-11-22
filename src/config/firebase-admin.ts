import * as admin from "firebase-admin";
import { initialize } from "fireorm"

if(!admin.apps.length){
    admin.initializeApp({
        credential: admin.credential.cert({
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY,
            projectId: process.env.FIREBASE_PROJECT_ID
        } as admin.ServiceAccount),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    })
}



const firestoreAdmin = admin.firestore();
initialize(firestoreAdmin,{
    validateModels: true
});

export default admin;
