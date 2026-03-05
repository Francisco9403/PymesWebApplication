"use client";

import { createBranchAction } from "@/app/actions/stock";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 w-full md:w-auto"
        >
            {pending ? "Creando..." : "Crear Sucursal"}
        </button>
    );
}

export default function CreateBranchForm() {
    return (
        <form
            action={createBranchAction}
            className="bg-white p-6 rounded-xl border shadow-sm space-y-4"
        >
            <h2 className="text-xl font-semibold">Nueva Sucursal / Depósito</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    name="name"
                    placeholder="Nombre (Ej: Depósito Norte)"
                    required
                    className="border p-2 rounded w-full"
                />

                <input
                    name="address"
                    placeholder="Dirección (Ej: Av. San Martín 123)"
                    className="border p-2 rounded w-full"
                />

                <input
                    name="phone"
                    placeholder="Teléfono"
                    className="border p-2 rounded w-full"
                />
            </div>

            <div className="flex items-center gap-2 pt-2 pb-4">
                <input
                    type="checkbox"
                    name="isPointOfSale"
                    id="isPointOfSale"
                    className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
                    defaultChecked
                />
                <label htmlFor="isPointOfSale" className="text-sm text-gray-700">
                    ¿Funciona también como Punto de Venta al público?
                </label>
            </div>

            <div className="flex justify-end border-t pt-4 mt-2">
                <SubmitButton />
            </div>
        </form>
    );
}