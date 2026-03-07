"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";

export default function QRScanner({
  onScan,
  loading,
}: {
  onScan: (sku: string) => void;
  loading: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const [sku, setSku] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    async function startScanner() {
      if (!videoRef.current) return;

      controlsRef.current = await codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, error) => {
          if (result) {
            const scannedText = result.getText();

            setSku(scannedText);
            onScan(scannedText);

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

    if (scanning) {
      startScanner();
    }

    return () => {
      controlsRef.current?.stop();
    };
  }, [scanning, onScan]);

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
      <h3 className="text-xl font-semibold">Escanear Producto</h3>

      {/* Cámara */}
      {scanning && (
        <video ref={videoRef} className="w-full rounded-lg border" />
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setScanning(true)}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Activar Cámara
        </button>

        <button
          onClick={() => setScanning(false)}
          className="px-4 py-2 border rounded-lg"
        >
          Detener
        </button>
      </div>

      {/* Fallback manual */}
      <input
        type="text"
        placeholder="Ingresar SKU manualmente"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <button
        onClick={() => onScan(sku)}
        disabled={loading || !sku}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Buscando..." : "Agregar Producto"}
      </button>
    </div>
  );
}
