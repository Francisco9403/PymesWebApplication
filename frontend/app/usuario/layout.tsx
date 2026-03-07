// app/usuario/layout.tsx
import Navbar from "@/layout/Navbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50"> {/* Agregamos el fondo base aquí */}
            <Navbar />
            {children}
        </div>
    );
}