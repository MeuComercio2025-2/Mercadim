import { z } from "zod";

export const usuarioSchema = z.object({
  email: z.email(),
  senha: z.string().min(6),
  nomeDeUsuario: z.string().min(3),
  nomeCompleto: z.string().min(3),
  numeroTelefone: z.string().min(8), // validação simples, pode trocar pra regex
  criadoEm: z.date().default(() => new Date()),
  atualizadoEm: z.date().optional(),
});

export type UsuarioDTO = z.infer<typeof usuarioSchema>;
