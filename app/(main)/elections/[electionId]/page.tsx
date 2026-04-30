import { getElectionById } from "@/features/elections/actions";
import { ElectionStatus } from "@/features/elections/components/ElectionStatus";
import { CandidateCard } from "@/features/elections/components/CandidateCard";
import { GenerateCredentials } from "@/features/voting/components/GenerateCredentials";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Candidates ({candidates.length})</h2>
        <div className="grid gap-3">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </div>

      {election.status === "OPEN" && (
        <div className="mt-8 pt-8 border-t border-white/10">
          <h2 className="text-xl font-semibold mb-4">Voting Access</h2>
          
          <div className="mb-6">
            <GenerateCredentials 
              electionId={election.id} 
              rsaPubE={election.rsaPubE} 
              rsaPubN={election.rsaPubN} 
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-sm">Already have your credentials?</h3>
              <p className="text-xs text-muted-foreground">You can proceed directly to the voting booth.</p>
            </div>
            <Link href={`/elections/${election.id}/vote`}>
              <Button variant="secondary" size="sm">
                Enter Voting Booth <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {election.status === "TALLIED" && (
        <div className="mt-8 pt-8 border-t border-white/10">
          <Link href={`/elections/${election.id}/results`}>
            <Button size="lg" variant="outline">View Results</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
