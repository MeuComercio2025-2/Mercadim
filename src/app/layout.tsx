import type { Metadata } from "next";
// @ts-ignore
import "./globals.css";

import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/components/theme-provider";


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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
