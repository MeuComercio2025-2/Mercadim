"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./hooks/useCart";
import { ProdutoValidated } from "@/lib/schemas/ProdutoSchema";
import { FinalizarVendaModal } from "@/components/FinalizarVendaModal";
import { ShoppingCart, Package } from "lucide-react";

export default function VendasPage() {
  const { cart, addToCart, removeFromCart, clearCart, total } = useCart();
  const [produtos, setProdutos] = useState<ProdutoValidated[]>([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get("/api/produtos");
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProdutos();
  }, []);

  // Impedir adicionar mais do que o estoque
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
      const response = await axios.post("/api/vendas", {
        ...dadosVenda,
        itens: cart.map((item) => ({
          produto: item,
          quantidade: item.quantidade,
          subtotal: item.quantidade * item.preco,
        })),
        total,
      });
      console.log("Venda salva:", response.data);
      clearCart();
      setOpenModal(false);
    } catch (error) {
      console.error("Erro ao salvar venda:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>

        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
            <ShoppingCart size={18} className="text-blue-700" />
            <span className="font-semibold text-blue-800">
              Itens: {cart.length}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200">
            <Package size={18} className="text-green-700" />
            <span className="font-semibold text-green-800">
              Total: R$ {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Produtos disponíveis */}
      <div className="bg-white shadow rounded-2xl p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Produtos do estoque
          </h2>
          <button
            onClick={clearCart}
            className="text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
          >
            Limpar Carrinho
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Disponível</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3 text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{p.nome}</td>
                  <td className="px-4 py-3">{p.estoque}</td>
                  <td className="px-4 py-3">R$ {p.preco.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded transition-all"
                    >
                      Adicionar
                    </button>
                  </td>
                </tr>
              ))}
              {produtos.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    Nenhum produto disponível
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Carrinho */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Carrinho</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500">Nenhum produto adicionado.</p>
        ) : (
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3 text-center">Qtd</th>
                <th className="px-4 py-3 text-center">Preço</th>
                <th className="px-4 py-3 text-center">Total</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{item.nome}</td>
                  <td className="px-4 py-3 text-center">{item.quantidade}</td>
                  <td className="px-4 py-3 text-center">
                    R$ {item.preco.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => removeFromCart(item.id!)}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {cart.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm transition-all"
            >
              Finalizar Venda
            </button>
          </div>
        )}
      </div>

      {/* Modal de Finalização */}
      {openModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
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
