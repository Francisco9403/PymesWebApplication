export default function Page() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Compliance & Contabilidad
        </h1>
        <p className="text-gray-600 mt-2">
          Facturación electrónica ARCA y Libro IVA Digital.
        </p>
      </header>

      <div className="bg-white p-6 rounded-xl border shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Estado de Conexión AFIP/ARCA
        </h2>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="font-medium">Certificado válido hasta 2025</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Exportación Mensual</h2>
        <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          Exportar Libro IVA TXT
        </button>
      </div>
    </div>
  );
}
