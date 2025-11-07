import { vendaRepository } from "@/repository/VendaRepository";
import { produtoRepository } from "@/repository/ProdutoRepository";
import { estoqueRepository } from "@/repository/EstoqueRepository";
import { vendaSchema } from "@/lib/schemas/VendaSchema";

export class ServiceError extends Error {
  status: number;
  payload?: any;
  constructor(message: string, status = 400, payload?: any) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export async function createVenda(body: unknown) {
  const parsed = vendaSchema.safeParse(body);
  if (!parsed.success) {
    throw new ServiceError("Validation failed", 400, parsed.error.format());
  }

  // validar estoque
  for (const item of parsed.data.itens) {
    const produto = await produtoRepository.findById(item.produtoId);
    if (!produto) {
      throw new ServiceError(`Produto não encontrado: ${item.produtoId}`, 404);
    }
    if ((produto.estoque ?? 0) < item.quantidade) {
      throw new ServiceError(
        `Estoque insuficiente para o produto ${produto.nome}`,
        400
      );
    }
  }

  const venda = await vendaRepository.create({
    ...parsed.data,
    criadoEm: new Date(),
  });

  // criar movimentos de estoque e atualizar produtos
  for (const item of parsed.data.itens) {
    await estoqueRepository.create({
      produtoId: item.produtoId,
      tipo: "saida",
      quantidade: item.quantidade,
      descricao: `venda:${venda.id}`,
      criadoEm: new Date(),
    });

    const produto = await produtoRepository.findById(item.produtoId);
    if (produto) {
      const novoEstoque = (produto.estoque ?? 0) - item.quantidade;
      await produtoRepository.update({
        ...produto,
        id: produto.id,
        estoque: novoEstoque,
        atualizadoEm: new Date(),
      });
    }
  }

  return venda;
}

export default {
  createVenda,
};
