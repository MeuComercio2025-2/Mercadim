"use client";

import { ModeToggle } from "@/components/ModeToggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ConfigPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      {/* Cabeçalho */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas preferências e ajustes do sistema.
        </p>
      </header>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tema */}
        <Card>
          <CardHeader>
            <CardTitle>Tema</CardTitle>
            <CardDescription>Ative ou desative o modo escuro.</CardDescription>
          </CardHeader>
          <CardContent>
            <ModeToggle />
          </CardContent>
        </Card>

        {/* Conta */}
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>Atualize suas informações de conta.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Alterar senha</Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Gerencie notificações do sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border border-border bg-background checked:bg-primary checked:text-primary-foreground"
              />
              <span>Receber notificações por email</span>
            </label>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Configurações de segurança e login.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Encerrar todas as sessões</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
