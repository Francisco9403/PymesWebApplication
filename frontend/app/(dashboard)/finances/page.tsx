export default function FinancesPage() {
    return (
        <div className="p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Finanzas y Pagos</h1>
                    <p className="text-gray-600 mt-2">Gestión multi-moneda, tablero de deudas y cuentas corrientes.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="font-semibold text-gray-500 mb-2">Dólar Oficial</h3>
                    <p className="text-3xl font-bold">$ 900.00</p>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="font-semibold text-gray-500 mb-2">Dólar MEP</h3>
                    <p className="text-3xl font-bold">$ 1050.00</p>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm border-blue-200 bg-blue-50 text-blue-900">
                    <h3 className="font-semibold mb-2">Markup Automático</h3>
                    <p className="text-lg">Tus precios se actualizan si el MEP sube &gt; 2%</p>
                </div>
            </div>
        </div>
    );
}
