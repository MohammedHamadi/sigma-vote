// ProtectedRoute — Server component (auth check wrapper)
import { redirect } from "next/navigation";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // TODO: Check auth session, redirect to login if unauthenticated
  return <>{children}</>;
}
