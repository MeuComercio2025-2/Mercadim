"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ProdutoValidated } from "@/lib/schemas/ProdutoSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Minus, History, RefreshCw, Trash } from "lucide-react";

type FirestoreTS = { seconds: number; nanoseconds: number };

type Movimento = {
  id: string;
  produtoId: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  descricao: string;
  criadoEm: string | Date | FirestoreTS;
};

const LIMIAR_BAIXO_ESTOQUE = 5;

function toDateSafe(v: string | Date | FirestoreTS): Date {
  if (v instanceof Date) return v;
  if (typeof v === "string") {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }
  if (typeof v === "object" && v && "seconds" in v && "nanoseconds" in v) {
    return new Date(
      (v.seconds as number) * 1000 +
      Math.floor((v.nanoseconds as number) / 1e6),
    );
  }
  return new Date();
}

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<ProdutoValidated[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState<ProdutoValidated | null>(null);
  const [movimentos, setMovimentos] = useState<Movimento[]>([]);
  const [abrirModal, setAbrirModal] = useState<null | { tipo: "entrada" | "saida" }>(null);
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
      setProdutos(data.filter((p) => p.ativo !== false));
      if (!selecionado && data.length > 0) setSelecionado(data[0]);
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
      const norm = data.map((m) => ({ ...m, criadoEm: toDateSafe(m.criadoEm) }));
      setMovimentos(norm);
    } catch (e: any) {
      if (e?.response?.status === 404) {
        setMovimentos([]);
        return;
      }
      if (e?.response?.data?.error && /índice/i.test(String(e.response.data.error))) {
        console.warn(e.response.data.error);
        alert(
          "Crie o índice sugerido no console do Firebase (link aparece no terminal do servidor).",
        );
        return;
      }
      console.error("Erro ao carregar movimentos", e);
    }
  };

  useEffect(() => {
    carregarProdutos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selecionado?.id) carregarMovimentos(selecionado.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selecionado?.id]);

  const filtrados = useMemo(() => {
    const term = busca.trim().toLowerCase();
    const base = term
      ? produtos.filter((p) => p.nome.toLowerCase().includes(term))
      : produtos;
    return base.toSorted((a, b) => a.nome.localeCompare(b.nome));
  }, [produtos, busca]);

  const abrirMovimento = (prod: ProdutoValidated, tipo: "entrada" | "saida"): void => {
    setSelecionado(prod);
    setQtd(1);
    setDescricao("");
    setAbrirModal({ tipo });
  };

  const deletarProduto = async (prod: ProdutoValidated): Promise<void> => {
    if (!confirm(`Confirma a exclusão do produto "${prod.nome}"?`)) return;

    try {
      await axios.delete(`/api/produtos/${prod.id}`);
      if (selecionado?.id === prod.id) setSelecionado(null);
      await carregarProdutos();
    } catch (e: any) {
      const msg =
        e?.response?.data?.error || e?.message || "Erro ao excluir produto";
      alert(msg);
    }
  }

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
          (abrirModal.tipo === "entrada" ? "Entrada manual" : "Saída manual"),
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

      <div className="bg-card text-card-foreground rounded-xl border">
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
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
                  const zerado = p.estoque <= 0;
                  const baixo =
                    p.estoque > 0 && p.estoque < LIMIAR_BAIXO_ESTOQUE;

                  return (
                    <tr key={p.id} className="border-t hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{p.nome}</span>
                          {baixo && (
                            <Badge className="bg-orange-500 text-white">
                              baixo estoque
                            </Badge>
                          )}
                          {zerado && (
                            <Badge className="bg-red-600 text-white">
                              zerado
                            </Badge>
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
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deletarProduto(p)}
                          >
                            <Trash className="h-4 w-4 m-auto" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtrados.length === 0 && (
                  <tr>
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
              <div className="text-sm text-muted-foreground">
                Sem movimentos para este produto.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 text-left">Tipo</th>
                      <th className="px-4 py-3 text-left">Descrição</th>
                      <th className="px-4 py-3 text-center">Quantidade</th>
                      <th className="px-4 py-3 text-left">Data</th>
                      <th className="px-4 py-3 text-right">Preço Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimentos.map((m) => {
                      const isVenda =
                        m.tipo === "saida" &&
                        m.descricao?.toLowerCase().includes("venda");

                      const valorTotal =
                        isVenda && selecionado
                          ? selecionado.preco * m.quantidade
                          : null;

                      return (
                        <tr key={m.id} className="border-t hover:bg-muted/50">
                          <td className="px-4 py-3">
                            {m.tipo === "entrada" ? "Entrada" : "Saída"}
                          </td>
                          <td className="px-4 py-3">{m.descricao}</td>
                          <td className="px-4 py-3 text-center">
                            {m.quantidade}
                          </td>
                          <td className="px-4 py-3">
                            {toDateSafe(m.criadoEm).toLocaleString("pt-BR")}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {valorTotal !== null
                              ? `R$ ${valorTotal.toFixed(2)}`
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {abrirModal && selecionado && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
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
                  onChange={(e) =>
                    setQtd(Math.max(1, Number(e.target.value)))
                  }
                />
              </div>
              <div>
                <label className="block text-sm mb-1">
                  Descrição (opcional)
                </label>
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
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
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
                <label className="block text-sm mb-1">
                  Categoria (opcional)
                </label>
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
