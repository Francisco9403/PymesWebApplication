import Link from "next/link";
import IniciarSesionForm from "./IniciarSesionForm";

export default function SignIn() {
  return (
    <main className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
      <div className="flex flex-col flex-1">
        <div className="w-full max-w-md pt-10 mx-auto">
          <Link
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            href="/"
            data-discover="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 20 20"
              fill="none"
              className="size-5"
            >
              <path
                d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            Volver a la página principal
          </Link>
        </div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-3xl leading-9.5 dark:text-white/90 sm:text-4xl sm:leading-11">
                Iniciar Sesión
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Introduce tu email y contraseña para iniciar sesión!
              </p>
            </div>
            <div>
              <IniciarSesionForm />
            </div>
          </div>
        </div>
      </div>
      <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
        <div className="relative flex items-center justify-center z-1">
          <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
            <img alt="grid" src="/images/shape/grid-01.svg" />
          </div>
          <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
            <img alt="grid" src="/images/shape/grid-01.svg" />
          </div>
          <div className="flex flex-col items-center max-w-xs">
            <Link className="block mb-4" href="#" data-discover="true">
              <img
                width="231"
                height="48"
                alt="Logo"
                /* src="/images/logo/auth-logo.svg" */
                src="/images/logo/logo.png"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
        {/* <ToggleTheme /> */}
      </div>
    </main>
  );
}
