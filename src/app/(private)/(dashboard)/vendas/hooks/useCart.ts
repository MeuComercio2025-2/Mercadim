import { useState } from "react";
import { ProdutoValidated } from "@/lib/schemas/ProdutoSchema";

interface CartItem extends ProdutoValidated {
  quantidade: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (produto: ProdutoValidated) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === produto.id);
      if (existing) {
        return prev.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, { ...produto, quantidade: 1 }];
    });
  };

  const removeFromCart = (produtoId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== produtoId));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    total,
  };
}
