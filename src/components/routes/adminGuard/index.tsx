"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Loading from "@/components/loading";


interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  // null = carregando, true = existe, false = não existe
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Efeito para verificar o status do admin
  useEffect(() => {
    // Define como "carregando" (null) no início de CADA verificação.
    // Isso força o segundo useEffect a esperar pela conclusão.
    setAdminExists(null); 
    
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get("/api/admin");
        setAdminExists(response.data.hasAdmin);
      } catch (error) {
        console.error("Erro ao verificar status do admin:", error);
        setAdminExists(false);
      }
    };

    checkAdminStatus();
    
    // A CORREÇÃO PRINCIPAL:
    // Roda este efeito toda vez que o 'pathname' (a rota) mudar.
  }, [pathname]); // <-- Array de dependência corrigido

  // Efeito para lidar com os redirecionamentos
  useEffect(() => {
    // 1. Não faz nada até que a verificação (adminExists) esteja completa
    if (adminExists === null) {
      return; // Espera o 'checkAdminStatus' terminar
    }

    // 2. Se o admin EXISTE, o destino correto é "/login"
    if (adminExists) {
      if (pathname !== "/login") {
        router.push("/login");
      }
    }
    // 3. Se o admin NÃO EXISTE, o destino correto é "/register"
    else {
      if (pathname !== "/register") {
        router.push("/register");
      }
    }
  }, [adminExists, pathname, router]);

  // Lógica de renderização
  
  // 1. Se ainda está carregando a informação do admin, não renderiza nada
  if (adminExists === null) {
    return <Loading />;
  }

  // 2. Se o admin existe E estamos na página de login, mostra a página
  if (adminExists && pathname === "/login") {
    return <>{children}</>;
  }

  // 3. Se o admin não existe E estamos na página de registro, mostra a página
  if (!adminExists && pathname === "/register") {
    return <>{children}</>;
  }

  

  // 4. Em todos os outros casos (ex: sendo redirecionado),
  //    não renderiza nada.
  return;
}