import Link from 'next/link';
import { Package, ShoppingCart, DollarSign, FileText, Bell } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r flex flex-col">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold text-gray-800">Comercio App</h1>
                    <p className="text-sm text-green-600 font-medium">Online</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/pos" className="flex items-center gap-3 p-3 rounded-lg hover:bg-black hover:text-white transition-colors">
                        <ShoppingCart size={20} />
                        <span className="font-medium">Punto de Venta</span>
                    </Link>
                    <Link href="/inventory" className="flex items-center gap-3 p-3 rounded-lg hover:bg-black hover:text-white transition-colors">
                        <Package size={20} />
                        <span className="font-medium">Inventario & Catálogo</span>
                    </Link>
                    <Link href="/finances" className="flex items-center gap-3 p-3 rounded-lg hover:bg-black hover:text-white transition-colors">
                        <DollarSign size={20} />
                        <span className="font-medium">Finanzas (Multimoneda)</span>
                    </Link>
                    <Link href="/compliance" className="flex items-center gap-3 p-3 rounded-lg hover:bg-black hover:text-white transition-colors">
                        <FileText size={20} />
                        <span className="font-medium">Compliance (ARCA)</span>
                    </Link>
                </nav>

                {/* Alertas Predictivas Panel Basico */}
                <div className="p-4 border-t bg-amber-50">
                    <div className="flex items-center gap-2 text-amber-800 mb-2">
                        <Bell size={16} />
                        <span className="font-semibold text-sm">Alertas IA</span>
                    </div>
                    <p className="text-xs text-amber-700">Stock crítico: Café en grano (Quedan 2kg - velocidad alta)</p>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto bg-gray-50">
                {children}
            </main>
        </div>
    );
}
