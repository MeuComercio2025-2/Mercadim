// @/contexts/AuthContext.tsx

"use client";
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import {
  listenAuth,
  login,
  logout,
  updateUser,
  updateUserEmail,
  updateUserPassword,
  UserData,
} from "@/lib/auth"; // Importando do seu lib/auth.ts refatorado
import { User } from "@firebase/auth"; // Importe FirebaseError
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  updateUser: (data: UserData) => Promise<void>;
  updateUserEmail: (
    currentPassword: string,
    newEmail: string
  ) => Promise<void>;
  updateUserPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função helper para tratar erros do Firebase no Toast
const handleFirebaseError = (error: any, defaultMessage: string) => {
  if (error instanceof FirebaseError || (error && error.code)) {
    switch (error.code) {
      case "auth/requires-recent-login":
        return "Operação sensível. Por favor, faça login novamente.";
      case "auth/email-already-in-use":
        return "Este e-mail já está em uso.";
      case "auth/wrong-password":
        return "A senha atual está incorreta.";
      case "auth/too-many-requests":
        return "Muitas tentativas. Tente novamente mais tarde.";
      default:
        // Tenta retornar uma mensagem amigável do Firebase
        return error.message.replace("Firebase: ", "").split(" (")[0];
    }
  }
  return (error && error.message) || defaultMessage;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // O "hook" principal que escuta TODAS as alterações no usuário
  useEffect(() => {
    const unsubscribe = listenAuth(async (user) => {
      setUser(user);
      if (user) {
        try {
          // Força a atualização do token para pegar a 'role' mais recente
          const tokenResult = await user.getIdTokenResult(true);
          const userRole = (tokenResult.claims.role as string) || null;
          setRole(userRole);
        } catch (error) {
          console.error("Erro ao obter o token do usuário:", error);
          setRole(null);
        }
      } else {
        // Se o usuário for null (logout), limpa a role
        setRole(null);
      }
      setLoading(false);
    });
    // Limpa o listener ao desmontar
    return () => unsubscribe();
  }, []);

  // Handler para Criar Conta (Admin)
  const handleSignUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    // Este continua usando sua API, o que está correto
    await toast.promise(
      axios.post("/api/admin", { displayName, email, password }),
      {
        pending: "Criando conta de administrador...",
        success: "Conta criada! Realize o login para continuar.",
        error: {
          render({ data }) {
            if (axios.isAxiosError(data) && data.response) {
              return (
                data.response.data.error ||
                "Erro ao criar conta de administrador."
              );
            }
            return "Erro ao criar conta de administrador.";
          },
        },
      },
      { position: "bottom-left", autoClose: 5000 }
    );
    router.push("/login");
  };

  // Handler para Login
  const handleLogin = async (email: string, password: string) => {
    await toast.promise(
      login(email, password), // Chama a função de lib/auth
      {
        pending: "Entrando...",
        success: "Login realizado com sucesso!",
        error: {
          render({ data }) {
            return handleFirebaseError(data, "Erro ao fazer login.");
          },
        },
      }
    );
    // O 'listenAuth' detectará o login e o 'useEffect' fará o resto
    // Mas podemos redirecionar imediatamente para o dashboard
    router.push("/dashboard");
  };

  // Handler para Logout
  const handleLogout = async () => {
    await toast.promise(
      logout(), // Chama a função de lib/auth
      {
        pending: "Saindo...",
        success: "Você saiu com sucesso.",
        error: "Erro ao fazer logout.",
      }
    );
    // O 'listenAuth' detectará o logout, setará user=null
    // e o PrivateRoute (ou lógica similar) fará o redirecionamento
    router.push("/login");
  };

  // Handler para Atualizar Perfil (Nome/Foto)
  const handleUpdateUser = async (data: UserData) => {
    await toast.promise(
      updateUser(data), // Chama a função de lib/auth
      {
        pending: "Salvando alterações...",
        success: "Perfil atualizado com sucesso!",
        error: {
          render({ data }) {
            return handleFirebaseError(data, "Erro ao salvar alterações.");
          },
        },
      }
    );
    // 'listenAuth' detectará a mudança e atualizará o 'user' globalmente.
  };

  // Handler para Atualizar E-mail
  const handleUpdateEmail = async (
    currentPassword: string,
    newEmail: string
  ) => {
    await toast.promise(
      updateUserEmail(currentPassword, newEmail), // Chama a função de lib/auth
      {
        pending: "Verificando senha e enviando e-mail...",
        success: "Verifique sua nova caixa de e-mail para confirmar!",
        error: {
          render({ data }) {
            return handleFirebaseError(data, "Erro ao atualizar e-mail.");
          },
        },
      }
    );
    // Não há atualização imediata do 'user', pois o Firebase
    // espera a verificação do e-mail.
  };

  // Handler para Atualizar Senha
  const handleUpdatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    await toast.promise(
      updateUserPassword(currentPassword, newPassword), // Chama a função de lib/auth
      {
        pending: "Verificando senha e atualizando...",
        success: "Senha atualizada com sucesso!",
        error: {
          render({ data }) {
            return handleFirebaseError(data, "Erro ao atualizar senha.");
          },
        },
      }
    );
    // 'listenAuth' detectará a mudança e atualizará o 'user' globalmente.
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        loading,
        signUp: handleSignUp,
        login: handleLogin,
        logout: handleLogout,
        updateUser: handleUpdateUser,
        updateUserEmail: handleUpdateEmail,
        updateUserPassword: handleUpdatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve estar dentro de um AuthProvider");
  }
  return context;
};