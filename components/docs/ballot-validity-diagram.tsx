'use client';

import React from 'react';
import { LayoutList, Plus, Equal, CheckCircle2, AlertCircle, Calculator } from 'lucide-react';

export function BallotValidityDiagram() {
  return (
    <div className="my-8 w-full rounded-2xl border border-white/10 bg-[#111113]/50 p-6 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-8">
        
        {/* Candidates List */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          {[
            { name: 'Alice', vote: 1, color: 'text-primary' },
            { name: 'Bob', vote: 0, color: 'text-muted-foreground' },
            { name: 'Charlie', vote: 0, color: 'text-muted-foreground' },
            { name: 'Dave', vote: 0, color: 'text-muted-foreground' },
          ].map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2">
              <span className={`text-[10px] font-mono ${c.color}`}>{c.name}</span>
              <div className={`text-xs font-bold ${c.color}`}>Ciphertext C{i+1}</div>
              <div className="text-[9px] text-muted-foreground font-mono">m = {c.vote}</div>
            </div>
          ))}
        </div>

        {/* The Math Operation */}
        <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-2xl border border-primary/10">
          <Calculator className="w-5 h-5 text-primary" />
          <div className="flex items-center gap-2 font-mono text-sm">
             <span className="text-white">∏ Cᵢ</span>
             <Plus className="w-3 h-3 text-muted-foreground" />
             <span className="text-muted-foreground">Randomness Constraint</span>
             <Equal className="w-3 h-3 text-white" />
             <span className="text-success font-bold">Valid Ballot?</span>
          </div>
        </div>

        {/* Result Verification */}
        <div className="w-full max-w-md p-4 rounded-xl bg-success/10 border border-success/20 flex items-center justify-between">
           <div className="flex flex-col gap-1">
             <span className="text-[10px] font-mono text-success uppercase font-bold tracking-wider">Server Verification</span>
             <span className="text-xs font-mono text-white italic">Result ≡ g¹ mod N²</span>
           </div>
           <CheckCircle2 className="w-6 h-6 text-success" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-[11px]">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex gap-3">
             <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
             <p className="text-muted-foreground">Ensures the voter selected exactly **one** candidate.</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex gap-3">
             <AlertCircle className="w-4 h-4 text-primary shrink-0" />
             <p className="text-muted-foreground">Prevents "Over-voting" or blank ballots without revealing the selection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
