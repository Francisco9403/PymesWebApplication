export default function POSPage() {
    return (
        <div className="p-8 h-full flex flex-col">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Punto de Venta (POS)</h1>
                    <p className="text-gray-600 mt-1">Escáner de código de barras y QR interoperable.</p>
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold text-sm border border-green-200">
                    Conectado - Sincronizado
                </div>
            </header>

            <div className="flex gap-6 flex-1">
                {/* Lado Escaneo/Búsqueda (70%) */}
                <div className="flex-1 bg-white p-6 rounded-xl border shadow-sm">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Escanea EAN-13, QR o busca por nombre..."
                            className="w-full text-lg p-4 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            autoFocus
                        />
                    </div>
                    <div className="border border-gray-100 rounded-lg h-[60%] flex items-center justify-center text-gray-400 bg-gray-50">
                        Lista de productos (vacía)
                    </div>
                </div>

                {/* Lado Checkout (30%) */}
                <div className="w-[350px] bg-white p-6 rounded-xl border shadow-sm flex flex-col">
                    <h2 className="text-xl font-bold mb-4 border-b pb-4">Resumen de Venta</h2>
                    <div className="flex-1"></div>

                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between text-2xl font-bold mb-6">
                            <span>Total</span>
                            <span>$ 0.00</span>
                        </div>
                        <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors">
                            Cobrar con QR (Transf. 3.0)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
