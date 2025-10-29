"use client"

import { useState } from "react"

// 1. Importar os componentes do Shadcn/ui
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface FinalizarVendaModalProps {
  total: number;
  onConfirm: (dadosVenda: { formaPagamento: string }) => void;
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
    // 2. Usar as classes de overlay do Shadcn (z-index e cor de fundo)
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      
      {/* 3. Substituir o container por um <Card> do Shadcn */}
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Finalizar Venda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* 4. Substituir <label> e <select> pelos componentes <Label> e <Select> */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="forma-pagamento">Forma de Pagamento:</Label>
            <Select 
              value={formaPagamento} 
              onValueChange={setFormaPagamento} // O <Select> usa onValueChange
            >
              <SelectTrigger id="forma-pagamento">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="Cartão">Cartão</SelectItem>
                <SelectItem value="Pix">Pix</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            {/* Bônus: formatando o total como moeda */}
            <span>
              {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>

        </CardContent>
        <CardFooter className="flex justify-end gap-2">

          {/* 5. Substituir <button> por <Button> com variantes do tema */}
          <Button
            variant="outline" // Variante "outline" para cancelar
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm} // Variante padrão ("primary") para confirmar
          >
            Confirmar
          </Button>
          
        </CardFooter>
      </Card>
    </div>
  );
}