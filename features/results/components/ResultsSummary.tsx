import { TrendingUp, Users, ShieldCheck, Verified } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          <NumberTicker value={results.ballotCount} />
        </div>
        <div className="mt-auto pt-6 border-t border-[#262626] relative z-10">
          <div className="flex items-center gap-3 text-success font-bold text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_10px_rgba(var(--success),0.5)]"></span> 
            100% COUNTED & AUDITED
          </div>
        </div>
      </div>

      {/* Leading Candidate Card */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-10 flex flex-col gap-6 hover:border-success/50 hover:bg-[#151515] transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4 text-success">
          <ShieldCheck className="w-40 h-40" />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-success/10 rounded-xl text-success">
            <Verified className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-muted-foreground text-sm uppercase tracking-widest">Current Leader</h2>
        </div>
        <div className="mt-4 relative z-10">
          <div className="text-4xl font-bold text-white font-serif mb-1 leading-tight">
            {winner ? winner.name : "No Votes Yet"}
          </div>
          <div className="text-success font-bold text-sm tracking-widest uppercase opacity-70">
            {winner && winner.votes > 0 ? `${winner.votes} Official Votes` : "Awaiting Tally"}
          </div>
        </div>
        <div className="mt-auto pt-6 border-t border-[#262626] relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
             {winner && winner.party ? winner.party : "Independent"}
          </div>
        </div>
      </div>
    </div>
  );
}
