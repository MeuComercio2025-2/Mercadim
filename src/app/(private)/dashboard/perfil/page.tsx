"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { profileSchema, ProfileFormData } from "./schema";
import EmailChangeDialog from "./components/EmailChangeDialog";
import PasswordChangeDialog from "./components/PasswordChangeDialog";

export default function PerfilPage() {
  const { user, updateUser, updateUserEmail, updateUserPassword } = useAuth();

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
    },
  });

  const photoWatch = watch("photoURL");

  useEffect(() => {
    if (user) {
      setValue("displayName", user.displayName || "");
      setValue("email", user.email || "");
      setValue("photoURL", user.photoURL || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    await updateUser(data);
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
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-5"
          >
            {/* Foto */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border">
                <img
                  src={photoWatch || "/placeholder-user.png"}
                  alt="Foto do usuário"
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
                <Input disabled type="email" {...register("email")} />
              </div>
              <EmailChangeDialog onConfirm={updateUserEmail} />
            </div>

            {/* Senha */}
            <PasswordChangeDialog onConfirm={updateUserPassword} />

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
