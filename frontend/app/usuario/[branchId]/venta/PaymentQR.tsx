"use client";
import { QRCodeSVG } from "qrcode.react";

export default function PaymentQR({ qrString, externalReference }: { qrString?: string; externalReference?: string | null; }) {
    if (!qrString) return null;

    return (
        <div
      className="relative overflow-hidden p-8 rounded-xl text-center transition-colors
        border border-[rgba(0,201,167,0.2)] bg-[rgba(0,201,167,0.04)]
        dark:border-[rgba(0,201,167,0.2)] dark:bg-[rgba(0,201,167,0.05)]"
    >
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-[24px] h-[24px] border-t-2 border-l-2 border-[#00C9A7] opacity-50" />
      <div className="absolute bottom-0 right-0 w-[24px] h-[24px] border-b-2 border-r-2 border-[#00C9A7] opacity-50" />
 
      {/* QR interoperable badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-6
        bg-white border border-[rgba(0,201,167,0.2)] shadow-sm
        dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(0,201,167,0.2)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#009EE3]" />
        <p className="text-[#009EE3] font-bold text-[10px] uppercase tracking-widest">QR interoperable</p>
      </div>
 
      <h3 className="text-2xl font-extrabold tracking-[-0.02em] mb-1.5
        text-slate-900 dark:text-[#F0EDE8]">
        Escanee para pagar
      </h3>
      <p className="text-sm mb-8 text-slate-500 dark:text-[#666]">
        Mostrá este código al cliente para procesar el pago.
      </p>
 
      {/* QR code */}
      <div
        className="inline-block p-5 rounded-2xl mb-8 shadow-xl
          bg-white border-4 border-white
          dark:bg-[#F0EDE8]"
        style={{ boxShadow: "0 20px 60px rgba(0,201,167,0.2)" }}
      >
        <QRCodeSVG value={qrString} size={220} level="H" includeMargin={false} />
      </div>
 
      {/* Status */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl
            bg-white border border-slate-200
            dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.08)]"
        >
          <div className="w-2 h-2 rounded-full bg-[#00C9A7] animate-ping" />
          <p className="text-xs font-bold uppercase tracking-tight
            text-slate-600 dark:text-[#AAA]">
            Esperando confirmación...
          </p>
        </div>
        <p className="text-[10px] font-mono text-slate-400 dark:text-[#444]">
          Referencia: {externalReference}
        </p>
      </div>
    </div>
    );
}