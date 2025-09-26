"use client"

import { PrivateRoute } from "@/components/PrivateRoute";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  }
  return <main className="flex min-h-screen flex-col items-center  p-24">Meu Comercio Dashboard <Button variant="destructive" onClick={handleLogout}>Logout</Button></main>
}
