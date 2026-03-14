"use client";

import {
  crearCaja,
  crearSucursal,
  obtenerSucursalPorExternalId,
} from "@/app/actions/mercadopago";
import { BranchResponse, PosResponse } from "@/types/mercadopago";
import { useState, useTransition } from "react";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function ConfigurarPOS() {
  const [isPending, startTransition] = useTransition();
  const [resultado, setResultado] = useState<{
    sucursal: BranchResponse;
    caja: PosResponse;
  } | null>(null);

  const handleCrearEntorno = () => {
    startTransition(async () => {
      try {
        const storeExternalId = "SUC001";
        const posExternalId = "CAJA001SUC001";

        let sucursal = await obtenerSucursalPorExternalId(storeExternalId);

        if (!sucursal) {
          sucursal = await crearSucursal("Sucursal Centro", storeExternalId, {
            street_number: "123",
            street_name: "Calle Principal",
            city_name: "Palermo",
            state_name: "Capital Federal",
            latitude: -34.6037,
            longitude: -58.3816,
            reference: "Local a la calle",
          });

          await delay(3000);
        }

        const caja = await crearCaja(
          "Caja 1",
          sucursal.id,
          storeExternalId,
          posExternalId,
        );

        setResultado({ sucursal, caja });
      } catch (error: unknown) {
        console.error(error);

        if (error instanceof Error) {
          if (error.message.includes("already_exists")) {
            alert("Esta caja ya estaba configurada.");
          } else {
            alert("Error: " + error.message);
          }
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
