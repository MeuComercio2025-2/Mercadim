import { z } from "zod";

export const movimentoEstoqueSchema = z.object({
  produtoId: z.string(),
  tipo: z.enum(["entrada", "saida"]),
  quantidade: z.number().int().positive(),
  descricao: z.string(),
  criadoEm: z.date().default(() => new Date()),
});

export type MovimentoEstoqueDTO = z.infer<typeof movimentoEstoqueSchema>;
