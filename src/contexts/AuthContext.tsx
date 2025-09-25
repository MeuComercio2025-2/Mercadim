"use client"
import { createContext, useContext, useState, useEffect } from "react";
import { listenAuth, login, logout, signUp } from "@/lib/auth"
import { User } from "@firebase/auth";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = listenAuth((user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSignUp = async (email: string, password: string) => {
        await signUp(email, password);
    };

    const handleLogin = async (email: string, password: string) => {
        await login(email, password);
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <AuthContext.Provider value={{ user, loading, signUp: handleSignUp, login: handleLogin, logout: handleLogout }}>
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