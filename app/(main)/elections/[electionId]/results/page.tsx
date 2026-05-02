import { getResults } from "@/features/results/actions";
import { ResultsSummary } from "@/features/results/components/ResultsSummary";
import { ResultsChart } from "@/features/results/components/ResultsChart";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ electionId: string }>;
}) {
  const { electionId } = await params;
  const results = await getResults(electionId);

  return (
    <div className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-20 mt-10">
      <Link href={`/elections/${electionId}`} className="inline-flex items-center text-sm font-mono tracking-tighter text-muted-foreground hover:text-primary mb-12 transition-colors uppercase gap-2 group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Election Details
      </Link>

      
      <div className="mb-16">
        <h1 className="text-7xl font-bold font-serif text-white mb-3 tracking-tight">Election Results</h1>
        <p className="text-3xl text-muted-foreground font-serif opacity-70">
          {results.election.title}
        </p>
      </div>

      <div className="space-y-16">
        <ResultsSummary results={results} />
        <ResultsChart results={results} />
      </div>
    </div>
  );
}
