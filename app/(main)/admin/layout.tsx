import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen pt-20">
      <aside className="w-64 border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Admin</h2>
        <AdminSidebar />
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
