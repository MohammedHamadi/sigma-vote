"use client";

import type { Candidate } from "@/db/schema";
import { ShieldCheck } from "lucide-react";

export function VoteConfirmation({ candidate }: { candidate: Candidate }) {
  const initials = candidate.name.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-2xl p-10 text-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-primary/5 opacity-40"></div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-8 font-serif">Review Your Selection</h3>
        
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-3xl shadow-[0_0_30px_rgba(29,132,221,0.3)]">
            {initials}
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">{candidate.name}</div>
            <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest">{candidate.party}</div>
          </div>
        </div>

        <div className="p-4 bg-success/5 border border-success/20 rounded-xl inline-flex items-center gap-3 text-success">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-sm font-bold">Ready for Cryptographic Sealing</span>
        </div>
        
        <p className="text-muted-foreground text-sm mt-8 max-w-sm mx-auto leading-relaxed">
          Upon proceeding, your selection will be homomorphically encrypted and paired with a Zero-Knowledge Proof.
        </p>
      </div>
    </div>
  );
}
