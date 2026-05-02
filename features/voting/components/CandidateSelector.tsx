"use client";

import type { Candidate } from "@/db/schema";
import { CheckCircle2 } from "lucide-react";

export function CandidateSelector({
  candidates,
  selected,
  onSelect,
}: {
  candidates: Candidate[];
  selected: Candidate | null;
  onSelect: (candidate: Candidate) => void;
}) {
  return (
    <div className="grid gap-4">
      {candidates.map((candidate) => {
        const isSelected = selected?.id === candidate.id;
        const initials = candidate.name.split(" ").map(n => n[0]).join("").toUpperCase();
        
        return (
          <div 
            key={candidate.id} 
            className={`bg-[#121212] border rounded-xl p-6 flex items-center justify-between cursor-pointer transition-all relative overflow-hidden group ${
              isSelected ? "border-primary bg-[#151515] shadow-[0_0_30px_rgba(29,132,221,0.1)]" : "border-[#262626] hover:border-primary/30"
            }`}
            onClick={() => onSelect(candidate)}
          >
            <div className={`absolute inset-0 bg-primary/5 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}></div>
            
            <div className="flex items-center gap-6 relative z-10">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all ${
                isSelected ? "bg-primary text-primary-foreground scale-110 shadow-[0_0_20px_rgba(29,132,221,0.4)]" : "bg-white/5 text-muted-foreground"
              }`}>
                {initials}
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-1 leading-tight">{candidate.name}</h4>
                {candidate.party && (
                  <p className="text-muted-foreground text-sm font-mono tracking-tighter uppercase">{candidate.party}</p>
                )}
              </div>
            </div>
            
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center relative z-10 transition-all ${
              isSelected ? "border-primary bg-primary" : "border-[#262626]"
            }`}>
              {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
