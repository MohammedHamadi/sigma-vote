import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (requireAdmin && session.user.role !== "admin") {
    redirect("/");
  }
  return <>{children}</>;
}
