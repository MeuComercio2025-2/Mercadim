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
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen p-6">
            {children}
        </main>
      </div>
      
    </PrivateRoute>
  );
}
