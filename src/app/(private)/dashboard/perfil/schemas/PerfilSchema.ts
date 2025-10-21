
import z from "zod";
// --- Esquemas de Validação Separados ---

// 1. Esquema para o formulário principal (Nome e Foto)
export const profileUpdateSchema = z.object({
  displayName: z.string().optional(),
  photoURL: z
    .string()
    .url("Informe uma URL válida")
    .optional()
    .or(z.literal("")), // Permite string vazia ou URL válida
});
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

// 2. Esquema para o modal de troca de e-mail
export const emailChangeSchema = z.object({
  emailCurrentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newEmail: z.string().email("Novo e-mail inválido"),
});
export type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

// 3. Esquema para o modal de troca de senha
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(6, "Nova senha deve ter ao menos 6 caracteres"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"], // Aplica o erro ao campo de confirmação
  });
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
