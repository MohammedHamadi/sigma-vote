import { getElectionById } from "@/features/elections/actions";
import { ElectionStatus } from "@/features/elections/components/ElectionStatus";
import { CandidateCard } from "@/features/elections/components/CandidateCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ElectionDetailPage({
  params,
}: {
  params: Promise<{ electionId: string }>;
}) {
  const { electionId } = await params;
  const { election, candidates } = await getElectionById(electionId);

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{election.title}</h1>
        <p className="text-muted-foreground mt-1">{election.description}</p>
        <div className="mt-3">
          <ElectionStatus status={election.status ?? "SETUP"} />
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          {election.startTime && (
            <span>Starts: {new Date(election.startTime).toLocaleString()} </span>
          )}
          {election.endTime && (
            <span>Ends: {new Date(election.endTime).toLocaleString()}</span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Candidates ({candidates.length})</h2>
        <div className="grid gap-3">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </div>

      {election.status === "OPEN" && (
        <Link href={`/elections/${election.id}/vote`}>
          <Button size="lg">Cast Your Vote</Button>
        </Link>
      )}

      {election.status === "TALLIED" && (
        <Link href={`/elections/${election.id}/results`}>
          <Button size="lg" variant="outline">View Results</Button>
        </Link>
      )}
    </div>
  );
}
