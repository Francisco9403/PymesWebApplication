"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Supplier } from "@/types/Supplier"; // Ajustá la ruta si la guardaste en otro lado

export async function createSupplierAction(formData: FormData) {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("token")?.value;
    if (!jwt) return { error: "No autorizado" };

    const supplier = {
        businessName: formData.get("businessName"),
        cuit: formData.get("cuit"),
        taxCategory: formData.get("taxCategory"),
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/suppliers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(supplier),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error de Spring Boot:", response.status, errorText);
        return { error: "Falló la creación en el backend" };
    }

    // Refrescamos la página de proveedores para que aparezca el nuevo en la tabla
    revalidatePath("/usuario/proveedores");
}

export async function getSuppliers(): Promise<Supplier[]> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("token")?.value;
    if (!jwt) return [];

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/suppliers`, {
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    });

    if (!res.ok) {
        return [];
    }

    return res.json();
}