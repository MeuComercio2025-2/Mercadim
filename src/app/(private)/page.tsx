"use client"

import { PrivateRoute } from "@/components/PrivateRoute";

export default function Home() {
  return <PrivateRoute><main className="flex min-h-screen flex-col items-center justify-between p-24">Meu Comercio Dashboard</main></PrivateRoute>;
}
