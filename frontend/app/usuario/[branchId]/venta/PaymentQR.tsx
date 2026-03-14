"use client";
import { QRCodeSVG } from "qrcode.react";

export default function PaymentQR({ qrString, externalReference }: { qrString?: string; externalReference?: string | null; }) {
    if (!qrString) return null;

    return (
        <div className="card-container p-8 text-center animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500 border-indigo-200 bg-indigo-50/30">
            <div className="inline-block px-4 py-1 bg-white rounded-full shadow-sm border border-indigo-100 mb-6">
                <p className="text-[#009EE3] font-black text-xs uppercase tracking-widest">Mercado Pago Oficial</p>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">Escanee para pagar</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium">Mostrá este código al cliente para procesar el pago.</p>

            <div className="inline-block bg-white p-6 rounded-3xl shadow-xl shadow-indigo-200/50 border-4 border-white mb-8">
                <QRCodeSVG value={qrString} size={220} level="H" includeMargin={false} />
            </div>

            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">Esperando confirmación...</p>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">Referencia: {externalReference}</p>
            </div>
        </div>
    );
}