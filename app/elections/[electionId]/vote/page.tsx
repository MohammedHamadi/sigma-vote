// elections/[electionId]/vote — Voting flow page (client-heavy)
export default function VotePage({
  params,
}: {
  params: { electionId: string };
}) {
  return (
    <div>
      <h1>Cast Your Vote</h1>
      {/* TODO: Import and render VotingWizard from features/voting/components */}
    </div>
  );
}
