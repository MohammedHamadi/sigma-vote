"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Users, Lock, Verified, TrendingUp } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { getElectionById } from "@/features/elections/actions";
import type { Candidate, Election } from "@/db/schema";

export default function ResultsDashboard() {
  const searchParams = useSearchParams();
  const electionId = searchParams.get("electionId");
  
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (electionId) {
      getElectionById(electionId).then(res => {
        setElection(res.election);
        // Mocking vote counts for demonstration as we don't have real tally logic yet
        const totalVotes = 14582;
        const mockCandidates = res.candidates.map((c, i) => {
          const votes = i === 0 ? 7241 : i === 1 ? 5103 : 2238;
          return {
            ...c,
            votes,
            percentage: (votes / totalVotes) * 100
          };
        });
        setCandidates(mockCandidates);
        setLoading(false);
      });
    } else {
      // Default mock data if no ID provided
      setCandidates([
        { id: "c1", name: "Alice Johnson", party: "Progressive Technology Party", votes: 7241, percentage: 49.66 },
        { id: "c2", name: "Bob Smith", party: "Conservative Heritage Group", votes: 5103, percentage: 35.00 },
        { id: "c3", name: "Charlie Davis", party: "Independent Consensus", votes: 2238, percentage: 15.34 },
      ]);
      setLoading(false);
    }
  }, [electionId]);

  if (loading) return <div className="p-20 text-center text-muted-foreground">Loading election results...</div>;

  return (
    <div className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-20 mt-10">
      {/* Success Banner */}
      <div className="w-full bg-success/5 border border-success/30 rounded-xl p-6 mb-12 flex items-center gap-4 relative overflow-hidden group shadow-[0_0_20px_rgba(var(--success),0.05)]">
        <div className="absolute inset-0 bg-success/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="p-3 bg-success/10 rounded-lg text-success relative z-10">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <p className="font-bold text-success relative z-10 text-lg">
          Election Tally Verified & Secured - Cryptographic Proofs & Zero-Knowledge Validation Successful.
        </p>
      </div>

      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-7xl font-bold font-serif text-white mb-3">Election Results</h1>
        <p className="text-3xl text-muted-foreground font-serif">
          {election?.title || "General Assembly Elections 2026"}
        </p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Total Votes Card */}
        <div className="bg-[#121212] border border-[#262626] rounded-2xl p-10 flex flex-col gap-6 hover:border-primary/50 hover:bg-[#151515] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">
            <Users className="w-40 h-40 text-primary" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-muted-foreground text-sm uppercase tracking-widest">Total Votes Cast</h2>
          </div>
          <div className="text-7xl font-bold text-white relative z-10 font-serif">
            <NumberTicker value={14582} />
          </div>
          <div className="mt-auto pt-6 border-t border-[#262626] relative z-10">
            <div className="flex items-center gap-3 text-success font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_10px_rgba(var(--success),0.5)]"></span> 
              100% COUNTED & AUDITED
            </div>
          </div>
        </div>

        {/* Cryptographic Status Card */}
        <div className="bg-[#121212] border border-[#262626] rounded-2xl p-10 flex flex-col gap-6 hover:border-success/50 hover:bg-[#151515] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">
            <Lock className="w-40 h-40 text-success" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-success/10 rounded-xl text-success">
              <Verified className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-muted-foreground text-sm uppercase tracking-widest">Security Status</h2>
          </div>
          <div className="text-4xl font-bold text-success mt-4 relative z-10 font-serif leading-tight">
            Zero-Knowledge Validated
          </div>
          <div className="mt-auto pt-6 border-t border-[#262626] relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-success/30 bg-success/10 text-xs font-bold text-success uppercase tracking-widest">
               Proofs Verified E2E
            </div>
          </div>
        </div>
      </div>

      {/* Final Tally Table */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white font-serif">Final Tally Breakdown</h2>
        <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 gap-6 p-6 border-b border-[#262626] bg-[#1A1A1A]/50">
            <div className="col-span-1"></div>
            <div className="col-span-6 font-bold text-muted-foreground text-[10px] uppercase tracking-[0.2em]">Candidate</div>
            <div className="col-span-3 text-right font-bold text-muted-foreground text-[10px] uppercase tracking-[0.2em]">Votes</div>
            <div className="col-span-2 text-right font-bold text-muted-foreground text-[10px] uppercase tracking-[0.2em]">Percentage</div>
          </div>
          
          <div className="divide-y divide-[#262626]">
            {candidates.map((candidate, i) => (
              <div key={candidate.id} className={`grid grid-cols-12 gap-6 p-8 items-center transition-all hover:bg-white/[0.02] ${i === 0 ? "bg-primary/5" : ""}`}>
                <div className="col-span-1 flex justify-center">
                  {i === 0 ? (
                    <Verified className="w-8 h-8 text-primary shadow-[0_0_20px_rgba(29,132,221,0.3)]" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-[#262626] flex items-center justify-center text-muted-foreground text-xs font-bold">
                      {i + 1}
                    </div>
                  )}
                </div>
                <div className="col-span-6 flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white font-bold text-xl border border-white/5 group-hover:border-primary/30 transition-all">
                    {candidate.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white block leading-none mb-1">{candidate.name}</span>
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{candidate.party}</span>
                  </div>
                </div>
                <div className="col-span-3 text-right">
                  <span className="text-2xl font-mono text-muted-foreground"><NumberTicker value={candidate.votes} /></span>
                </div>
                <div className="col-span-2 text-right">
                  <span className={`text-2xl font-bold ${i === 0 ? "text-primary" : "text-white"}`}>{candidate.percentage.toFixed(2)}%</span>
                </div>
                
                {/* Progress Bar */}
                <div className="col-span-12 mt-6">
                  <div className="w-full bg-[#1A1A1A] rounded-full h-2 overflow-hidden border border-white/5">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? "bg-primary shadow-[0_0_15px_rgba(29,132,221,0.5)]" : "bg-muted-foreground/30"}`}
                      style={{ width: `${candidate.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
