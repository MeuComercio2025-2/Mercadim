"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NotFound() {
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
          <Button asChild>
            <Link href="/">Voltar para a Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
