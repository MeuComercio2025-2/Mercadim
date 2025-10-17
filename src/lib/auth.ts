import { auth } from "@/config/firebase"
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    UserCredential,
    Unsubscribe
  } from "@firebase/auth"


// Criar Conta
export const signUp = async (email: string, password: string): Promise<UserCredential> => {
    return createUserWithEmailAndPassword(auth, email, password);
}

// Fazer Login
export const login = async (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
}

// Fazer Logout
export const logout = async (): Promise<void> => {
    return signOut(auth)
}

// Estado do Usuário em login
export const listenAuth = (callback: (user: User | null) => void): Unsubscribe => {
    return onAuthStateChanged(auth, callback);
}


