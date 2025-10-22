"use client";

import Loading from "@/components/loading";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return ;

    if (!user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <Loading />;
  }

  return <>{children}</>;
}
