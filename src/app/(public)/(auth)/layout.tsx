import { AdminGuard } from "@/components/routes/adminGuard";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}
