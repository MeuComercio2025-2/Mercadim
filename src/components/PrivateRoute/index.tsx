"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  console.log(user);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // redireciona se não estiver logado
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <p>Carregando...</p>; // ou skeleton
  }

  return <>{children}</>;
}
