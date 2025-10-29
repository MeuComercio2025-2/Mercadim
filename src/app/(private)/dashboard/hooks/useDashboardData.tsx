// hooks/useDashboardData.ts
"use client" // Se o hook for usado APENAS em Client Components, isso não é estritamente necessário, mas bom para clareza.

import { useEffect, useState } from "react"
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval, getDay } from "date-fns"
import { ptBR } from "date-fns/locale"

// --- Tipagem dos dados da sua API ---
interface VendaItem {
  produtoId: string;
  nome: string; 
  quantidade: number;
  valor: number;
}

export interface Venda {
  id: string;
  itens: VendaItem[];
  valorTotal: number;
  criadoEm: string;
}

// --- Tipagem dos dados do gráfico ---
interface ChartData {
  name: string;
  vendas: number;
}

// --- Tipagem dos dados processados para o dashboard ---
export interface DashboardData {
  vendasTotais: number;
  percentualVendas: number;
  itensVendidos: number;
  ticketMedio: number;
  chartData: ChartData[];
  topProdutos: { nome: string; vendidas: number; total: number }[];
}

// --- Dados Iniciais (para o gráfico não quebrar) ---
const INITIAL_CHART_DATA = [
  { name: "Dom", vendas: 0 },
  { name: "Seg", vendas: 0 },
  { name: "Ter", vendas: 0 },
  { name: "Qua", vendas: 0 },
  { name: "Qui", vendas: 0 },
  { name: "Sex", vendas: 0 },
  { name: "Sáb", vendas: 0 },
]

// --- Função de Processamento (Helper) ---
// (Colocada fora do hook para não ser recriada em cada render)
const processVendasData = (vendas: Venda[]): DashboardData => {
  const hoje = new Date()
  const inicioSemana = startOfWeek(hoje, { locale: ptBR })
  const fimSemana = endOfWeek(hoje, { locale: ptBR })
  const inicioSemanaPassada = subDays(inicioSemana, 7)
  const fimSemanaPassada = subDays(fimSemana, 7)

  let vendasTotais = 0
  let itensVendidos = 0
  let vendasSemanaPassada = 0
  const vendasPorDia: number[] = new Array(7).fill(0)
  const produtosMap = new Map<string, { vendidas: number; total: number }>()

  for (const venda of vendas) {
    const dataVenda = new Date(venda.criadoEm)

    if (isWithinInterval(dataVenda, { start: inicioSemana, end: fimSemana })) {
      vendasTotais += venda.valorTotal
      const diaDaSemana = getDay(dataVenda)
      vendasPorDia[diaDaSemana] += venda.valorTotal

      for (const item of venda.itens) {
        itensVendidos += item.quantidade
        const prod = produtosMap.get(item.nome) || { vendidas: 0, total: 0 }
        prod.vendidas += item.quantidade
        prod.total += item.valor * item.quantidade
        produtosMap.set(item.nome, prod)
      }
    }

    if (isWithinInterval(dataVenda, { start: inicioSemanaPassada, end: fimSemanaPassada })) {
      vendasSemanaPassada += venda.valorTotal
    }
  }

  const percentualVendas = vendasSemanaPassada > 0
    ? ((vendasTotais - vendasSemanaPassada) / vendasSemanaPassada) * 100
    : vendasTotais > 0 ? 100 : 0
  
  const chartData = INITIAL_CHART_DATA.map((dia, index) => ({
    ...dia,
    vendas: vendasPorDia[index]
  }))

  const topProdutos = Array.from(produtosMap.entries())
    .map(([nome, dados]) => ({ nome, ...dados }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 3)

  const numVendasSemana = vendas.filter(v => isWithinInterval(new Date(v.criadoEm), { start: inicioSemana, end: fimSemana })).length
  const ticketMedio = vendasTotais > 0 && numVendasSemana > 0 ? vendasTotais / numVendasSemana : 0;

  return {
    vendasTotais,
    percentualVendas,
    itensVendidos,
    ticketMedio,
    chartData,
    topProdutos,
  }
}


// --- O Hook Customizado ---
export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/vendas")
        if (!response.ok) {
          throw new Error("Falha ao buscar dados das vendas")
        }
        const vendas: Venda[] = await response.json()
        
        const processedData = processVendasData(vendas)
        setData(processedData)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) // Roda apenas na montagem do componente

  return { data, loading, error }
}