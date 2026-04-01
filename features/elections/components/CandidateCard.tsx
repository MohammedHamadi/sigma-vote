import type { Candidate } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{candidate.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {candidate.party && (
          <p className="text-sm text-muted-foreground">{candidate.party}</p>
        )}
      </CardContent>
    </Card>
  );
}
