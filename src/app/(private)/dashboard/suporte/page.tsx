"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Mail, MapPin, MessageSquare, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// --- INFORMAÇÕES DA EMPRESA ---
const WHATSAPP_NUMBER = "558591347698";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
const EMAIL_ADDRESS = "pedroantonio5735@gmail.com";
const COMPANY_ADDRESS =
  "Rua das Delícias, 123, Bairro Centro, Fortaleza - CE, 60000-000";
const GOOGLE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  COMPANY_ADDRESS,
)}`;

// --- COMPONENTE ---
export default function SuportePage() {
  const [email, setEmail] = useState("");
  const [descricao, setDescricao] = useState("");
  const [assunto, setAssunto] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const sendFeedback = async () => {
    setMessage(null);
    if (!email || !descricao) {
      setMessage("Preencha e-mail e descrição.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, descricao, assunto }),
      });
      if (!res.ok) throw new Error("Erro ao enviar feedback");

      setEmail("");
      setDescricao("");
      setAssunto("");
      setMessage("Feedback enviado com sucesso.");
    } catch {
      setMessage("Erro ao enviar feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <LifeBuoy className="w-8 h-8" />
          Suporte e Contato
        </h1>
        <p className="text-muted-foreground mt-1">
          Precisa de ajuda? Estamos aqui para atendê-lo. Escolha um dos canais abaixo.
        </p>
      </header>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: WhatsApp */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              WhatsApp
            </CardTitle>
            <CardDescription>Atendimento rápido e direto.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Disponível de Seg. a Sex. das 8h às 18h.
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full md:w-auto bg-transparent border border-gray-500 text-gray-100 hover:bg-gray-800 hover:text-white transition"
            >
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                Chamar no WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Card: E-mail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              E-mail
            </CardTitle>
            <CardDescription>
              Para dúvidas, sugestões ou problemas técnicos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-medium text-foreground break-all">
              {EMAIL_ADDRESS}
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full md:w-auto bg-transparent border border-gray-500 text-gray-100 hover:bg-gray-800 hover:text-white transition"
            >
              <a href={`mailto:${EMAIL_ADDRESS}`}>Enviar E-mail</a>
            </Button>
          </CardContent>
        </Card>

        {/* Card: Feedback */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-orange-600" />
              Enviar Feedback
            </CardTitle>
            <CardDescription>
              Relate problemas, sugestões ou opiniões sobre o sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Assunto (opcional)"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
            />
            <textarea
              placeholder="Descrição do feedback"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="border rounded-md px-3 py-2 w-full min-h-[6rem] text-sm bg-transparent text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={sendFeedback}
              disabled={loading}
              variant="outline"
              className="w-full bg-transparent border border-gray-500 text-gray-100 hover:bg-gray-800 hover:text-white transition"
            >
              {loading ? "Enviando..." : "Enviar Feedback"}
            </Button>
            {message && (
              <p className="text-sm text-muted-foreground text-center">{message}</p>
            )}
          </CardContent>
        </Card>

        {/* Card: Endereço */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Nosso Endereço
            </CardTitle>
            <CardDescription>
              Venha nos visitar ou envie correspondência.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-medium text-foreground">{COMPANY_ADDRESS}</p>
            <Button
              asChild
              variant="outline"
              className="w-full md:w-auto bg-transparent border border-gray-500 text-gray-100 hover:bg-gray-800 hover:text-white transition"
            >
              <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer">
                Ver no Google Maps
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Rodapé + Modal Termos */}
      <footer className="mt-12 pt-8 border-t">
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>
            Este sistema é desenvolvido pela empresa Meu Comércio. Problemas devem ser relatados por algum dos canais acima.
          </p>
          <p className="font-medium">Versão do sistema: v1.0.0</p>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-sm text-blue-500 underline-offset-4">
                Termos e Licenças
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Termos e Licenças</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="termos">
                <TabsList className="flex border-b mb-4">
                  <TabsTrigger value="termos" className="px-4 py-2 font-semibold border-b-2 border-transparent data-[state=active]:border-blue-500">
                    Termos de Serviço
                  </TabsTrigger>
                  <TabsTrigger value="licencas" className="px-4 py-2 font-semibold border-b-2 border-transparent data-[state=active]:border-blue-500">
                    Licenças
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="termos" className="space-y-4 text-sm leading-relaxed text-foreground">
                  <p>
                    Ao utilizar o sistema <strong>Meu Comércio</strong>, você concorda com os termos descritos a seguir.
                  </p>
                  <p>
                    1. O uso deste sistema é exclusivo para operações comerciais autorizadas.
                  </p>
                  <p>
                    2. É proibida a redistribuição, modificação ou engenharia reversa sem permissão.
                  </p>
                  <p>
                    3. Alterações nos termos serão notificadas aos usuários registrados.
                  </p>
                  <p>
                    4. Dados são utilizados apenas para fins internos e operacionais.
                  </p>
                  <p>
                    5. O uso contínuo implica aceitação dos novos termos.
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Última atualização: {new Date().toLocaleDateString("pt-BR")}
                  </p>
                </TabsContent>

                <TabsContent value="licencas" className="space-y-3 text-sm leading-relaxed text-foreground">
                  <p className="font-semibold">Licenças de Terceiros</p>
                  <p>Este produto contém software sob licenças Apache, MIT e outras licenças abertas.</p>
                  <hr className="border-muted" />
                  <pre className="whitespace-pre-wrap text-xs">
{`Apache License 2.0

The following components are licensed under Apache License 2.0:
* AOSP, The Android Open Source Project
* ExoPlayer 2.9.6, © ExoPlayer 2021
* RobotoMono, © 2015 Google Inc.
* StringPacks, © Facebook Inc.
* DiskLruCache, © 2012 Jake Wharton
* CursorRecyclerViewAdapter, © 2014 skyfishjy@gmail.com`}
                  </pre>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </footer>
    </div>
  );
}
