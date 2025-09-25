import type { Metadata } from "next";

// @ts-ignore
import "./globals.css";



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
      <body
        suppressHydrationWarning
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
