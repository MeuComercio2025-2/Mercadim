import { z } from "zod";

export const itemVendaSchema = z.object({
  produtoId: z.string(),
  quantidade: z.number().int().positive(),
  precoUnitario: z.number().positive(),
});

export const vendaSchema = z.object({
  usuarioId: z.string(),
  itens: z.array(itemVendaSchema).min(1),
  valorTotal: z.number().positive(),
  criadoEm: z.date().default(() => new Date()),
});

export type VendaDTO = z.infer<typeof vendaSchema>;
export type ItemVendaDTO = z.infer<typeof itemVendaSchema>;
