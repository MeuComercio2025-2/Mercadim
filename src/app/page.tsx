// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Sempre que acessar "/", vai mandar para "/login"
  redirect("/login");
}
