"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./hooks/useCart";
import { ProdutoValidated } from "@/lib/schemas/ProdutoSchema";
import { FinalizarVendaModal } from "@/components/FinalizarVendaModal";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, Package } from "lucide-react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function VendasPage() {
  const { cart, addToCart, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<ProdutoValidated[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const fetchProdutos = async () => {
    try {
      const response = await axios.get("/api/produtos");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleAddToCart = (produto: ProdutoValidated) => {
    const item = cart.find((i) => i.id === produto.id);
    const quantidadeAtual = item ? item.quantidade : 0;
    if (quantidadeAtual >= produto.estoque) {
      alert("Não é possível adicionar mais do que o estoque disponível!");
      return;
    }
    addToCart(produto);
  };

  const finalizarVenda = async (dadosVenda: any) => {
    try {
      // tem certeza que temos um usuario logado para anexar o usuarioId
      if (!user) {
        alert("Você precisa estar logado para finalizar a venda.");
        return;
      }

      const payload = {
        usuarioId: user.uid,
        formaPagamento: dadosVenda?.formaPagamento,
        itens: cart.map((item) => ({
          produtoId: item.id,
          quantidade: item.quantidade,
          precoUnitario: item.preco,
        })),
        valorTotal: total,
      };

      const response = await toast.promise(axios.post("/api/vendas", payload), {
        pending: "Finalizando venda...",
        success: "Venda realizada com sucesso!",
        error: {
          render({ data }) {
            if (axios.isAxiosError(data) && data.response) {
              // tenta mostrar erro da API
              return data.response.data.error || "Erro ao salvar venda.";
            }
            return "Erro ao salvar venda.";
          },
        },
      });

      console.log("Venda salva:", response.data);
      clearCart();
      setOpenModal(false);
      // refresca lista de produtos
      await fetchProdutos();
    } catch (error) {
      console.error("Erro ao salvar venda:", error);
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vendas</h1>

        <div className="flex gap-3">
          <Badge variant="secondary" className="flex items-center gap-2">
            <ShoppingCart size={18} />
            Itens: {cart.length}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Package size={18} />
            Total: R$ {total.toFixed(2)}
          </Badge>
        </div>
      </div>

      {/* Produtos */}
      <Card className="mb-8">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Produtos do estoque</CardTitle>
          <Button variant="outline" size="sm" onClick={clearCart}>
            Limpar Carrinho
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Disponível</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead className="text-center">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.nome}</TableCell>
                  <TableCell>{p.estoque}</TableCell>
                  <TableCell>R$ {p.preco.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Button size="sm" onClick={() => handleAddToCart(p)}>
                      Adicionar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {produtos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhum produto disponível
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Carrinho */}
      <Card>
        <CardHeader>
          <CardTitle>Carrinho</CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <p>Nenhum produto adicionado.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-center">Qtd</TableHead>
                  <TableHead className="text-center">Preço</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell className="text-center">{item.quantidade}</TableCell>
                    <TableCell className="text-center">R$ {item.preco.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      R$ {(item.preco * item.quantidade).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromCart(item.id!)}
                      >
                        Remover
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {cart.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setOpenModal(true)}>Finalizar Venda</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="w-full max-w-md">
            <FinalizarVendaModal
              total={total}
              onConfirm={finalizarVenda}
              onClose={() => setOpenModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
