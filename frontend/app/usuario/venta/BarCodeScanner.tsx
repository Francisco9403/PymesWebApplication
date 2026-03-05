"use client";

import { useEffect, useRef } from "react";

export default function BarCodeScanner({
  onScan,
}: {
  onScan: (sku: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const sku = (e.target as HTMLInputElement).value.trim();

      if (sku) {
        onScan(sku);
      }

      (e.target as HTMLInputElement).value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Escanear o ingresar código</label>

      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        placeholder="Escanear código de barras o escribir SKU"
        className="w-full border rounded-lg p-3 text-lg"
        autoFocus
      />
    </div>
  );
}
