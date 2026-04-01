import Link from "next/link";

export function AdminSidebar() {
  return (
    <nav className="space-y-2">
      <Link href="/admin" className="block px-3 py-2 rounded hover:bg-muted">
        Dashboard
      </Link>
      <Link href="/admin/elections" className="block px-3 py-2 rounded hover:bg-muted">
        Manage Elections
      </Link>
      <Link href="/admin/elections/create" className="block px-3 py-2 rounded hover:bg-muted">
        Create Election
      </Link>
    </nav>
  );
}
