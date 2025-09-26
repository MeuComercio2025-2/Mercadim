"use client";
import axios from "axios"
import { createContext, useContext, useState, useEffect } from "react";
import { listenAuth, login, logout, signUp } from "@/lib/auth";
import { User } from "@firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = listenAuth((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

 const handleSignUp = async (email: string, password: string, displayName: string) => {
  return toast.promise(
    axios.post("/api/admin", { displayName, email, password }),
    {
      pending: "Criando conta de administrador...",
      success: "Conta criada! Realize o login para continuar.",
      error: "Erro ao criar conta de administrador."
    },
    {
      position: "bottom-left",
      autoClose: 5000
    }
  ).then(() => {
    router.push("/login");
  });
};


const handleLogin = async (email: string, password: string) => {
  return toast.promise(
    login(email, password),
    {
      pending: "Validando suas credenciais...",
      success: "Login realizado com sucesso!",
      error: "Erro ao fazer login. Verifique suas credenciais."
    },
    {
      position: "bottom-left",
      autoClose: 5000
    }
  ).then(() => {
    router.push("/");
  });
};

// Logout
const handleLogout = async () => {
  return toast.promise(
    logout(),
    {
      pending: "Finalizando sessão...",
      success: "Logout realizado com sucesso!",
      error: "Erro ao fazer logout."
    },
    {
      position: "bottom-left",
      autoClose: 5000
    }
  ).then(() => {
    router.push("/login");
  });
};

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp: handleSignUp,
        login: handleLogin,
        logout: handleLogout,
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
