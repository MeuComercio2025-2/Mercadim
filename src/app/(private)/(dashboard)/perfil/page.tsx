"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Key } from "lucide-react";

// ✅ Schema principal do perfil
const profileSchema = z
  .object({
    displayName: z.string().optional(),
    email: z.string().email("E-mail inválido").optional(),
    photoURL: z.string().url("Informe uma URL válida").optional(),
    password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 6, {
        message: "Senha deve ter ao menos 6 caracteres",
      }),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    }
  );

type ProfileFormData = z.infer<typeof profileSchema>;

export default function PerfilPage() {
  const { user, updateUserEmail } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      email: "",
      photoURL: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Estados dos modais
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Inputs do modal de troca de e-mail
  const [emailCurrentPassword, setEmailCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Inputs do modal de troca de senha
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const photoWatch = watch("photoURL");

  // Preenche dados do usuário atual
  useEffect(() => {
    if (!user) return;
    if (user.displayName) setValue("displayName", user.displayName);
    if (user.email) setValue("email", user.email);
    if (user.photoURL) setValue("photoURL", user.photoURL);
  }, [user, setValue]);

  const onSubmit = (data: ProfileFormData) => {
    console.log("Form principal:", data);
        
  };

  const onError = () => {
    Object.values(errors).forEach((err: any) => {
      if (err?.message) toast.error(err.message);
    });
  };

  return (
    <div className="w-full h-full flex justify-center items-center py-10">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle>Meu Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
            {/* Foto */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border">
                <img
                  src={photoWatch || "/placeholder-user.png"}
                  alt="Foto do usuário"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              <Input placeholder="URL da foto" {...register("photoURL")} />
            </div>

            {/* Nome */}
            <div>
              <label className="text-sm text-gray-600">Nome</label>
              <Input placeholder="Seu nome" {...register("displayName")} />
            </div>

            {/* E-mail */}
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-sm text-gray-600">E-mail</label>
                <Input
                  placeholder="Seu e-mail"
                  type="email"
                  {...register("email")}
                />
              </div>

              {/* Modal de troca de e-mail */}
              <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
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
                      value={emailCurrentPassword}
                      onChange={(e) => setEmailCurrentPassword(e.target.value)}
                    />
                    <Input
                      placeholder="Novo e-mail"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsEmailModalOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={() => updateUserEmail(emailCurrentPassword, newEmail)}>Confirmar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Trocar senha */}
            <div className="flex flex-col gap-2">
              {/* Modal de troca de senha */}
              <Dialog
                open={isPasswordModalOpen}
                onOpenChange={setIsPasswordModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" /> Trocar senha
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Trocar senha</DialogTitle>
                    <DialogDescription>
                      Informe sua senha atual e defina uma nova senha.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3 py-3">
    
                    <Input
                      placeholder="Nova senha"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                      placeholder="Confirmar nova senha"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsPasswordModalOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button>Confirmar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Salvar */}
            <Button type="submit" className="w-full">
              Salvar alterações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
