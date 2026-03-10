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

export default function Proveedores({ branchId }: { branchId: number }) {
  const [ocrState, analyzeAction, analyzing] = useActionState(
    analyzeDocumentAction,
    null,
  );

  const [importState, importAction, importing] = useActionState(
    importSupplierDataAction,
    null,
  );

  const [data, setData] = useState<EditableOCRData | null>(null);
  const { show } = useToast();

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

  useEffect(() => {
    if (ocrState?.error) show(ocrState.error, "error");
    if (importState?.error) show(importState.error, "error");
    if (importState?.success) show(importState.success, "success");
  }, [ocrState, importState, show]);

  const currentData = data ?? derivedData;

  return (
    <>
      {currentData ? (
        <SupplierDataReview
          currentData={currentData}
          setData={setData}
          importAction={importAction}
          importing={importing}
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
