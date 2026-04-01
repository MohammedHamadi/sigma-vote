import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ResultsSummary({
  results,
}: {
  results: {
    election: { title: string };
    candidates: { name: string; party: string | null; votes: number }[];
    ballotCount: number;
  };
}) {
  const winner = results.candidates[0];
  const topVotes = winner?.votes ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Votes Cast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{results.ballotCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Leading Candidate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">{winner?.name ?? "N/A"}</p>
          {winner?.party && (
            <p className="text-sm text-muted-foreground">{winner.party}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {topVotes} votes ({results.ballotCount > 0 ? ((topVotes / results.ballotCount) * 100).toFixed(1) : 0}%)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
