import { auth } from "@/config/firebase"
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    UserCredential,
    Unsubscribe,
    updateProfile,
    updateEmail,
    updatePassword,
    

  } from "@firebase/auth"
import { toast } from "react-toastify";


export interface UserData{
    displayName?: string;
    photoURL?: string;
}

// Criar Conta
export const signUp = async (email: string, password: string): Promise<UserCredential> => {
    return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        toast.success("Conta criada com sucesso!", { position: "bottom-right" });
        return userCredential;
    }).catch((error) => {
        toast.error("Erro ao criar conta: " + error.message, { position: "bottom-right" });
        throw error;
    });
}

// Fazer Login
export const login = async (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        toast.success("Login realizado com sucesso!", { position: "bottom-right" });
        return userCredential;
    }).catch((error) => {
        toast.error("Erro ao fazer login: " + error.message, { position: "bottom-right" });
        throw error;
    });
}

// Fazer Logout
export const logout = async (): Promise<void> => {
    return signOut(auth).then(() => {
        toast.success("Logout realizado com sucesso!", { position: "bottom-right" });
    }).catch((error) => {
        toast.error("Erro ao fazer logout: " + error.message,  { position: "bottom-right" });
    });
}

// Estado do Usuário em login
export const listenAuth = (callback: (user: User | null) => void): Unsubscribe => {
    return onAuthStateChanged(auth, callback);
}


export const updateUser = async (userData: UserData) => {
    if(auth.currentUser){
        await updateProfile(auth.currentUser, {
            displayName: userData.displayName || auth.currentUser.displayName || undefined,
            photoURL: userData.photoURL || auth.currentUser.photoURL || undefined,
        }).catch((error) => {
            toast.error("Erro ao atualizar perfil: " + error.message);
            throw error;
        });
        toast.success("Perfil atualizado com sucesso!", { position: "bottom-right" });
        

    }else{
        toast.error("Nenhum usuário autenticado.");
    }
}

export const updateUserEmail = async (newEmail: string) => {
    if(auth.currentUser){
        await updateEmail(auth.currentUser, newEmail).then(() => {
            toast.success("E-mail atualizado com sucesso!", { position: "bottom-right" });
        }).catch((error) => {
            toast.error("Erro ao atualizar e-mail: " + error.message, { position: "bottom-right" });
            throw error;
        });
    }else{
        toast.error("Nenhum usuário autenticado.");
    }
}

export const updateUserPassword = async (newPassword: string) => {
    if(auth.currentUser){
        await updatePassword(auth.currentUser, newPassword).then(() => {
            toast.success("Senha atualizada com sucesso!", { position: "bottom-right" });
        }).catch((error) => {
            toast.error("Erro ao atualizar senha: " + error.message, { position: "bottom-right" });
            throw error;
        });
    }else{
        toast.error("Nenhum usuário autenticado.");
    }
}