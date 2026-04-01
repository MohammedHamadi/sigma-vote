import { getResults } from "@/features/results/actions";
import { ResultsSummary } from "@/features/results/components/ResultsSummary";
import { ResultsChart } from "@/features/results/components/ResultsChart";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ electionId: string }>;
}) {
  const { electionId } = await params;
  const results = await getResults(electionId);

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Election Results</h1>
      <p className="text-muted-foreground mb-6">{results.election.title}</p>
      <ResultsSummary results={results} />
      <ResultsChart results={results} />
    </div>
  );
}
