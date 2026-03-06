"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditableOCRData, RawOCRResult, RawOCRProduct } from "@/types/OCR";
import { analyzeDocument, importSupplierData } from "@/app/actions/proveedor";

export default function Proveedores() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EditableOCRData | null>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = (await analyzeDocument(formData)) as RawOCRResult;

      const productsRaw: RawOCRProduct[] =
        result.products ?? result.productos ?? [];

      const enrichedData: EditableOCRData = {
        businessName: result.businessName ?? result.razonSocial ?? "",
        cuit: result.cuit ?? "",
        taxCategory: result.taxCategory!,
        products: productsRaw.map((p) => ({
          name: p.name ?? p.descripcion ?? "",
          baseCostPrice: p.baseCostPrice ?? p.precio ?? 0,
          quantity: 1,
        })),
      };

      setData(enrichedData);
    } catch (error) {
      console.error(error);
      alert("Error analizando el archivo");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    setLoading(true);

    const result = await importSupplierData({
      ...data,
      branchId: 1,
    });

    if (result.success) {
      alert("¡Importación exitosa!");
      router.push("/usuario/proveedores");
    } else {
      alert(result.error);
    }

    setLoading(false);
  };

  if (!data) {
    return (
      <div className="p-8">
        <input type="file" onChange={handleFileChange} disabled={loading} />

        {loading && <p>Procesando...</p>}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Proveedor */}
        <input
          className="border p-2 w-full"
          value={data.businessName}
          onChange={(e) =>
            setData((prev) =>
              prev ? { ...prev, businessName: e.target.value } : prev,
            )
          }
        />

        {/* Productos */}
        {data.products.map((p, i) => (
          <div key={i} className="flex gap-2 border-b py-2">
            <input
              placeholder="Nombre del producto"
              className="flex-1 border p-1"
              value={p.name}
              onChange={(e) =>
                setData((prev) => {
                  if (!prev) return prev;

                  const newProducts = [...prev.products];
                  newProducts[i].name = e.target.value;

                  return { ...prev, products: newProducts };
                })
              }
            />

            <input
              type="number"
              placeholder="Precio"
              className="w-24 border p-1"
              value={p.baseCostPrice}
              onChange={(e) =>
                setData((prev) => {
                  if (!prev) return prev;

                  const newProducts = [...prev.products];
                  newProducts[i].baseCostPrice =
                    parseFloat(e.target.value) || 0;

                  return { ...prev, products: newProducts };
                })
              }
            />

            <input
              type="number"
              placeholder="Cant"
              className="w-20 border p-1"
              value={p.quantity}
              onChange={(e) =>
                setData((prev) => {
                  if (!prev) return prev;

                  const newProducts = [...prev.products];
                  newProducts[i].quantity = parseInt(e.target.value) || 0;

                  return { ...prev, products: newProducts };
                })
              }
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Importar
        </button>
      </form>
    </div>
  );
}
