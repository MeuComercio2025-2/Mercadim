"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";


export default function NotFound() {
  const router = useRouter();
  return (
    <div className="h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-4xl font-bold text-destructive">
            404
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            Oops! Página não encontrada.
          </p>
          <Button className="cursor-pointer" onClick={() => router.push("/login")}>
            <p>Ir para Login</p>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
