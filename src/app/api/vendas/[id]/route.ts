import { NextResponse } from "next/server";
import { vendaRepository } from "@/repository/VendaRepository";

/**
 * @swagger
 * /api/vendas/{id}:
 *   get:
 *     summary: Recupera uma venda pelo ID
 *     tags: [Vendas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da venda a ser consultada
 *     responses:
 *       200:
 *         description: Venda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "v1"
 *                 usuarioId:
 *                   type: string
 *                   example: "u1"
 *                 itens:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       produtoId:
 *                         type: string
 *                         example: "p1"
 *                       quantidade:
 *                         type: integer
 *                         example: 2
 *                       precoUnitario:
 *                         type: number
 *                         example: 15.5
 *                 valorTotal:
 *                   type: number
 *                   example: 31.0
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-12T10:00:00.000Z"
 *       404:
 *         description: Venda não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Venda não encontrada"
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno"
 */

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const venda = await vendaRepository.findById(id);
  if (!venda)
    return NextResponse.json(
      { error: "Venda não encontrada" },
      { status: 404 }
    );
  return NextResponse.json(venda);
}

/**
 * @swagger
 * /api/vendas/{id}:
 *   delete:
 *     summary: Remove uma venda pelo ID
 *     tags: [Vendas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da venda a ser removida
 *     responses:
 *       200:
 *         description: Venda removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno"
 */
export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  await vendaRepository.delete(id);
  return NextResponse.json({ success: true });
}
