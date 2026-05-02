import type { Candidate } from "@/db/schema";

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-xl p-4 flex items-center justify-between hover:border-primary/50 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg group-hover:scale-105 transition-transform">
          {initials}
        </div>
        <div>
          <h4 className="text-white font-bold text-lg leading-tight">{candidate.name}</h4>
          {candidate.party && (
            <p className="text-muted-foreground text-sm font-mono tracking-tighter uppercase">{candidate.party}</p>
          )}
        </div>
      </div>
      <div className="hidden sm:block">
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
          NOMINEE
        </div>
      </div>
    </div>
  );
}

