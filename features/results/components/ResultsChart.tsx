"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ResultsChart({
  results,
}: {
  results: {
    candidates: { name: string; party: string | null; votes: number }[];
    ballotCount: number;
  };
}) {
  const maxVotes = Math.max(...results.candidates.map((c) => c.votes), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vote Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.candidates.map((candidate) => (
            <div key={candidate.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{candidate.name}</span>
                <span className="text-muted-foreground">
                  {candidate.votes} votes ({results.ballotCount > 0 ? ((candidate.votes / results.ballotCount) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full transition-all"
                  style={{
                    width: `${(candidate.votes / maxVotes) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
