"use server";

export async function sendResetEmail(
  prevState: { error?: string; success?: string } | null,
  formData: FormData,
) {
  const email = formData.get("email") as string;

  if (!email) return { error: "Email requerido" };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/auth/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data.message ?? "Error al enviar mail de confirmación" };
    }

    return { success: "Si el email existe, te enviamos un enlace" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}

export async function resetPasswordAction(
  prevState: { error?: string; success?: string } | null,
  formData: FormData,
) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  if (!token || !password) return { error: "Token y contraseña requeridos" };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/auth/reset-password`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      },
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data.message ?? "Error al resetear contraseña" };
    }

    return { success: "Contraseña actualizada correctamente" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}
