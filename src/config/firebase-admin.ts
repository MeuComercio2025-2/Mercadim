<<<<<<< HEAD
import "reflect-metadata";
=======
>>>>>>> dev
import * as admin from "firebase-admin";
import { initialize } from "fireorm"
import serviceAccount from "../../firebase.json"

if(!admin.apps.length){
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    })
}



const firestoreAdmin = admin.firestore();
initialize(firestoreAdmin,{
    validateModels: true
});

export default admin;