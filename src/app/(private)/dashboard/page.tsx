// app/page.tsx
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, PackageOpen, Package, TrendingUp } from "lucide-react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import { useDashboardData } from "./hooks/useDashboardData" // 1. Importe o hook

export default function Home() {
  // 2. Use o hook para obter o estado
  const { data, error } = useDashboardData() // 'loading' foi removido do hook

  // 3. Renderização condicional (sem loading)
  if (error) {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <h1 className="text-3xl font-bold tracking-tight">Painel do Meu Comércio</h1>
            <p className="text-red-500">Erro ao carregar dados: {error}</p>
        </div>
    )
  }

  if (!data) {
    // Este bloco agora lida com o estado inicial (enquanto data é null)
    // e também com o caso de não haver dados.
    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <h1 className="text-3xl font-bold tracking-tight">Painel do Meu Comércio</h1>
            <p>Nenhum dado encontrado.</p>
        </div>
    )
  }

  // 4. Renderização principal (JSX puro)
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Painel do Meu Comércio
        </h1>
      </div>

      {/* Seção de Resumo Rápido */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card de Vendas Totais da Semana */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas Totais (Semana)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.vendasTotais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className={`text-xs ${data.percentualVendas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.percentualVendas >= 0 ? '+' : ''}{data.percentualVendas.toFixed(1)}% em relação à semana passada
            </p>
          </CardContent>
        </Card>

        {/* Card de Saídas do Estoque */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Itens Vendidos (Semana)
            </CardTitle>
            <PackageOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.itensVendidos} unidades</div>
            <p className="text-xs text-muted-foreground">
              Total de produtos com saída
            </p>
          </CardContent>
        </Card>

        {/* Card de Entradas do Estoque */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Itens Recebidos (Semana)
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* TODO: Lembre-se que este dado ainda é estático */ }
            <div className="text-2xl font-bold">+95 unidades</div>
            <p className="text-xs text-muted-foreground">
              Novos produtos adicionados
            </p>
          </CardContent>
        </Card>

        {/* Card de Ticket Médio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ticket Médio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor médio por venda
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Visão Geral (Gráficos e outras informações) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral de Vendas</CardTitle>
            <CardDescription>
              Vendas desta semana (por dia).
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                />
                <Legend />
                <Bar
                  dataKey="vendas"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Produtos Mais Vendidos */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>
              Os itens que mais geraram lucro nesta semana.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.topProdutos.length > 0 ? (
              data.topProdutos.map((prod, index) => (
                <div key={`${prod.nome ?? 'produto'}-${index}`} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{prod.nome}</p>
                    <p className="text-sm text-muted-foreground">{prod.vendidas} unidades vendidas</p>
                  </div>
                  <div className="ml-auto font-medium">
                    {prod.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma venda registrada na semana.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}