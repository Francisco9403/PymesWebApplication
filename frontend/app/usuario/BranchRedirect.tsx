"use client";

import { Branch } from "@/types/Branch";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BranchRedirect({ branches }: { branches: Branch[] }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      (!branches || branches.length === 0) &&
      pathname !== "/usuario/sucursales"
    ) {
      router.replace("/usuario/sucursales");
    }
  }, [branches, pathname, router]);

  return null;
}
