import { z } from "zod";

// Schema Zod para o modelo Produto
export const produtoSchema = z.object({
  id: z.string().optional(), // opcional se for criar novo
  nome: z.string(),
  preco: z.number(),
  estoque: z.number(),
  criadoEm: z.date().optional(), // será gerado automaticamente se não enviado
  atualizadoEm: z.date().optional(),
});

// Tipo TypeScript a partir do schema
export type ProdutoValidated = z.infer<typeof produtoSchema>;
