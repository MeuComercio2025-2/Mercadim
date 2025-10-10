"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Settings,
  Users,
  BookOpen,
  LogOut,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";

export type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string | number;
};

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: <Home size={18} /> },
  { id: "projects", label: "Projects", icon: <BookOpen size={18} />, badge: 4 },
  { id: "team", label: "Team", icon: <Users size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function Sidebar() {
  const [active, setActive] = useState("home");
  const [query, setQuery] = useState("");
  const { user, logout } = useAuth();

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
        {/* Header */}
        <div className="p-5 flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback>
              {user?.displayName?.[0]?.toUpperCase() || "P"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sm">
              Olá, {user?.displayName?.split(" ")[0] || "Usuário"}
            </div>
            <div className="text-xs text-muted-foreground">Administrador</div>
          </div>
        </div>

        {/* Busca */}
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
              const isActive = item.id === active;
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`w-full flex items-center justify-between gap-3 p-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted/60"}
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

        {/* Rodapé */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between gap-3 min-w-0 overflow-hidden">
            <div className="flex items-center gap-3 min-w-0 flex-1">
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
                <div className="text-xs text-muted-foreground">Conta padrão</div>
              </div>
            </div>
            <Button
              onClick={() => logout()}
              variant="ghost"
              size="icon"
              aria-label="Logout"
              className="text-muted-foreground hover:text-destructive flex-shrink-0"
            >
              <LogOut  size={18} />
            </Button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
