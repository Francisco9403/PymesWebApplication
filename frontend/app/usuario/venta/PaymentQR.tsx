"use client";

interface Props {
  externalReference: string | null;
}

export default function PaymentQR({ externalReference }: Props) {
  if (!externalReference) return null;

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
      <h3 className="text-lg font-semibold mb-4">Escanee para pagar</h3>

      <p className="text-sm text-gray-500 mb-4">
        Referencia: {externalReference}
      </p>

      <div className="flex justify-center">
        <img src="/qr-placeholder.png" alt="QR Payment" className="w-64 h-64" />
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Esperando confirmación de pago...
      </p>
    </div>
  );
}
