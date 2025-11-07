import { z } from "zod";

export const itemVendaSchema = z.object({
  produtoId: z.string(),
  quantidade: z.number().int().positive(),
  precoUnitario: z.number().positive(),
});

export const vendaSchema = z.object({
  usuarioId: z.string(),
  formaPagamento: z.enum(["Dinheiro", "Cartão", "Pix"]).optional(), // pra guardar forma de pagamento
  itens: z.array(itemVendaSchema).min(1),
  valorTotal: z.number().positive(),
  criadoEm: z.date().default(() => new Date()).optional(),
});

export type VendaDTO = z.infer<typeof vendaSchema>;
export type ItemVendaDTO = z.infer<typeof itemVendaSchema>;
