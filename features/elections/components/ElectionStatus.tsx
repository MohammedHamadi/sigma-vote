import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  SETUP: "secondary",
  OPEN: "default",
  CLOSED: "destructive",
  TALLIED: "outline",
};

export function ElectionStatus({ status }: { status: string }) {
  const variant = statusColors[status] ?? "outline";
  return <Badge variant={variant}>{status}</Badge>;
}
