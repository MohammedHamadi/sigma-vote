// elections/[electionId]/results — Results page
export default function ResultsPage({
  params,
}: {
  params: { electionId: string };
}) {
  return (
    <div>
      <h1>Election Results</h1>
      {/* TODO: Import and render ResultsChart + ResultsSummary from features/results/components */}
    </div>
  );
}
