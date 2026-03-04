export const AuthService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (res.ok) return;

    let message = "Error during login";

    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}

    throw new Error(message);
  },

  logout: async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) return;

    let message = "Error logging out";

    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}

    throw new Error(message);
  },
};
