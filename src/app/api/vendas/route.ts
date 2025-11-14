import { NextResponse } from "next/server";
import { createVenda, ServiceError } from "@/services/vendaService";
import { vendaRepository } from "@/repository/VendaRepository";

/**
 * @swagger
 * tags:
 *   name: Vendas
 *   description: Operações relacionadas a vendas
 */

/**
 * @swagger
 * /api/vendas:
 *   get:
 *     summary: Lista todas as vendas
 *     tags: [Vendas]
 *     description: Recupera a lista de vendas registradas.
 *     responses:
 *       200:
 *         description: Lista de vendas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "v1"
 *                   usuarioId:
 *                     type: string
 *                     example: "u1"
 *                   formaPagamento:
 *                     type: string
 *                     example: "Dinheiro"
 *                   itens:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         produtoId:
 *                           type: string
 *                           example: "p1"
 *                         quantidade:
 *                           type: integer
 *                           example: 2
 *                         precoUnitario:
 *                           type: number
 *                           example: 15.5
 *                   valorTotal:
 *                     type: number
 *                     example: 31.0
 *                   criadoEm:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-11-12T10:00:00.000Z"
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
export async function GET() {
  const vendas = await vendaRepository.find();
  return NextResponse.json(vendas);
}

/**
 * @swagger
 * /api/vendas:
 *   post:
 *     summary: Cria uma nova venda
 *     tags: [Vendas]
 *     description: Salva uma venda com itens e registra movimentos de estoque.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioId
 *               - itens
 *               - valorTotal
 *             properties:
 *               usuarioId:
 *                 type: string
 *                 example: "u1"
 *               formaPagamento:
 *                 type: string
 *                 enum: [Dinheiro, Cartão, Pix]
 *                 example: "Pix"
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produtoId:
 *                       type: string
 *                       example: "p1"
 *                     quantidade:
 *                       type: integer
 *                       example: 2
 *                     precoUnitario:
 *                       type: number
 *                       example: 15.5
 *               valorTotal:
 *                 type: number
 *                 example: 31.0
 *     responses:
 *       201:
 *         description: Venda criada com sucesso
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
 *                 message:
 *                   type: string
 *                   example: "Venda criada"
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
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
export async function POST(req: Request) {
  const body = await req.json();
  try {
    const venda = await createVenda(body);
    return NextResponse.json(venda, { status: 201 });
  } catch (err: any) {
    if (err instanceof ServiceError) {
      // inclui payload se tiver erros de validacao
      if (err.payload) {
        return NextResponse.json(
          { errors: err.payload },
          { status: err.status }
        );
      }
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Unexpected error creating venda:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
