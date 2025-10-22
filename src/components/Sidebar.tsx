"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Settings,
  CircleDollarSign,
  Headset,
  Box,
  LogOut,
  Search,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
};

// Rotas de navegação principal
const navItems: NavItem[] = [
  { id: "/dashboard", label: "Home", icon: <Home size={18} /> },
  { id: "/dashboard/vendas", label: "Vendas", icon: <CircleDollarSign size={18} />, badge: 4 },
  { id: "/dashboard/estoque", label: "Estoque", icon: <Box size={18} /> },
  { id: "/dashboard/suporte", label: "Suporte", icon: <Headset size={18} /> },
  { id: "/dashboard/config", label: "Configurações", icon: <Settings size={18} /> },
  { id: "/dashboard/perfil", label: "Perfil", icon: <User size={18} /> }, // 🔹 nova rota adicionada
];

export default function Sidebar() {
  const { user, role, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = navItems.filter((n) =>
    n.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: -12, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -12, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="z-40 flex flex-col w-64 lg:w-72 h-screen border-r bg-background"
      >
        {/* Header - Avatar/Nome (clique abre perfil) */}
        <div
          className="p-5 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/perfil")}
        >
          <Avatar>
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback>
              {user?.displayName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sm">
              Olá, {user?.displayName?.split(" ")[0] || "Usuário"}
            </div>
            <div className="text-xs text-muted-foreground">
              {role || "Administrador"}
            </div>
          </div>
        </div>

        {/* Campo de busca */}
        <div className="px-5">
          <div className="relative mb-3">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Pesquisar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Separator />

        {/* Navegação */}
        <ScrollArea className="flex-1 p-4">
          <nav className="space-y-1">
            {filtered.map((item) => {
              const isActive = item.id === pathname;
              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.id)}
                  className={`w-full flex items-center justify-between gap-3 p-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/60"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="opacity-90">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full px-2 py-0.5 text-xs bg-muted-foreground/10">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Rodapé - info do usuário e logout */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between gap-3 min-w-0 overflow-hidden">
            <div
              className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer hover:bg-muted/50 rounded-lg p-1 transition-colors"
              onClick={() => router.push("/perfil")} // 🔹 clique no rodapé também abre o perfil
            >
              <Avatar>
                <AvatarImage src={user?.photoURL || ""} />
                <AvatarFallback>
                  {user?.displayName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div
                  className="text-sm font-medium truncate"
                  title={user?.email || "email@exemplo.com"}
                >
                  {user?.email || "email@exemplo.com"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Conta padrão
                </div>
              </div>
            </div>
            <Button
              onClick={() => logout()}
              variant="ghost"
              size="icon"
              aria-label="Logout"
              className="text-muted-foreground hover:text-destructive flex-shrink-0"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
