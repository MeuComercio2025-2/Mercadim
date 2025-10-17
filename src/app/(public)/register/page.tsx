"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";

// Esquema de validação
const schema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function Register() {
  const [step, setStep] = useState(1);
  const { signUp } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });



  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    signUp(data.email, data.password, data.name);
  };

  const watchedData = watch(); // Para mostrar na etapa de revisão

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl">🛒</div>
            <CardTitle className="text-center">Primeiro Acesso</CardTitle>
            <p className="text-gray-500 text-sm text-center">
              É necessário criar a conta de administrador, pois este é o
              primeiro acesso.
            </p>

            <p className="text-gray-500 text-sm">Etapa {step} de 3</p>
            <Progress value={(step / 3) * 100} className="w-full mt-2" />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Etapa 1 */}
            {step === 1 && (
              <>
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Etapa 2 */}
            {step === 2 && (
              <>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="********"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Etapa 3 */}
            {step === 3 && (
              <div className="space-y-2">
                <p className="text-gray-700 text-sm">Revise seus dados:</p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p>
                    <strong>Nome:</strong> {watchedData.name}
                  </p>
                  <p>
                    <strong>E-mail:</strong> {watchedData.email}
                  </p>
                </div>
              </div>
            )}

            {/* Navegação */}
            <div className="flex justify-between">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Voltar
                </Button>
              )}

              {step < 3 && (
                <Button type="button" className="ml-auto" onClick={nextStep}>
                  Próximo
                </Button>
              )}

              {step === 3 && (
                <Button type="submit" className="ml-auto">
                  Finalizar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
