"use client";

import { createBindQR } from "@/app/actions/payment";
import { useToast } from "@/layout/ToastProvider";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export default function PaymentQR({ amount }: { amount: number }) {
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { show } = useToast();

  useEffect(() => {
    if (amount <= 0) return;

    let cancelled = false;

    async function generateQR() {
      setLoading(true);

      const result = await createBindQR(amount);

      if (cancelled) return;

      setLoading(false);

      if (!result.success) {
        show(result.message, "error");
        return;
      }

      setCheckoutUrl(result.checkoutUrl);
    }

    generateQR();

    return () => {
      cancelled = true;
    };
  }, [amount, show]);

  if (amount <= 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm text-center space-y-4">
      <h3 className="text-xl font-semibold">Pagar con QR</h3>

      {loading && <p>Generando QR...</p>}

      {!loading && checkoutUrl && <QRCodeSVG value={checkoutUrl} size={220} />}

      <div className="text-2xl font-bold">${amount.toFixed(2)}</div>

      <p className="text-sm text-gray-500">
        Escanee con su billetera para pagar
      </p>
    </div>
  );
}
