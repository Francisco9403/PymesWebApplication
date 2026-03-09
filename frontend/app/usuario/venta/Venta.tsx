"use client";

import { crearQrMercadoPago } from "@/app/actions/mercadopago";
import { procesarSkuAction } from "@/app/actions/product"; // <-- Importamos la validación
import ProductList from "@/app/usuario/venta/ProductList";
import QRScanner from "@/app/usuario/venta/QRScanner";
import { useToast } from "@/layout/ToastProvider"; // <-- Para avisar si no existe

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
  const { show } = useToast();
  const [qrData, setQrData] = useState<{ string: string; ref: string } | null>(
    null,
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPending, startTransition] = useTransition();

  // Función corregida y validada
  function handleScan(sku: string) {
    startTransition(async () => {
      // 1. Buscamos el producto real en el backend de Spring Boot
      const productFound = await procesarSkuAction(sku);

      if (!productFound) {
        // 2. Si el API devuelve null, avisamos al cajero
        show(`El producto con SKU "${sku}" no existe en el sistema`, "error");
        return;
      }

      // 3. Si existe, lo agregamos con sus datos reales (ID y Precio real)
      addToCart(productFound);
      show(`Agregado: ${productFound.sku}`, "success");
    });
  }

  function addToCart(product: Product) {
    setCart((prev) => {
      // Buscamos por el ID real de la base de datos
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
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
