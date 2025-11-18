"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("sisakalam_user");

    if (!user) {
      router.push("/home");
      setLoading(false); // important!!
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className="flex justify-center mt-10">Checking auth...</div>;
  }

  return <>{children}</>;
}
