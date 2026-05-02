import { getElectionById } from "@/features/elections/actions";
import { CandidateCard } from "@/features/elections/components/CandidateCard";
import { GenerateCredentials } from "@/features/voting/components/GenerateCredentials";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Shield, Calendar, Users } from "lucide-react";

export default async function ElectionDetailPage({
  params,
}: {
  params: Promise<{ electionId: string }>;
}) {
  const { electionId } = await params;
  const { election, candidates } = await getElectionById(electionId);

  const isOpen = election.status === "OPEN";
  const isTallied = election.status === "TALLIED" || election.status === "CLOSED";

  return (
    <div className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-20 mt-10">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <h1 className="text-5xl font-bold font-serif text-white mb-3">{election.title}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl font-sans">
              {election.description || "Secure, mathematically verifiable voting event."}
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
             <div className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(var(--primary),0.1)] ${
              isOpen ? "border-primary/30 text-primary" : "border-[#262626] text-muted-foreground"
            }`}>
              {isOpen && <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>}
              {election.status || "SETUP"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-8 py-6 border-y border-[#262626]">
          <div className="flex items-center gap-3 text-muted-foreground font-mono text-sm uppercase tracking-tighter">
            <Shield className="w-5 h-5 text-primary" />
            <span>Threshold: {election.threshold}/{election.totalShares} Shares</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground font-mono text-sm uppercase tracking-tighter">
            <Calendar className="w-5 h-5 text-primary" />
            <span>{election.startTime ? new Date(election.startTime).toLocaleDateString() : "No Start Date"}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground font-mono text-sm uppercase tracking-tighter">
            <Users className="w-5 h-5 text-primary" />
            <span>{candidates.length} Candidates</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Candidates */}
        <div className="lg:col-span-7">
          <h2 className="text-2xl font-bold text-white mb-6 font-serif">Official Nominees</h2>
          <div className="grid gap-4">
            {candidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        </div>

        {/* Right Column: Voting Access */}
        <div className="lg:col-span-5">
          {isOpen && (
            <div className="sticky top-32 space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6 font-serif">Voting Access</h2>
              
              <GenerateCredentials 
                electionId={election.id} 
                rsaPubE={election.rsaPubE || ""} 
                rsaPubN={election.rsaPubN || ""} 
              />

              <div className="bg-[#121212] border border-[#262626] p-8 rounded-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="font-bold text-lg text-white mb-2 leading-tight">Ready to Cast Your Vote?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    If you have already generated and saved your anonymous credentials, proceed to the secure voting booth.
                  </p>
                  <Link href={`/elections/${election.id}/vote`}>
                    <Button variant="secondary" className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-6">
                      Enter Voting Booth <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {isTallied && (
            <div className="sticky top-32">
              <h2 className="text-2xl font-bold text-white mb-6 font-serif">Election Results</h2>
              <div className="bg-[#121212] border border-[#262626] p-8 rounded-xl">
                 <h3 className="font-bold text-lg text-white mb-2 leading-tight">Tally Complete</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    The cryptographic tallying process has been completed and verified against all zero-knowledge proofs.
                  </p>
                <Link href={`/elections/${election.id}/results`}>
                  <Button className="w-full bg-[#1D84DD] hover:bg-[#1D84DD]/90 text-white font-bold py-6">
                    View Results Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
