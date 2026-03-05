"use client";

import { crearQrMercadoPago } from "@/app/actions/payment";
import ProductList from "@/app/usuario/venta/ProductList";
import QRScanner from "@/app/usuario/venta/QRScanner";

import { useState, useTransition } from "react";
import PaymentQR from "./PaymentQR";

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

  const [externalReference, setExternalReference] = useState<string | null>(
    null,
  );

  function handleScan(sku: string) {
    startTransition(async () => {
      const product: Product = {
        id: Date.now(),
        sku,
        currentSalePrice: "100",
      };

      if (!product) return;

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

  async function handleCobrar() {
    const total = cart.reduce(
      (acc, item) =>
        acc + Number(item.product.currentSalePrice ?? 0) * item.quantity,
      0,
    );

    startTransition(async () => {
      const reference = await crearQrMercadoPago(total);
      setExternalReference(reference);
    });
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <QRScanner onScan={handleScan} loading={isPending} />

      <ProductList cart={cart} />

      {cart.length > 0 && (
        <button
          onClick={handleCobrar}
          disabled={isPending}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
        >
          {isPending ? "Generando QR..." : "Cobrar con QR"}
        </button>
      )}

      <PaymentQR externalReference={externalReference} />
    </div>
  );
}
