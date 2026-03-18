"use client";

import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";

export default function QRScanner({
  onScan,
  loading,
}: {
  onScan: (sku: string, quantity: number) => void;
  loading: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    async function startScanner() {
      if (!videoRef.current) return;
      controlsRef.current = await codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result) => {
          if (result) {
            const scannedText = result.getText();
            setSku(scannedText);
            onScan(scannedText, quantity);
            stopScanner();
          }
        },
      );
    }
    function stopScanner() {
      controlsRef.current?.stop();
      controlsRef.current = null;
      setScanning(false);
    }
    if (scanning) startScanner();
    return () => controlsRef.current?.stop();
  }, [scanning, quantity, onScan]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && sku) {
      onScan(sku, quantity);
      setSku("");
      setQuantity(1);
    }
  };

  return (
    <div
      className="p-6 rounded-xl flex flex-col gap-5 transition-colors
        bg-white border border-slate-200
        dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
    >
      <div className="flex items-center justify-between">
        <h3
          className="text-lg font-extrabold tracking-[-0.01em]
          text-slate-800 dark:text-[#F0EDE8]"
        >
          Escaneo de Artículos
        </h3>
        <div
          className="p-2 rounded-lg
            bg-[rgba(255,107,53,0.08)] text-[#FF6B35]"
          style={{ border: "1px solid rgba(255,107,53,0.2)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
            />
          </svg>
        </div>
      </div>

      {scanning && (
        <div
          className="relative overflow-hidden rounded-xl aspect-video bg-black"
          style={{ border: "2px solid rgba(255,107,53,0.3)" }}
        >
          <video ref={videoRef} className="w-full h-full object-cover" />
          <div
            className="absolute inset-x-0 h-0.5 top-1/2 -translate-y-1/2 animate-pulse pointer-events-none opacity-70"
            style={{
              background:
                "linear-gradient(90deg, transparent, #FF6B35, transparent)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              border: "2px solid rgba(255,107,53,0.3)",
              borderRadius: "inherit",
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setScanning(true)}
          className="inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm
            border-0 cursor-pointer transition-[transform,box-shadow,background-color] duration-150
            bg-[#FF6B35] text-white
            hover:bg-[#FF8555] hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(255,107,53,0.3)]"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Activar Cámara
        </button>
        <button
          onClick={() => setScanning(false)}
          className="inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all
            border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95
            dark:border-[rgba(255,255,255,0.08)] dark:text-[#666] dark:hover:bg-[rgba(255,255,255,0.05)] dark:hover:border-[rgba(255,255,255,0.15)]"
        >
          Detener
        </button>
      </div>

      <div
        className="flex gap-2 pt-4
          border-t border-slate-100 dark:border-[rgba(255,255,255,0.06)]"
      >
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="px-4 py-3 rounded-xl text-sm outline-none transition-all border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#444] dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)] dark:focus:bg-[rgba(255,255,255,0.06)] w-24 text-center font-bold"
        />

        <input
          type="text"
          placeholder="Escribir SKU manualmente..."
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          onKeyDown={handleKeyDown}
          className="px-4 py-3 rounded-xl text-sm outline-none transition-all border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#444] dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)] dark:focus:bg-[rgba(255,255,255,0.06)] flex-1 font-bold"
        />

        <button
          onClick={() => {
            onScan(sku, quantity);
            setSku("");
            setQuantity(1);
          }}
          disabled={loading || !sku}
          className="px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap
            border-0 cursor-pointer transition-[transform,box-shadow,background-color] duration-150
            bg-[#FF6B35] text-white
            hover:bg-[#FF8555] hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(255,107,53,0.3)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {loading ? (
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          ) : (
            "Agregar"
          )}
        </button>
      </div>
    </div>
  );
}
