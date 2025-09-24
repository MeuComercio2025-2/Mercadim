import { z } from "zod";

export const categoriaSchema = z.object({
  nome: z.string().min(2),
  descricao: z.string().optional(),
  criadoEm: z.date().default(() => new Date()),
});

export type CategoriaDTO = z.infer<typeof categoriaSchema>;
