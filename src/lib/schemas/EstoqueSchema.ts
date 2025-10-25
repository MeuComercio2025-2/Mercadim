import { z } from "zod";

export const movimentoEstoqueSchema = z.object({
  produtoId: z.string().min(1, "produtoId obrigatório"),
  tipo: z.enum(["entrada", "saida"]),
  quantidade: z.number().int().min(1, "quantidade deve ser >= 1"),
  descricao: z.string().optional(),
});

export type MovimentoEstoqueInput = z.infer<typeof movimentoEstoqueSchema>;
