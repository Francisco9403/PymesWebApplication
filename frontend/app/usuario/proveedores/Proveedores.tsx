"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import SupplierDataReview from "./SupplierDataReview";
import SupplierFileUpload from "./SupplierFileUpload";
import {
  analyzeDocumentAction,
  importSupplierDataAction,
} from "@/app/actions/proveedor";
import {
  EditableOCRData,
  EditableProduct,
  RawOCRProduct,
  RawOCRResult,
} from "@/types/OCR";
import { useToast } from "@/layout/ToastProvider";
import { TaxCategory } from "@/types/TaxCategory";

// 🚀 Agregamos el token a las props del componente
export default function Proveedores({
                                      branchId,
                                      token
                                    }: {
  branchId: number;
  token?: string;
}) {
  const [ocrState, analyzeAction, analyzing] = useActionState(
      analyzeDocumentAction,
      null,
  );

  const [importState, importAction, importing] = useActionState(
      importSupplierDataAction,
      null,
  );

  const [data, setData] = useState<EditableOCRData | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);
  const { show } = useToast();

  // 1. Mapeo inicial de lo que sale de la IA
  const derivedData = useMemo<EditableOCRData | null>(() => {
    if (!ocrState?.data) return null;

    const raw = ocrState.data as RawOCRResult;

    return {
      businessName: raw.businessName ?? raw.razonSocial ?? "",
      cuit: raw.cuit ?? "",
      taxCategory: raw.taxCategory ?? TaxCategory.CONSUMIDOR_FINAL,
      products: (raw.products ?? raw.productos ?? []).map(
          (p: RawOCRProduct): EditableProduct => ({
            name: p.name ?? p.descripcion ?? "",
            baseCostPrice: p.baseCostPrice ?? p.precio ?? 0,
            ean13: p.ean13 ?? "",
            quantity: 1,
          }),
      ),
    };
  }, [ocrState]);

  // 2. Lógica de SCRUM-9: Comparativa de costos con el pasado (Autenticada)
  useEffect(() => {
    const fetchLastPrices = async () => {
      // ✅ Verificamos que tengamos derivedData y el token para evitar el 500
      if (derivedData && !data && token) {
        setIsEnriching(true);
        try {
          const productNames = derivedData.products.map(p => p.name);

          const response = await fetch(`${process.env.NEXT_PUBLIC_API}/products/compare-costs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // 🔑 Mandamos el token en el Header
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productNames)
          });

          if (response.ok) {
            const lastPricesMap: Record<string, number> = await response.json();

            // Enriquecemos los productos con su precio anterior de la DB
            const enrichedProducts = derivedData.products.map(p => ({
              ...p,
              lastCostPrice: lastPricesMap[p.name]
            }));

            setData({ ...derivedData, products: enrichedProducts });
          } else {
            // Si la API falla (ej: 404), cargamos los datos del OCR sin comparación
            setData(derivedData);
          }
        } catch (error) {
          console.error("Error enriqueciendo precios:", error);
          setData(derivedData);
        } finally {
          setIsEnriching(false);
        }
      }
    };

    fetchLastPrices();
  }, [derivedData, data, token]); // Re-ejecutar si el token cambia o llega

  useEffect(() => {
    if (ocrState?.error) show(ocrState.error, "error");
    if (importState?.error) show(importState.error, "error");
    if (importState?.success) show(importState.success, "success");
  }, [ocrState, importState, show]);

  const currentData = data;

  return (
      <>
        {currentData ? (
            <SupplierDataReview
                currentData={currentData}
                setData={setData}
                importAction={importAction}
                importing={importing || isEnriching}
                branchId={branchId}
            />
        ) : (
            <SupplierFileUpload
                analyzeAction={analyzeAction}
                analyzing={analyzing}
            />
        )}
      </>
  );
}


