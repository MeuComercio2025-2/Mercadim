import type { Metadata } from "next";
import { PrivateRoute } from "@/components/routes/private";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Meu Comercio - Dashboard",
  description: "Criado Para A Cadeira de Desenvolvimento Web",
};

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PrivateRoute>
      {/* 1. Adicionado 'h-screen' para travar a altura total na tela */}
      <div className="flex h-screen">
        <Sidebar />
        {/* 2. Removido 'min-h-screen' e adicionado 'overflow-y-auto' 
             Isso cria o scroll interno apenas para o conteúdo principal.
        */}
        <main className="flex-1 overflow-y-auto p-6">
            {children}
        </main>
      </div>
      
    </PrivateRoute>
  );
}