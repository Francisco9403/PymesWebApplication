export default function InventoryPage() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Inventario y Catálogo</h1>
                <p className="text-gray-600 mt-2">Gestión omnicanal, escaneo OCR y generación de fichas IA.</p>
            </header>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Módulo de Ingreso de Mercadería</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
                    <p className="mb-2">Arrastra una factura PDF/Imagen para OCR</p>
                    <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        Importar con IA
                    </button>
                </div>
            </div>
        </div>
    );
}
