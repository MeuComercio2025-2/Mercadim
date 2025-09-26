import type { Metadata } from "next";
import { PrivateRoute } from "@/components/PrivateRoute";

export const metadata: Metadata = {
  title: "Meu Comercio - Dashboard",
  description: "Criado Para A Cadeira de Desenvolvimento Web",
};

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
