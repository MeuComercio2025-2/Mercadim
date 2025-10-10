import type { Metadata } from "next";

// @ts-ignore
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer } from "react-toastify";


export const metadata: Metadata = {
  title: "Meu Comercio",
  description: "Criado Para A Cadeira de Desenvolvimento Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
