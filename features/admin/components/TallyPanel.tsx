"use client";

import { useState } from "react";
import { tally } from "@/features/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function TallyPanel({ electionId }: { electionId: number }) {
  const [isTallying, setIsTallying] = useState(false);
  const [results, setResults] = useState<{
    candidateId: number;
    name: string;
    party: string | null;
    votes: number;
  }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTally = async () => {
    setIsTallying(true);
    setError(null);
    try {
      const res = await tally(electionId.toString());
      setResults(res.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to tally");
    } finally {
      setIsTallying(false);
    }
  };

  const maxVotes = results ? Math.max(...results.map((r) => r.votes), 1) : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tally Election</CardTitle>
        <CardDescription>Reconstruct the key and decrypt the aggregated ballots</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleTally} disabled={isTallying}>
          {isTallying ? "Tallying..." : "Run Tally"}
        </Button>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        {results && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold">Results</h3>
            {results.map((r) => (
              <div key={r.candidateId}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{r.name}</span>
                  <span>{r.votes} votes</span>
                </div>
                <Progress value={(r.votes / maxVotes) * 100} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
