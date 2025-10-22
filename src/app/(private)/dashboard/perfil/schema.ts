import * as z from "zod";

export const profileSchema = z
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

export type ProfileFormData = z.infer<typeof profileSchema>;
