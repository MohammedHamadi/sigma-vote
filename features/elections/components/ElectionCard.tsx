import Link from "next/link";
import type { Election } from "@/db/schema";
import { ElectionStatus } from "./ElectionStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ElectionCard({ election }: { election: Election }) {
  return (
    <Card className="hover:border-primary transition-colors flex flex-col h-full">
      <CardHeader>
        <CardTitle>{election.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {election.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center justify-between">
          <ElectionStatus status={election.status ?? "SETUP"} />
          <div className="text-sm text-muted-foreground">
            {election.startTime
              ? new Date(election.startTime).toLocaleDateString()
              : "No start date"}
          </div>
        </div>
        <div className="mt-4 flex gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">Threshold: {election.threshold}</Badge>
          <Badge variant="outline">Shares: {election.totalShares}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
        <Link href={`/elections/${election.id}`}>
          <Button variant="ghost" size="sm">View Details</Button>
        </Link>
        {election.status === "OPEN" && (
          <Link href={`/elections/${election.id}/vote`}>
            <Button size="sm">Vote Now</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
