import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  Unsubscribe,
  updateProfile,
  updatePassword,
  verifyBeforeUpdateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
// 🚀 Remova o import do 'toast'. Ele agora vive apenas no AuthContext.

export interface UserData {
  displayName?: string;
  photoURL?: string;
}

// Criar Conta
// (Obs: Seu AuthContext usa /api/admin para isso, então esta função
// pode não estar sendo usada por ele, mas a deixamos limpa de qualquer forma)
export const signUp = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Fazer Login
export const login = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  // Apenas retorne a promessa. O AuthContext vai cuidar do toast.
  return signInWithEmailAndPassword(auth, email, password);
};

// Fazer Logout
export const logout = async (): Promise<void> => {
  // Apenas retorne a promessa. O AuthContext vai cuidar do toast se precisar.
  return signOut(auth);
};

// Estado do Usuário em login
export const listenAuth = (
  callback: (user: User | null) => void
): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
};

// Atualizar Perfil (Nome/Foto)
export const updateUser = async (userData: UserData) => {
  const user = auth.currentUser;
  if (!user) {
    // Lance um erro que o toast.promise no AuthContext vai pegar
    throw new Error("Nenhum usuário autenticado.");
  }

  // Lógica simplificada: Apenas passe os dados.
  // Se 'displayName' for "" (vazio), ele salvará vazio.
  // Se 'displayName' for 'undefined', ele não será alterado.
  // Isso é exatamente o que queremos.
  return updateProfile(user, {
    displayName: userData.displayName,
    photoURL: userData.photoURL,
  });
};

// Atualizar E-mail
export const updateUserEmail = async (
  currentPassword: string,
  newEmail: string
) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Nenhum usuário autenticado.");
  }
  if (!user.email) {
    throw new Error("Usuário não possui e-mail para reautenticar.");
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);

  // 1. Reautentica
  await reauthenticateWithCredential(user, credential);
  
  // 2. Envia verificação para o novo e-mail
  await verifyBeforeUpdateEmail(user, newEmail);


};

// Atualizar Senha
export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Nenhum usuário autenticado.");
  }
  if (!user.email) {
    throw new Error("Usuário não possui e-mail para reautenticar.");
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);

  // 1. Reautentica
  await reauthenticateWithCredential(user, credential);

  // 2. Atualiza a senha
  // O 'await' garante que o erro seja pego pelo AuthContext
  await updatePassword(user, newPassword);
  logout();

};
