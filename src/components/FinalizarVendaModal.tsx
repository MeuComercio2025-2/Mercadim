"use client";

import { useState } from "react";

interface FinalizarVendaModalProps {
  total: number;
  onConfirm: (dadosVenda: any) => void;
  onClose: () => void;
}

export function FinalizarVendaModal({
  total,
  onConfirm,
  onClose,
}: FinalizarVendaModalProps) {
  const [formaPagamento, setFormaPagamento] = useState("Dinheiro");

  const handleConfirm = () => {
    onConfirm({ formaPagamento });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Finalizar Venda</h2>

        <label className="block mb-2">Forma de Pagamento:</label>
        <select
          className="border p-2 rounded w-full mb-4"
          value={formaPagamento}
          onChange={(e) => setFormaPagamento(e.target.value)}
        >
          <option>Dinheiro</option>
          <option>Cartão</option>
          <option>Pix</option>
        </select>

        <div className="flex justify-between font-semibold mb-4">
          <span>Total:</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-400 text-white px-3 py-1 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded"
            onClick={handleConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
