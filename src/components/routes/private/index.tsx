"use client";

import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth();
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const router = useRouter();

  // Checa se existe admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("/api/admin"); // rota que retorna { exists: true/false }
        setAdminExists(res.data.hasAdmin);
      } catch (err) {
        console.error("Erro ao checar admin", err);
        setAdminExists(false); // assume que não existe admin em caso de erro
      }
    };

    checkAdmin();
  }, []);

  // Redirecionamentos
  useEffect(() => {
    if (loading || adminExists === null) return;

    if (!adminExists) {
      router.replace("/register"); // não existe admin → força registro
      return;
    }

    if (!user) {
      router.replace("/login"); // admin existe mas não está logado → login
    }
  }, [user, loading, adminExists, router]);

  // Loading enquanto auth ou checagem do admin
  if (loading || adminExists === null || !user) return null;

  return <>{children}</>;
}
