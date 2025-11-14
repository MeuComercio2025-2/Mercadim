"use client";

import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LifeBuoy,
  Mail,
  MapPin,
  MessageSquare,
  MessageCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// --- INFORMAÇÕES DA EMPRESA ---
const WHATSAPP_NUMBER = "558591347698";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
const EMAIL_ADDRESS = "pedroantonio5735@gmail.com";
const COMPANY_ADDRESS =
  "Rua das Delícias, 123, Bairro Centro, Fortaleza - CE, 60000-000";
const GOOGLE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  COMPANY_ADDRESS
)}`;

// --- CONFIGURAÇÕES DE VALIDAÇÃO / COOLDOWN ---
const COOLDOWN_SECONDS = 60; // tempo entre envios (anti-flood)
const COOLDOWN_KEY = "feedbackCooldownUntil";
// domínios populares permitidos; além disso, aceitamos e-mails "profissionais" (domínio com ponto)
const ALLOWED_SIMPLE_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
  "gmx.com",
];

// --- UTILS ---
function validateEmailDomain(email: string) {
  // formato básico
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return false;

  const domain = email.split("@")[1].toLowerCase();
  if (ALLOWED_SIMPLE_DOMAINS.includes(domain)) return true;

  // aceitar e-mails corporativos (ex.: nome@empresa.com.br) - domain must include a dot and not be localhost-like
  if (domain.includes(".") && !domain.includes("localhost")) return true;

  return false;
}

function nowUnixSeconds() {
  return Math.floor(Date.now() / 1000);
}

// --- COMPONENTE ---
export default function SuportePage() {
  const [email, setEmail] = useState("");
  const [descricao, setDescricao] = useState("");
  const [assunto, setAssunto] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // cooldown state
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(() => {
    const raw = localStorage.getItem(COOLDOWN_KEY);
    return raw ? Number(raw) : null;
  });
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  // modal state for wait message
  const [openWaitModal, setOpenWaitModal] = useState(false);

  useEffect(() => {
    // update seconds left
    const computeLeft = () => {
      if (!cooldownUntil) {
        setSecondsLeft(0);
        return;
      }
      const left = cooldownUntil - nowUnixSeconds();
      setSecondsLeft(left > 0 ? left : 0);
      if (left <= 0) {
        setCooldownUntil(null);
        localStorage.removeItem(COOLDOWN_KEY);
      }
    };

    computeLeft();
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    intervalRef.current = window.setInterval(computeLeft, 1000);
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cooldownUntil]);

  const startCooldown = (seconds = COOLDOWN_SECONDS) => {
    const until = nowUnixSeconds() + seconds;
    setCooldownUntil(until);
    localStorage.setItem(COOLDOWN_KEY, String(until));
    setSecondsLeft(seconds);
  };

  const sendFeedback = async () => {
    setMessage(null);

    // validações front
    if (!email || !descricao) {
      setMessage("Preencha e-mail e descrição.");
      return;
    }
    if (!validateEmailDomain(email)) {
      setMessage(
        "E-mail inválido. Utilize um @gmail/@hotmail/@outlook/@yahoo ou um e-mail corporativo."
      );
      return;
    }
    if (descricao.trim().length < 10) {
      setMessage("Descrição muito curta (mínimo 10 caracteres).");
      return;
    }

    // se tiver cooldown ativo, abrir modal profissional e não enviar
    const now = nowUnixSeconds();
    if (cooldownUntil && cooldownUntil > now) {
      setOpenWaitModal(true);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          descricao,
          assunto,
          // meta: poderia enviar userId, origem, userAgent etc.
        }),
      });

      if (!res.ok) {
        // opcionalmente ler body com erro
        const txt = await res.text().catch(() => null);
        throw new Error(txt || "Erro ao enviar feedback");
      }

      // sucesso: limpar campos, mensagem e iniciar cooldown
      setEmail("");
      setDescricao("");
      setAssunto("");
      setMessage("Feedback enviado com sucesso. Obrigado!");
      startCooldown(COOLDOWN_SECONDS);
    } catch (err) {
      console.error("Erro feedback:", err);
      setMessage("Erro ao enviar feedback. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  // função utilitária para mostrar o texto do botão com cooldown
  const sendButtonLabel = () => {
    if (loading) return "Enviando...";
    if (secondsLeft > 0) return `Aguarde ${secondsLeft}s para enviar novamente`;
    return "Enviar Feedback";
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
          Atendimento para assuntos empresariais, financeiros e operacionais. Escolha um dos canais abaixo.
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
              Para contato empresarial, financeiro ou questões técnicas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-medium text-foreground break-all">{EMAIL_ADDRESS}</p>
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
              Relate problemas, sugestões ou solicitações operacionais / financeiras. Forneça detalhes claros para atendimento corporativo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Seu e-mail (ex: voce@empresa.com ou voce@gmail.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Assunto (opcional)"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
            />
            <textarea
              placeholder="Descrição do feedback (mín. 10 caracteres)"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="border rounded-md px-3 py-2 w-full min-h-[6rem] text-sm bg-transparent text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={sendFeedback}
              disabled={loading || secondsLeft > 0}
              variant="outline"
              className="w-full bg-transparent border border-gray-500 text-gray-100 hover:bg-gray-800 hover:text-white transition"
            >
              {sendButtonLabel()}
            </Button>
            {message && (
              <p className="text-sm text-muted-foreground text-center">{message}</p>
            )}
            {/* Informação sobre política de uso e tempo */}
            <p className="text-xs text-muted-foreground text-center mt-1">
              Nota: para evitar uso indevido do canal, há um intervalo entre envios.
            </p>
          </CardContent>
        </Card>

        {/* Card: Endereço */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Nosso Endereço
            </CardTitle>
            <CardDescription>Venha nos visitar ou envie correspondência.</CardDescription>
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
            Este sistema é desenvolvido pela empresa Meu Comércio. Problemas e solicitações empresariais devem ser relatados por
            algum dos canais acima.
          </p>
          <p className="font-medium">Versão do sistema: v1.0.0</p>

          <Dialog open={false}>
            <DialogTrigger asChild>
            </DialogTrigger>
          </Dialog>

          {/* Modal de Termos (sempre disponível através do botão acima) */}
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
                  <TabsTrigger
                    value="termos"
                    className="px-4 py-2 font-semibold border-b-2 border-transparent data-[state=active]:border-blue-500"
                  >
                    Termos de Serviço
                  </TabsTrigger>
                  <TabsTrigger
                    value="licencas"
                    className="px-4 py-2 font-semibold border-b-2 border-transparent data-[state=active]:border-blue-500"
                  >
                    Licenças
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="termos" className="space-y-4 text-sm leading-relaxed text-foreground">
                  <p>
                    Ao utilizar o sistema <strong>Meu Comércio</strong>, você concorda com os termos descritos a seguir.
                  </p>

                  <p className="font-semibold">1. Uso e autorização</p>
                  <p>
                    O uso deste sistema é restrito a operações comerciais autorizadas pela empresa. Acesso, uso ou modificação não autorizados são proibidos.
                  </p>

                  <p className="font-semibold">2. Confidencialidade e dados</p>
                  <p>
                    Informações fornecidas através dos canais de suporte podem conter dados comerciais sensíveis. A empresa trata essas informações com confidencialidade e utiliza-as para fins operacionais, legais e de melhoria do serviço.
                  </p>

                  <p className="font-semibold">3. Retenção e privacidade</p>
                  <p>
                    Dados de tickets e comunicações poderão ser retidos por um período necessário ao atendimento e cumprimento de obrigações legais. Consulte a política de privacidade para detalhes sobre coleta e tratamento de dados.
                  </p>

                  <p className="font-semibold">4. Segurança</p>
                  <p>
                    A empresa adota medidas razoáveis de segurança técnica e administrativa. Não obstante, o usuário deve evitar enviar informações altamente sensíveis (ex.: senhas) via canais públicos.
                  </p>

                  <p className="font-semibold">5. Uso permitido e proibições</p>
                  <p>
                    É proibido utilizar os canais de suporte para spam, conteúdo ofensivo, ameaças, ou atividades ilegais. Mensagens que violem estas regras poderão ser descartadas e podem resultar em bloqueio do usuário.
                  </p>

                  <p className="font-semibold">6. Alterações dos termos</p>
                  <p>
                    Alterações nos termos serão comunicadas aos usuários registrados. O uso continuado do sistema implica aceitação das atualizações.
                  </p>

                  <p className="font-semibold">7. Contato Legal / Contratual</p>
                  <p>
                    Para questões contratuais ou legais, entre em contato com o departamento responsável através dos canais corporativos oficiais.
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
              <div className="mt-4 text-right">
                <DialogClose asChild>
                  <Button variant="ghost">Fechar</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </footer>

      {/* Modal profissional exibido quando tenta enviar durante cooldown */}
      <Dialog open={openWaitModal} onOpenChange={setOpenWaitModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Aguarde antes de enviar novamente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-foreground">
              Recebemos seu último contato recentemente. Para manter a qualidade do atendimento e evitar sobrecarga,
              aguarde {secondsLeft > 0 ? `${secondsLeft}s` : "alguns instantes"} antes de tentar enviar outro feedback.
            </p>
            <p className="text-xs text-muted-foreground">
              Se sua solicitação for urgente, entre em contato via WhatsApp ou telefone corporativo.
            </p>
            <div className="flex justify-end">
              <DialogClose asChild>
                <Button>Fechar</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
