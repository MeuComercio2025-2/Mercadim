"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ProdutoValidated } from "@/lib/schemas/ProdutoSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Minus, History, RefreshCw } from "lucide-react";

type Movimento = {
  id: string;
  produtoId: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  descricao: string;
  criadoEm: string | Date;
};

const LIMIAR_BAIXO_ESTOQUE = 5;

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<ProdutoValidated[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState<ProdutoValidated | null>(null);
  const [movimentos, setMovimentos] = useState<Movimento[]>([]);
  const [abrirModal, setAbrirModal] = useState<null | { tipo: "entrada" | "saida" }>(
    null,
  );
  const [qtd, setQtd] = useState<number>(1);
  const [descricao, setDescricao] = useState("");

  // Novo produto
  const [abrirNovo, setAbrirNovo] = useState(false);
  const [npNome, setNpNome] = useState("");
  const [npPreco, setNpPreco] = useState<number | "">("");
  const [npEstoque, setNpEstoque] = useState<number | "">("");
  const [npCategoria, setNpCategoria] = useState("");
  const [salvandoNovo, setSalvandoNovo] = useState(false);

  const carregarProdutos = async (): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await axios.get<ProdutoValidated[]>("/api/produtos");
      setProdutos(data);
    } catch (e) {
      console.error("Erro ao carregar produtos", e);
    } finally {
      setLoading(false);
    }
  };

  const carregarMovimentos = async (produtoId: string): Promise<void> => {
    try {
      const { data } = await axios.get<Movimento[]>(
        `/api/estoque?produtoId=${produtoId}&limit=20`,
      );
      setMovimentos(data);
    } catch (e: any) {
      if (e?.response?.status === 404) {
        setMovimentos([]);
        return;
      }
      console.error("Erro ao carregar movimentos", e);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    if (selecionado?.id) carregarMovimentos(selecionado.id);
  }, [selecionado?.id]);

  const filtrados = useMemo(() => {
    const term = busca.trim().toLowerCase();
    const base = term
      ? produtos.filter((p) => p.nome.toLowerCase().includes(term))
      : produtos;
    return base.toSorted((a, b) => a.nome.localeCompare(b.nome));
  }, [produtos, busca]);

  const abrirMovimento = (
    prod: ProdutoValidated,
    tipo: "entrada" | "saida",
  ): void => {
    setSelecionado(prod);
    setQtd(1);
    setDescricao("");
    setAbrirModal({ tipo });
  };

  const registrarMovimento = async (): Promise<void> => {
    if (!selecionado || !abrirModal) return;

    if (abrirModal.tipo === "saida" && qtd > (selecionado.estoque ?? 0)) {
      alert("Quantidade de saída excede o estoque atual.");
      return;
    }

    try {
      await axios.post("/api/estoque", {
        produtoId: selecionado.id,
        tipo: abrirModal.tipo,
        quantidade: qtd,
        descricao:
          descricao ||
          (abrirModal.tipo === "entrada"
            ? "Entrada manual"
            : "Saída manual"),
      });

      await carregarProdutos();
      await carregarMovimentos(selecionado.id!);
      setAbrirModal(null);
    } catch (e: any) {
      const msg =
        e?.response?.data?.error || e?.message || "Erro ao registrar movimento";
      alert(msg);
    }
  };

  const salvarNovoProduto = async (): Promise<void> => {
    if (!npNome.trim()) {
      alert("Informe o nome do produto.");
      return;
    }
    const precoNum = Number(npPreco);
    const estoqueNum = Number(npEstoque);
    if (!Number.isFinite(precoNum) || precoNum < 0) {
      alert("Preço inválido.");
      return;
    }
    if (!Number.isInteger(estoqueNum) || estoqueNum < 0) {
      alert("Estoque inválido (use número inteiro ≥ 0).");
      return;
    }

    try {
      setSalvandoNovo(true);
      await axios.post("/api/produtos", {
        nome: npNome.trim(),
        preco: precoNum,
        estoque: estoqueNum,
        categoriaId: npCategoria.trim() || null,
      });

      setNpNome("");
      setNpPreco("");
      setNpEstoque("");
      setNpCategoria("");
      setAbrirNovo(false);

      await carregarProdutos();
    } catch (e: any) {
      const msg =
        e?.response?.data?.error || e?.message || "Erro ao criar produto";
      alert(msg);
    } finally {
      setSalvandoNovo(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package /> Estoque
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={carregarProdutos}>
            <RefreshCw className="mr-2 h-4 w-4" /> Atualizar
          </Button>
          <Button onClick={() => setAbrirNovo(true)}>+ Novo produto</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de Produtos</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {produtos.length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Baixo estoque (&lt; {LIMIAR_BAIXO_ESTOQUE})</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {produtos.filter((p) => p.estoque < LIMIAR_BAIXO_ESTOQUE).length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Com estoque zerado</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {produtos.filter((p) => p.estoque <= 0).length}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Buscar por nome do produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* ATUALIZADO: Trocado 'bg-white' por 'bg-card text-card-foreground' */}
      <div className="bg-card text-card-foreground rounded-xl border">
        {loading ? (
          // ATUALIZADO: Trocado 'text-gray-500' por 'text-muted-foreground'
          <div className="p-6 text-sm text-muted-foreground">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {/* ATUALIZADO: Trocado 'bg-gray-50 text-gray-600' por 'bg-muted text-muted-foreground' */}
              <thead className="bg-muted text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Produto</th>
                  <th className="px-4 py-3 text-center">Estoque</th>
                  <th className="px-4 py-3 text-right">Preço</th>
                  <th className="px-4 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => {
                  const baixo = p.estoque < LIMIAR_BAIXO_ESTOQUE;
                  return (
                    // ATUALIZADO: Trocado 'hover:bg-gray-50' por 'hover:bg-muted/50'
                    <tr key={p.id} className="border-t hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{p.nome}</span>
                          {baixo && (
                            <Badge variant="destructive">baixo estoque</Badge>
                          )}
                          {/* ATUALIZADO: Adicionado 'variant="secondary"' para um visual mais neutro */}
                          {p.estoque <= 0 && (
                            <Badge variant="secondary">zerado</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">{p.estoque}</td>
                      <td className="px-4 py-3 text-right">
                        R$ {p.preco.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => abrirMovimento(p, "entrada")}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Entrada
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => abrirMovimento(p, "saida")}
                            disabled={p.estoque <= 0}
                            title={p.estoque <= 0 ? "Sem estoque" : ""}
                          >
                            <Minus className="h-4 w-4 mr-1" /> Saída
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelecionado(p)}
                          >
                            <History className="h-4 w-4 mr-1" /> Histórico
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtrados.length === 0 && (
                  <tr>
                    {/* ATUALIZADO: Trocado 'text-gray-500' por 'text-muted-foreground' */}
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-muted-foreground"
                    >
                      Nenhum produto encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selecionado && (
        <Card>
          <CardHeader>
            <CardTitle>Movimentos recentes — {selecionado.nome}</CardTitle>
          </CardHeader>
          <CardContent>
            {movimentos.length === 0 ? (
              // ATUALIZADO: Trocado 'text-gray-500' por 'text-muted-foreground'
              <div className="text-sm text-muted-foreground">
                Sem movimentos para este produto.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  {/* ATUALIZADO: Trocado 'bg-gray-50 text-gray-600' por 'bg-muted text-muted-foreground' */}
                  <thead className="bg-muted text-muted-foreground uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 text-left">Tipo</th>
                      <th className="px-4 py-3 text-left">Descrição</th>
                      <th className="px-4 py-3 text-center">Quantidade</th>
                      <th className="px-4 py-3 text-left">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimentos.map((m) => (
                      // ATUALIZADO: Trocado 'hover:bg-gray-50' por 'hover:bg-muted/50'
                      <tr key={m.id} className="border-t hover:bg-muted/50">
                        <td className="px-4 py-3">
                          {m.tipo === "entrada" ? "Entrada" : "Saída"}
                        </td>
                        <td className="px-4 py-3">{m.descricao}</td>
                        <td className="px-4 py-3 text-center">
                          {m.quantidade}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(m.criadoEm).toLocaleString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {abrirModal && selecionado && (
        // ATUALIZADO: Trocado 'bg-black/30' por 'bg-background/80' (padrão do Dialog do Shadcn)
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          {/* ATUALIZADO: Trocado 'bg-white' por 'bg-card text-card-foreground' */}
          <div className="bg-card text-card-foreground rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {abrirModal.tipo === "entrada"
                ? "Registrar Entrada"
                : "Registrar Saída"}{" "}
              — {selecionado.nome}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Quantidade</label>
                <Input
                  type="number"
                  min={1}
                  value={qtd}
                  onChange={(e) => setQtd(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Descrição (opcional)</label>
                <Input
                  placeholder="Ex.: Ajuste manual, devolução, perda, etc."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setAbrirModal(null)}>
                Cancelar
              </Button>
              <Button onClick={registrarMovimento}>
                {abrirModal.tipo === "entrada"
                  ? "Confirmar Entrada"
                  : "Confirmar Saída"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {abrirNovo && (
        // ATUALIZADO: Trocado 'bg-black/30' por 'bg-background/80'
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          {/* ATUALIZADO: Trocado 'bg-white' por 'bg-card text-card-foreground' */}
          <div className="bg-card text-card-foreground rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Novo produto</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Nome</label>
                <Input
                  placeholder="Ex.: Arroz"
                  value={npNome}
                  onChange={(e) => setNpNome(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Preço (R$)</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={npPreco}
                    onChange={(e) =>
                      setNpPreco(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Estoque</label>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    value={npEstoque}
                    onChange={(e) =>
                      setNpEstoque(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Categoria (opcional)</label>
                <Input
                  placeholder="Ex.: alimentos"
                  value={npCategoria}
                  onChange={(e) => setNpCategoria(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setAbrirNovo(false)}
                disabled={salvandoNovo}
              >
                Cancelar
              </Button>
              <Button onClick={salvarNovoProduto} disabled={salvandoNovo}>
                {salvandoNovo ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}