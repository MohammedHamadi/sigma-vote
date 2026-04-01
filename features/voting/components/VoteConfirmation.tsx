"use client";

import type { Candidate } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VoteConfirmation({ candidate }: { candidate: Candidate }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirm Your Vote</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">{candidate.name}</p>
        {candidate.party && (
          <p className="text-sm text-muted-foreground">{candidate.party}</p>
        )}
        <p className="text-sm text-muted-foreground mt-4">
          Your vote will be encrypted and submitted anonymously.
        </p>
      </CardContent>
    </Card>
  );
}
