"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { Cart } from "../types/types";

type CartContextType = {
  cart: Cart;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");

      return storedCart ? JSON.parse(storedCart) : {};
    }

    return {};
  });

  const contextValue = useMemo(() => ({ cart, setCart }), [cart]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
