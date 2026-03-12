"use client";

import { crearQrMercadoPago } from "@/app/actions/mercadopago";
import { procesarSkuAction } from "@/app/actions/product";
import ProductList from "@/app/usuario/venta/ProductList";
import QRScanner from "@/app/usuario/venta/QRScanner";
import { useToast } from "@/layout/ToastProvider";

import { useState, useTransition } from "react";
import PaymentQR from "./PaymentQR";
import { crearVenta } from "@/app/actions/venta";
import { CartItem, Product } from "@/types/Cart";
import { CustomerSelector } from "./CustomerSelector";
import { generateCustomerTag, getCustomerSales } from "@/app/actions/cliente";

export default function Venta({ branchId }: { branchId: number }) {
  const { show } = useToast();
  const [qrData, setQrData] = useState<{ string: string; ref: string } | null>(
    null,
  );
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleScan(sku: string) {
    startTransition(async () => {
      const productFound = await procesarSkuAction(sku);

      if (!productFound) {
        show(`El producto con SKU "${sku}" no existe en el sistema`, "error");
        return;
      }

      addToCart(productFound);
      show(`Agregado: ${productFound.sku}`, "success");
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
    const totalRaw = cart.reduce(
      (acc, item) =>
        acc + Number(item.product.currentSalePrice ?? 0) * item.quantity,
      0,
    );

    const total = Number(totalRaw.toFixed(2));

    startTransition(async () => {
      const formData = new FormData();

      formData.append("branchId", String(branchId));
      formData.append("cart", JSON.stringify(cart));

      if (customerId) formData.append("customerId", String(customerId));

      await crearVenta(null, formData);

      if (customerId) {
        const customerSales = await getCustomerSales(customerId);
        await generateCustomerTag(customerId, customerSales.content);
      }

      const result = await crearQrMercadoPago(total);

      setQrData({
        string: result.qrString,
        ref: result.externalReference!,
      });
    });
  }

  function removeFromCart(productId: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      <QRScanner onScan={handleScan} loading={isPending} />

      <CustomerSelector
        customerId={customerId}
        customerName={customerName}
        setCustomerId={setCustomerId}
        setCustomerName={setCustomerName}
      />

      <div className="grid grid-cols-1 gap-6">
        <ProductList cart={cart} removeFromCart={removeFromCart} />

        {cart.length > 0 && !qrData && (
          <button
            onClick={handleCobrar}
            disabled={isPending}
            className="btn-primary bg-emerald-600! hover:bg-emerald-700! py-6 text-xl shadow-xl shadow-emerald-200/50 flex items-center justify-center gap-3"
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
