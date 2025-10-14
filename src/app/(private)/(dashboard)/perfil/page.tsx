"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";

export default function PerfilPage() {
  const { user, role } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setPhotoURL(user.photoURL || "");
      setPhone(user.phoneNumber || "");
    }
  }, [user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) setPhotoURL(event.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await new Promise((res) => setTimeout(res, 1000));
      setMessage("Alterações salvas localmente (modo de demonstração).");
    } catch {
      setMessage("Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-5 flex-wrap">
        <div className="relative group cursor-pointer">
          <Avatar className="w-28 h-28">
            <AvatarImage src={photoURL || ""} />
            <AvatarFallback>
              {displayName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
            <Pencil size={22} className="text-white" />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">{displayName || "Usuário"}</h1>
          <p className="text-sm text-muted-foreground">
            {role || "Administrador"} • {email}
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} disabled />
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="company">Nome da Empresa</Label>
          <Input
            id="company"
            placeholder="Ex: Meu Comércio LTDA"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="position">Cargo / Função</Label>
          <Input
            id="position"
            placeholder="Ex: Gerente, Vendedor, Estoquista"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            placeholder="Rua, número, bairro..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            placeholder="Ex: São Paulo"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            placeholder="Ex: SP"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="zip">CEP</Label>
          <Input
            id="zip"
            placeholder="00000-000"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div className="flex justify-center">
        <Button onClick={handleSave} disabled={saving} className="w-48">
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      {message && (
        <p
          className={`text-center text-sm ${
            message.toLowerCase().includes("erro")
              ? "text-red-500"
              : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
