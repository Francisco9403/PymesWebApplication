"use client";

import { compareCostsAction, getSupplierProducts } from "@/app/actions/product";
import { analyzeDocument, importSupplierData } from "@/app/actions/proveedor";
import { useToast } from "@/layout/ToastProvider";
import { FiscalOrigin } from "@/types/FiscalOrigin";
import { IvaCondition } from "@/types/IvaCondition";
import {
  EditableOCRData,
  EditableProduct,
  RawOCRProduct,
  RawOCRResult,
} from "@/types/OCR";
import { Product } from "@/types/Product";
import { Supplier } from "@/types/Supplier";
import { useActionState, useEffect, useMemo, useState } from "react";
import SupplierDataReview from "./SupplierDataReview";
import SupplierFileUpload from "./SupplierFileUpload";
import SupplierList from "./SupplierList";
import SupplierProductList from "./SupplierProductList";

export default function Proveedores({
  branchId,
  initialSuppliers,
  suppliersError,
}: {
  branchId: string;
  initialSuppliers: Supplier[];
  suppliersError?: string;
}) {
  const [view, setView] = useState<"list" | "import">("list");
  const [data, setData] = useState<EditableOCRData | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [supplierProducts, setSupplierProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const { show } = useToast();

  const [ocrState, analyzeAction, analyzing] = useActionState(
    analyzeDocument,
    null,
  );

  const [importState, importAction, importing] = useActionState(
    importSupplierData,
    null,
  );

  const handleSupplierClick = async (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsLoadingProducts(true);

    const products = await getSupplierProducts(supplier.id, branchId).catch(
      () => [],
    );
    setSupplierProducts(products);
    setIsLoadingProducts(false);
  };

  const derivedData = useMemo<EditableOCRData | null>(() => {
    if (!ocrState?.data) return null;
    const raw = ocrState.data as RawOCRResult;

    return {
      businessName: raw.businessName ?? raw.razonSocial ?? "",
      cuit: raw.cuit ?? "",
      ivaCondition: raw.ivaCondition ?? IvaCondition.CONSUMIDOR_FINAL,
      fiscalOrigin: raw.fiscalOrigin ?? FiscalOrigin.NACIONAL,
      products: (raw.products ?? raw.productos ?? []).map(
        (p: RawOCRProduct): EditableProduct => ({
          name: p.name ?? p.descripcion ?? "",
          baseCostPrice: p.baseCostPrice ?? p.precio ?? 0,
          ean13: p.ean13 ?? "",
          quantity: 1,
        }),
      ),
    };
  }, [ocrState?.data]);

  useEffect(() => {
    if (!derivedData) return;

    const enrichProducts = async () => {
      setIsEnriching(true);

      try {
        const productNames = derivedData.products.map((p) => p.name);
        const lastPricesMap = await compareCostsAction(productNames);

        setData({
          ...derivedData,
          products: derivedData.products.map((p) => ({
            ...p,
            lastCostPrice: lastPricesMap[p.name],
          })),
        });
      } catch {
        show("No se pudieron comparar precios anteriores", "error");
        setData(derivedData);
      }

      setIsEnriching(false);
    };

    enrichProducts();
  }, [derivedData, show]);

  useEffect(() => {
    const error = suppliersError || ocrState?.error || importState?.error;

    if (error) show(error, "error");
  }, [suppliersError, ocrState?.error, importState?.error, show]);

  useEffect(() => {
    if (!importState?.success) return;

    show(importState.success, "success");

    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setData(null);
      setView("list");
    });

    return () => {
      cancelled = true;
    };
  }, [importState?.success, show]);

  const currentData = data ?? derivedData;

  return (
    <div className="max-w-7xl mx-auto">
      {view === "list" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div
            className={`${selectedSupplier ? "lg:col-span-8" : "lg:col-span-12"} transition-all duration-500`}
          >
            <SupplierList
              suppliers={initialSuppliers}
              onNewImport={() => setView("import")}
              onSupplierClick={handleSupplierClick}
            />
          </div>

          {selectedSupplier && (
            <div className="lg:col-span-4 h-fit sticky top-24">
              {isLoadingProducts ? (
                <div
                  className="flex flex-col items-center justify-center gap-4 p-20 rounded-xl
                    bg-white border border-slate-200
                    dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
                >
                  <div
                    className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                    style={{
                      borderColor: "#FF6B35",
                      borderTopColor: "transparent",
                    }}
                  />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#444]">
                    Buscando productos...
                  </p>
                </div>
              ) : (
                <SupplierProductList
                  products={supplierProducts}
                  supplierName={selectedSupplier.businessName || "Proveedor"}
                  onClose={() => setSelectedSupplier(null)}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <button
            onClick={() => {
              setView("list");
              setData(null);
            }}
            className="group inline-flex items-center gap-2 w-fit text-[0.72rem] font-bold uppercase tracking-[0.15em] transition-colors
              text-slate-400 hover:text-slate-700
              dark:text-[#555] dark:hover:text-[#F0EDE8]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:-translate-x-0.5"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Volver al listado
          </button>

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
        </div>
      )}
    </div>
  );
}
