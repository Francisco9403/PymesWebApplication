import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="/iniciar-sesion" className="text-blue-600 hover:underline">
        Iniciar Sesión
      </Link>
    </main>
  );
}
