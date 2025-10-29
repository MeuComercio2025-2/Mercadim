"use client";

import { ModeToggle } from "@/components/ModeToggle";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
// ATUALIZAÇÃO: O Button não é mais necessário, então removi o import.
// import { Button } from "@/components/ui/button";

// ATUALIZAÇÃO: Imports para o Checkbox padrão do Shadcn
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function ConfigPage() {
  // Feito por Pedrooaj
  return (
    // ATUALIZAÇÃO: Removi 'min-h-screen' e adicionei 'max-w-4xl mx-auto'
    // para centralizar o conteúdo, o que é mais comum em telas de configuração.
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas preferências e ajustes do sistema.
        </p>
      </header>

      {/* Grid de cards */}
      {/* O layout md:grid-cols-2 funciona perfeitamente para os 2 itens restantes */}
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

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Gerencie notificações do sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* ATUALIZAÇÃO: 
              Substituí o <input type="checkbox"> pelo componente <Checkbox> do Shadcn
              e usei o <Label> para associar o texto, melhorando a acessibilidade
              e garantindo que o visual siga o tema.
            */}
            <div className="flex items-center space-x-2">
              <Checkbox id="notifications-email" />
              <Label
                htmlFor="notifications-email"
                className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Receber notificações por email
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* REMOVIDO: O card de "Conta" foi removido.
        */}

        {/* REMOVIDO: O card de "Segurança" foi removido.
        */}
      </div>
    </div>
  );
}