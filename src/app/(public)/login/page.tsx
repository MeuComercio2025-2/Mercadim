"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl"><ShoppingCart /></div>
            <CardTitle className="text-center">Meu Mercado</CardTitle>
            <p className="text-gray-500 text-sm">
              Entre para acessar o sistema
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            Primeiro Acesso?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
