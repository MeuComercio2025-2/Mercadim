"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface EmailChangeDialogProps {
  onConfirm: (currentPassword: string, newEmail: string) => void;
}

export default function EmailChangeDialog({ onConfirm }: EmailChangeDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleConfirm = () => {
    onConfirm(currentPassword, newEmail);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <Mail className="w-4 h-4" /> Trocar e-mail
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trocar e-mail</DialogTitle>
          <DialogDescription>
            Confirme sua senha atual e informe o novo e-mail.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-3">
          <Input
            placeholder="Senha atual"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            placeholder="Novo e-mail"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
