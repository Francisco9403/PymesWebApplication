"use client";
import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";

export default function QRScanner({ onScan, loading }: { onScan: (sku: string) => void; loading: boolean; }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [sku, setSku] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    async function startScanner() {
      if (!videoRef.current) return;
      controlsRef.current = await codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result) => {
        if (result) {
          const scannedText = result.getText();
          setSku(scannedText);
          onScan(scannedText);
          stopScanner();
        }
      });
    }
    function stopScanner() {
      controlsRef.current?.stop();
      controlsRef.current = null;
      setScanning(false);
    }
    if (scanning) startScanner();
    return () => controlsRef.current?.stop();
  }, [scanning, onScan]);

  return (
      <div className="card-container p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Escaneo de Artículos</h3>
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </span>
        </div>

        {scanning && (
            <div className="relative overflow-hidden rounded-2xl border-4 border-indigo-100 shadow-inner bg-black aspect-video">
              <video ref={videoRef} className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-indigo-500/50 animate-pulse pointer-events-none" />
            </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setScanning(true)} className="btn-primary py-3 !bg-indigo-600 hover:!bg-indigo-700">
            Activar Cámara
          </button>
          <button onClick={() => setScanning(false)} className="px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
            Detener
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="flex gap-2">
            <input
                type="text"
                placeholder="Escribir SKU manualmente..."
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 font-medium"
            />
            <button
                onClick={() => onScan(sku)}
                disabled={loading || !sku}
                className="btn-primary px-6 whitespace-nowrap"
            >
              {loading ? "..." : "Agregar"}
            </button>
          </div>
        </div>
      </div>
  );
}