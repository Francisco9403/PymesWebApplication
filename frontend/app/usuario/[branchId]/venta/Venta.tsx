"use client";

import { crearQrMercadoPago } from "@/app/actions/mercadopago";
import { procesarSku } from "@/app/actions/product";
import { useToast } from "@/layout/ToastProvider";

import { useState, useTransition } from "react";
import PaymentQR from "./PaymentQR";
import { crearVenta } from "@/app/actions/venta";
import { CartItem, Product } from "@/types/Cart";
import { CustomerSelector } from "./CustomerSelector";
import { generateCustomerTag, getCustomerSales } from "@/app/actions/cliente";
import QRScanner from "./QRScanner";
import ProductList from "./ProductList";
import { QrData } from "@/types/QrData";
import { PageResponse } from "@/types/Page";
import { CustomerSaleResponse } from "@/types/Customer";

export default function Venta({ branchId }: { branchId: number }) {
  const { show } = useToast();
  const [qrData, setQrData] = useState<QrData | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleScan(sku: string) {
    startTransition(async () => {
      const result = await procesarSku(sku);

      if (!result || "error" in result) {
        show(
          result?.error || `El producto con SKU "${sku}" no existe`,
          "error",
        );
        return;
      }

      addToCart(result);
      show(`Agregado: ${result.sku}`, "success");
    });
  }

  function addToCart(product: Product) {
    setCart((prev) => {
      const index = prev.findIndex((p) => p.product.id === product.id);

      if (index !== -1) {
        const updated = [...prev];
        updated[index].quantity += 1;
        return updated;
      }

      return [...prev, { product, quantity: 1 }];
    });
  }

  function calculateTotal(cart: CartItem[]) {
    return Number(
      cart
        .reduce(
          (acc, item) =>
            acc + Number(item.product.currentSalePrice ?? 0) * item.quantity,
          0,
        )
        .toFixed(2),
    );
  }

  async function handleCobrar() {
    const total = calculateTotal(cart);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("branchId", String(branchId));
      formData.append("cart", JSON.stringify(cart));
      if (customerId) formData.append("customerId", String(customerId));

      await crearVenta(null, formData);

      let customerSales: PageResponse<CustomerSaleResponse> | null = null;
      if (customerId) {
        try {
          customerSales = await getCustomerSales(customerId);
        } catch (err) {
          show(
            err instanceof Error
              ? err.message
              : "No se pudieron obtener las ventas del cliente",
            "error",
          );
        }

        if (customerSales) {
          const tagsResult = await generateCustomerTag(
            customerId,
            customerSales.content,
          );
          if ("error" in tagsResult) {
            show(tagsResult.error, "error");
          } else {
            show("Etiquetas de cliente actualizadas correctamente", "success");
          }
        }
      }

      const qrResult = await crearQrMercadoPago(total);
      if ("error" in qrResult) {
        show(qrResult.error, "error");
        return;
      }

      setQrData({
        qrString: qrResult.qrString,
        externalReference: qrResult.externalReference!,
      });
    });
  }

  function removeFromCart(productId: number) {
    setCart((prev) =>
      prev.flatMap((item) => {
        if (item.product.id !== productId) return item;

        if (item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }

        return [];
      }),
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

      <PaymentQR
        qrString={qrData?.qrString}
        externalReference={qrData?.externalReference}
      />
    </div>
  );
}
