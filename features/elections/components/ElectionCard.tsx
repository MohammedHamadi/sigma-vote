import Link from "next/link";
import type { Election } from "@/db/schema";
import { ElectionStatus } from "./ElectionStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ElectionCard({ election }: { election: Election }) {
  return (
    <Link href={`/elections/${election.id}`}>
      <Card className="hover:border-primary transition-colors">
        <CardHeader>
          <CardTitle>{election.title}</CardTitle>
          <CardDescription>
            {election.description || "No description provided"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <ElectionStatus status={election.status ?? "SETUP"} />
            <div className="text-sm text-muted-foreground">
              {election.startTime
                ? new Date(election.startTime).toLocaleDateString()
                : "No start date"}
            </div>
          </div>
          <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">Threshold: {election.threshold}</Badge>
            <Badge variant="outline">Shares: {election.totalShares}</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
