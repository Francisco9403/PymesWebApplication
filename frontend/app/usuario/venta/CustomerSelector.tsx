"use client";

import { crearCliente } from "@/app/actions/cliente";
import { useState } from "react";

export function CustomerSelector({
  customerId,
  customerName,
  setCustomerId,
  setCustomerName,
}: {
  customerId: number | null;
  customerName: string | null;
  setCustomerId: (id: number | null) => void;
  setCustomerName: (name: string | null) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("creditLimit", "0");

    const result = await crearCliente(null, formData);

    if (result?.id) {
      setCustomerId(result.id);
      setCustomerName(name);
      setCreating(false);
    }
  }

  if (customerId) {
    return (
      <div className="card-container p-4 flex justify-between items-center">
        <div>
          <p className="font-bold">{customerName}</p>
          <p className="text-sm text-slate-500">Cliente seleccionado</p>
        </div>

        <button
          onClick={() => {
            setCustomerId(null);
            setCustomerName(null);
          }}
          className="text-red-500"
        >
          Quitar
        </button>
      </div>
    );
  }

  if (creating) {
    return (
      <div className="card-container p-4 space-y-3">
        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />

        <input
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input"
        />

        <button onClick={handleCreate} className="btn-primary">
          Crear cliente
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setCreating(true)}
      className="btn-primary bg-indigo-600! hover:bg-indigo-700!"
    >
      + Agregar cliente
    </button>
  );
}
