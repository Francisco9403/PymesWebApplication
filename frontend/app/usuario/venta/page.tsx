"use client";

import { procesarSkuAction } from "@/app/actions/product";
import ProductList from "@/app/usuario/venta/ProductList";
import QRScanner from "@/app/usuario/venta/QRScanner";
import { useState, useTransition } from "react";

export interface Product {
  id: number;
  sku?: string;
  currentSalePrice?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleScan(sku: string) {
    startTransition(async () => {
      const product = await procesarSkuAction(sku);

      if (!product) {
        alert("Producto no encontrado");
        return;
      }

      addToCart(product);
    });
  }

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((p) => p.product.id === product.id);

      if (existing) {
        return prev.map((p) =>
          p.product.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
        );
      }

      return [...prev, { product, quantity: 1 }];
    });
  }

  return (
    <div className="space-y-8">
      <QRScanner onScan={handleScan} loading={isPending} />
      <ProductList cart={cart} />
    </div>
  );
}
