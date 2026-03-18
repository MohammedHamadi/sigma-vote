// admin layout — Server component with role guard
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Role-based access check — redirect non-admins
  return (
    <div className="admin-layout">
      {/* TODO: Import AdminSidebar from features/admin/components */}
      <aside>{/* AdminSidebar */}</aside>
      <main>{children}</main>
    </div>
  );
}
