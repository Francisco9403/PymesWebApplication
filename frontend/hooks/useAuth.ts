"use client";

import { useToast } from "@/layout/ToastProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth({ requireAuth = true } = {}) {
  const router = useRouter();
  const { show } = useToast();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(res.status.toString());
        }

        const data = await res.json();
        setUser(data);
      } catch (error: unknown) {
        setUser(null);
        if (requireAuth) {
          if (error instanceof Error) {
            show(error.message || "Could not verify session", "error");
          } else {
            show("Unexpected error", "error");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, show, requireAuth]);

  return { user, loading };
}
