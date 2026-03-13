"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import SupplierDataReview from "./SupplierDataReview";
import SupplierFileUpload from "./SupplierFileUpload";
import SupplierList from "./SupplierList";
import SupplierProductList from "./SupplierProductList";
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
import { Supplier } from "@/types/Supplier";
import { TaxCategory } from "@/types/TaxCategory";
import {
  compareCostsAction,
  getSupplierProductsAction,
} from "@/app/actions/product";
import { Product } from "@/types/Product";

export default function Proveedores({
  branchId,
  initialSuppliers,
}: {
  branchId: number;
  initialSuppliers: Supplier[];
}) {
  console.log(branchId);
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
    analyzeDocumentAction,
    null,
  );

  const [importState, importAction, importing] = useActionState(
    importSupplierDataAction,
    null,
  );

  const handleSupplierClick = async (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsLoadingProducts(true);

    try {
      const products = await getSupplierProductsAction(supplier.id);
      setSupplierProducts(products);
    } finally {
      setIsLoadingProducts(false);
    }
  };

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
    async function enrichProducts() {
      if (!derivedData) return;

      setIsEnriching(true);

      const productNames = derivedData.products.map((p) => p.name);

      const lastPricesMap = await compareCostsAction(productNames);

      const enrichedProducts = derivedData.products.map((p) => ({
        ...p,
        lastCostPrice: lastPricesMap[p.name],
      }));

      setData({
        ...derivedData,
        products: enrichedProducts,
      });

      setIsEnriching(false);
    }

    enrichProducts();
  }, [derivedData]);

  useEffect(() => {
    if (importState?.success) {
      show(importState.success, "success");
      setData(null);
      setView("list");
      setTimeout(() => window.location.reload(), 500);
    }
  }, [importState, show]);

  const currentData = data ?? derivedData;

  return (
    <div className="max-w-7xl mx-auto p-4">
      {view === "list" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
            <div className="lg:col-span-4 h-fit sticky top-8">
              {isLoadingProducts ? (
                <div className="card-container p-20 flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
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
        <div className="space-y-4">
          <button
            onClick={() => {
              setView("list");
              setData(null);
            }}
            className="group flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]"
          >
            <span className="text-sm">←</span> Volver al listado
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
