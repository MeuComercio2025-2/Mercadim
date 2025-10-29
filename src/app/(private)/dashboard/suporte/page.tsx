import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Mail, MapPin, MessageSquare } from "lucide-react";

// --- INFORMAÇÕES DA EMPRESA ---
// (Substitua pelos seus dados reais)

// Use o número no formato internacional (código do país + ddd + número)
const WHATSAPP_NUMBER = "558591347698";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
const EMAIL_ADDRESS = "pedroantonio5735@gmail.com";
const COMPANY_ADDRESS =
  "Rua das Delícias, 123, Bairro Centro, Fortaleza - CE, 60000-000";

// Link do Google Maps (opcional, mas recomendado)
const GOOGLE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  COMPANY_ADDRESS,
)}`;

// --- COMPONENTE ---

export default function SuportePage() {
  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <LifeBuoy className="w-8 h-8" />
          Suporte e Contato
        </h1>
        <p className="text-muted-foreground mt-1">
          Precisa de ajuda? Estamos aqui para atendê-lo. Escolha um dos canais
          abaixo.
        </p>
      </header>

      {/* Grid de Cards de Contato */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: WhatsApp */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              WhatsApp
            </CardTitle>
            <CardDescription>
              Para um atendimento rápido e direto.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Nosso time está disponível de Seg. a Sex. das 8h às 18h.
            </p>
            <Button asChild className="w-full md:w-auto">
              {/* O 'asChild' faz o Button se comportar como o 'a' (link) */}
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
            <Button asChild variant="outline" className="w-full md:w-auto">
              <a href={`mailto:${EMAIL_ADDRESS}`}>Enviar E-mail</a>
            </Button>
          </CardContent>
        </Card>

        {/* Card: Endereço (ocupando a largura total abaixo) */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Nosso Endereço
            </CardTitle>
            <CardDescription>
              Venha nos fazer uma visita ou enviar uma correspondência.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-medium text-foreground">
              {COMPANY_ADDRESS}
            </p>
            <Button asChild variant="secondary" className="w-full md:w-auto">
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver no Google Maps
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* --- NOTA DE RODAPÉ ADICIONADA --- */}
      <footer className="mt-12 pt-8 border-t">
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>
            Este sistema é desenvolvido pela empresa Meu Comércio. Quaisquer
            problemas ocorridos devem ser relatados a alguns dos contatos acima.
          </p>
          <p className="font-medium">Versão do sistema: v1.0.0</p>
        </div>
      </footer>
    </div>
  );
}