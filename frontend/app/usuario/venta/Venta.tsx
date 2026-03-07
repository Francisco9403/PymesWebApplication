"use client";

import { crearQrMercadoPago } from "@/app/actions/mercadopago";
import ProductList from "@/app/usuario/venta/ProductList";
import QRScanner from "@/app/usuario/venta/QRScanner";

import { useState, useTransition } from "react";
import PaymentQR from "./PaymentQR";

interface Product {
  id: number;
  sku?: string;
  currentSalePrice?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Venta() {
  const [qrData, setQrData] = useState<{ string: string; ref: string } | null>(
    null,
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPending, startTransition] = useTransition();

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
      const result = await crearQrMercadoPago(total);
      setQrData({ string: result.qrString, ref: result.externalReference });
    });
  }

  return (
      <div className="flex flex-col gap-6 pb-20">
        <QRScanner onScan={handleScan} loading={isPending} />

        <div className="grid grid-cols-1 gap-6">
          <ProductList cart={cart} />

          {cart.length > 0 && !qrData && (
              <button
                  onClick={handleCobrar}
                  disabled={isPending}
                  className="btn-primary !bg-emerald-600 hover:!bg-emerald-700 py-6 text-xl shadow-xl shadow-emerald-200/50 flex items-center justify-center gap-3"
              >
                {isPending ? (
                    <span className="animate-pulse">Generando Orden...</span>
                ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      Finalizar y Cobrar
                    </>
                )}
              </button>
          )}
        </div>

        <PaymentQR qrString={qrData?.string} externalReference={qrData?.ref} />
      </div>
  );
}