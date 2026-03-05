"use client";

import {
  crearCaja,
  crearSucursal,
  obtenerSucursalPorExternalId,
} from "@/app/actions/mercadolibre";
import { useState, useTransition } from "react";

// Función auxiliar para esperar unos segundos
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function ConfigurarPOS() {
  const [isPending, startTransition] = useTransition();
  const [resultado, setResultado] = useState<any>(null);

  const handleCrearEntorno = () => {
    startTransition(async () => {
      try {
        const storeExternalId = "SUC001";
        const posExternalId = "CAJA001SUC001";

        // 1. Verificar si la sucursal ya existe
        let sucursal = await obtenerSucursalPorExternalId(storeExternalId);

        if (!sucursal) {
          console.log("La sucursal no existe, creando...");
          sucursal = await crearSucursal("Sucursal Centro", storeExternalId, {
            street_number: "123",
            street_name: "Calle Principal",
            city_name: "Palermo",
            state_name: "Capital Federal",
            latitude: -34.6037,
            longitude: -58.3816,
            reference: "Local a la calle",
          });
          // Esperar solo si la acabamos de crear
          await delay(3000);
        } else {
          console.log("Sucursal encontrada:", sucursal.id);
        }

        // 2. Crear Caja (Mercado Pago permite 'actualizar' o falla si el POS ya existe)
        // Nota: Si el external_id de la caja ya existe, MP suele devolver 400.
        // Podrías envolver esto en un try/catch similar si quieres que no falle.
        const caja = await crearCaja(
          "Caja 1",
          sucursal.id,
          storeExternalId,
          posExternalId,
        );

        setResultado({ sucursal, caja });
      } catch (error: any) {
        console.error(error);
        // Si el error es que la CAJA ya existe, podrías informar al usuario
        if (error.message.includes("already_exists")) {
          alert("Esta caja ya estaba configurada.");
        } else {
          alert("Error: " + error.message);
        }
      }
    });
  };

  return (
    <div className="p-6">
      <button
        onClick={handleCrearEntorno}
        disabled={isPending}
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        {isPending ? "Configurando entorno..." : "Configurar Sucursal y Caja"}
      </button>

      {resultado && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-700 font-bold">¡Configuración Exitosa!</p>
          <p>ID Sucursal: {resultado.sucursal.id}</p>
          <p>External POS ID: {resultado.caja.external_id}</p>
        </div>
      )}
    </div>
  );
}
