// hooks/useDashboardData.ts
"use client";

import { useEffect, useState } from "react";
import {
  subDays,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  getDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";

// --- Tipos conforme APIs reais ---
interface VendaItem {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Venda {
  id: string;
  usuarioId: string;
  formaPagamento: string;
  itens: VendaItem[];
  valorTotal: number;
  criadoEm: string;
}

export interface EstoqueMovimentacao {
  id: string;
  produtoId: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  descricao: string;
  criadoEm: string;
}

export interface ProdutoInfo {
  id: string;
  nome: string;
  preco: number;
  categoriaId: string;
  estoque: number;
  criadoEm: string;
  atualizadoEm: string;

  // ✅ ADICIONADO
  ativo: boolean;
}

// --- Tipagem dos dados do gráfico ---
interface ChartData {
  name: string;
  vendas: number;
}

// --- Tipagem final do Dashboard ---
export interface DashboardData {
  vendasTotais: number;
  percentualVendas: number;
  itensVendidos: number;
  ticketMedio: number;
  chartData: ChartData[];
  topProdutos: {
    produtoId: string;
    vendidas: number;
    total: number;
    detalhes: ProdutoInfo | null;
  }[];

  entradasTotais: number;
  saidasTotais: number;
  saldoEstoqueSemanal: number;

  movimentacaoProdutos: {
    produtoId: string;
    entradas: number;
    saidas: number;
  }[];

  itensRecebidosSemana: EstoqueMovimentacao[];
  itensSaidaSemana: EstoqueMovimentacao[];
}

const INITIAL_CHART_DATA = [
  { name: "Dom", vendas: 0 },
  { name: "Seg", vendas: 0 },
  { name: "Ter", vendas: 0 },
  { name: "Qua", vendas: 0 },
  { name: "Qui", vendas: 0 },
  { name: "Sex", vendas: 0 },
  { name: "Sáb", vendas: 0 },
];

// --- Processamento principal ----
const processDashboardData = (
  vendas: Venda[],
  estoque: EstoqueMovimentacao[]
) => {
  const hoje = new Date();
  const inicioSemana = startOfWeek(hoje, { locale: ptBR });
  const fimSemana = endOfWeek(hoje, { locale: ptBR });

  const inicioSemanaPassada = subDays(inicioSemana, 7);
  const fimSemanaPassada = subDays(fimSemana, 7);

  // --- DADOS VENDAS ---
  let vendasTotais = 0;
  let itensVendidos = 0;
  let vendasSemanaPassada = 0;
  const vendasPorDia = new Array(7).fill(0);

  const produtosMap = new Map<string, { vendidas: number; total: number }>();

  for (const venda of vendas) {
    const dataVenda = new Date(venda.criadoEm);
    const naSemanaAtual = isWithinInterval(dataVenda, {
      start: inicioSemana,
      end: fimSemana,
    });

    const naSemanaPassada = isWithinInterval(dataVenda, {
      start: inicioSemanaPassada,
      end: fimSemanaPassada,
    });

    if (naSemanaAtual) {
      vendasTotais += venda.valorTotal;

      const dia = getDay(dataVenda);
      vendasPorDia[dia] += venda.valorTotal;

      for (const item of venda.itens) {
        itensVendidos += item.quantidade;

        const produto = produtosMap.get(item.produtoId) || {
          vendidas: 0,
          total: 0,
        };

        produto.vendidas += item.quantidade;
        produto.total += item.precoUnitario * item.quantidade;

        produtosMap.set(item.produtoId, produto);
      }
    }

    if (naSemanaPassada) vendasSemanaPassada += venda.valorTotal;
  }

  const percentualVendas =
    vendasSemanaPassada > 0
      ? ((vendasTotais - vendasSemanaPassada) / vendasSemanaPassada) * 100
      : vendasTotais > 0
      ? 100
      : 0;

  const chartData = INITIAL_CHART_DATA.map((dia, index) => ({
    ...dia,
    vendas: vendasPorDia[index],
  }));

  const topProdutos = Array.from(produtosMap.entries())
    .map(([produtoId, dados]) => ({ produtoId, ...dados }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  const numVendasSemana = vendas.filter((v) =>
    isWithinInterval(new Date(v.criadoEm), {
      start: inicioSemana,
      end: fimSemana,
    })
  ).length;

  const ticketMedio = numVendasSemana > 0 ? vendasTotais / numVendasSemana : 0;

  // --- ESTOQUE ---
  let entradasTotais = 0;
  let saidasTotais = 0;

  const movMap = new Map<string, { entradas: number; saidas: number }>();
  const itensRecebidosSemana: EstoqueMovimentacao[] = [];
  const itensSaidaSemana: EstoqueMovimentacao[] = [];

  for (const mov of estoque) {
    const dataMov = new Date(mov.criadoEm);

    const naSemanaAtual = isWithinInterval(dataMov, {
      start: inicioSemana,
      end: fimSemana,
    });

    if (!naSemanaAtual) continue;

    const registro = movMap.get(mov.produtoId) || {
      entradas: 0,
      saidas: 0,
    };

    if (mov.tipo === "entrada") {
      registro.entradas += mov.quantidade;
      entradasTotais += mov.quantidade;
      itensRecebidosSemana.push(mov);
    } else {
      registro.saidas += mov.quantidade;
      saidasTotais += mov.quantidade;
      itensSaidaSemana.push(mov);
    }

    movMap.set(mov.produtoId, registro);
  }

  const movimentacaoProdutos = Array.from(movMap.entries()).map(
    ([produtoId, dados]) => ({
      produtoId,
      ...dados,
    })
  );

  const saldoEstoqueSemanal = entradasTotais - saidasTotais;

  return {
    vendasTotais,
    percentualVendas,
    itensVendidos,
    ticketMedio,
    chartData,
    topProdutos,

    entradasTotais,
    saidasTotais,
    saldoEstoqueSemanal,
    movimentacaoProdutos,

    itensRecebidosSemana,
    itensSaidaSemana,
  };
};

// --- Hook ---
export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [resVendas, resEstoque] = await Promise.all([
          fetch("/api/vendas"),
          fetch("/api/estoque"),
        ]);

        if (!resVendas.ok) throw new Error("Erro ao buscar vendas");
        if (!resEstoque.ok) throw new Error("Erro ao buscar estoque");

        const vendas: Venda[] = await resVendas.json();
        const estoque: EstoqueMovimentacao[] = await resEstoque.json();

        const base = processDashboardData(vendas, estoque);

        // ------------------------------------------------------
        // ENRIQUECER TOP PRODUTOS
        // ------------------------------------------------------
        const topDetalhado = await Promise.all(
          base.topProdutos.map(async (item) => {
            try {
              const res = await fetch(`/api/produtos/${item.produtoId}`);
              if (!res.ok) return { ...item, detalhes: null };

              const produto: ProdutoInfo = await res.json();
              return { ...item, detalhes: produto };
            } catch {
              return { ...item, detalhes: null };
            }
          })
        );

        // 🔥 FILTRAR PRODUTOS NÃO ATIVOS
        const topAtivos = topDetalhado.filter((p) => p.detalhes?.ativo);

        setData({
          ...base,
          topProdutos: topAtivos,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
