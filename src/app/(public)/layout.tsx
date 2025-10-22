import { PublicRoute } from "@/components/routes/public";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    
  return <PublicRoute>{children}</PublicRoute>;
}
