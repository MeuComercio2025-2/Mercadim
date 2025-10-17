import { firestore } from "@/config/firebase"
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    DocumentData,
    QuerySnapshot
} from "firebase/firestore";


// Criar Documento
export const createDocument = async (collectionName: string, data: DocumentData) => {
    const ref = await addDoc(collection(firestore, collectionName), data);
    return ref;
}

// Obter documento por ID
export const getDocument = async (collectionName: string, docId: string) => {
    const snap = await getDoc(doc(firestore, collectionName, docId));
    if(snap.exists()){
        return snap.data();
    }else{
        return null;
    }
}

// Obter todos os documentos de uma collection
export const getCollection = async (collectionName: string) => {
    const snap: QuerySnapshot<DocumentData> = await getDocs(
        collection(firestore, collectionName)
    )
    return snap.docs.map((doc) => ({id: doc.id, ...doc.data()}))
}

// Atualizar documento existente
export const updateDocument = async (collectionName: string, docId: string, data: Partial<DocumentData>) => {
    await updateDoc(doc(firestore, collectionName, docId), data)
}

// Deletar documento
export const deleteDocument = async (collectionName: string, docId: string) => {
    await deleteDoc(doc(firestore, collectionName, docId))
}