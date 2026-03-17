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
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm tracking-[0.02em]
        border-0 cursor-pointer transition-[transform,box-shadow,background-color] duration-150 bg-[#FF6B35] text-white hover:bg-[#FF8555] hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(255,107,53,0.3)]">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4v16m8-8H4" />
      </svg>
      Agregar cliente
    </button>
  );
}
