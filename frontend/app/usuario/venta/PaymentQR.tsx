"use client";

import { QRCodeSVG } from "qrcode.react";

export default function PaymentQR({
  qrString,
  externalReference,
}: {
  qrString?: string;
  externalReference?: string | null;
}) {
  if (!qrString) return null;

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm text-center animate-in fade-in zoom-in duration-300">
      <h3 className="text-lg font-semibold mb-2">Escanee para pagar</h3>
      <p className="text-blue-600 font-medium mb-4">Mercado Pago</p>

      <div className="flex justify-center bg-white p-4 rounded-lg border">
        <QRCodeSVG value={qrString} size={256} level="H" includeMargin={true} />
      </div>

      <p className="text-xs text-gray-500 mt-4 italic">
        Ref: {externalReference}
      </p>

      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <p className="text-sm font-medium text-gray-600">
          Esperando confirmación...
        </p>
      </div>
    </div>
  );
}
