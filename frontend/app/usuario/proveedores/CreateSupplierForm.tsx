"use client";

import { createSupplierAction } from "@/app/actions/proveedor";
import { useFormStatus } from "react-dom";

// Un mini componente para el botón así el pending funciona perfecto
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 w-full md:w-auto"
        >
            {pending ? "Creando..." : "Crear Proveedor"}
        </button>
    );
}

export default function CreateSupplierForm() {
    return (
        <form
            action={createSupplierAction}
            className="bg-white p-6 rounded-xl border shadow-sm space-y-4"
        >
            <h2 className="text-xl font-semibold">Nuevo Proveedor</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    name="businessName"
                    placeholder="Razón Social (Ej: Distribuidora Gomez)"
                    required
                    className="border p-2 rounded w-full"
                />

                <input
                    name="cuit"
                    placeholder="CUIT (Sin guiones)"
                    required
                    className="border p-2 rounded w-full"
                />

                <select
                    name="taxCategory"
                    required
                    className="border p-2 rounded w-full bg-white text-gray-700"
                >
                    <option value="">Seleccionar Categoría Fiscal...</option>
                    <option value="RESPONSABLE_INSCRIPTO">Responsable Inscripto</option>
                    <option value="MONOTRIBUTO">Monotributo</option>
                    <option value="EXENTO">Exento</option>
                    <option value="CONSUMIDOR_FINAL">Consumidor Final</option>
                    <option value="SUJETO_NO_CATEGORIZADO">Sujeto No Categorizado</option>
                </select>
            </div>

            <div className="flex justify-end pt-2">
                <SubmitButton />
            </div>
        </form>
    );
}