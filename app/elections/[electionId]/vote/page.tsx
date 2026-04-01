import { getElectionById } from "@/features/elections/actions";
import { VotingWizard } from "@/features/voting/components/VotingWizard";

export default async function VotePage({
  params,
}: {
  params: Promise<{ electionId: string }>;
}) {
  const { electionId } = await params;
  const { election, candidates } = await getElectionById(electionId);

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Cast Your Vote</h1>
      <p className="text-muted-foreground mb-6">{election.title}</p>
      <VotingWizard electionId={election.id} candidates={candidates} />
    </div>
  );
}
