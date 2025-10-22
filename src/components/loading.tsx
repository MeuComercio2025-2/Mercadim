import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen flex items-center flex-col justify-center bg-muted px-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
    </div>
  );
}
