'use client';

import React from 'react';
import { Database, X, Calculator, Unlock, BarChart3, ShieldCheck, ChevronRight } from 'lucide-react';

export function TallyingDiagram() {
  return (
    <div className="my-8 w-full rounded-2xl border border-white/10 bg-[#111113]/50 p-8 backdrop-blur-xl">
      <div className="flex flex-col gap-10">
        
        {/* Step 1: Accumulation */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 w-32">
            <Database className="w-6 h-6 text-muted-foreground" />
            <span className="text-[9px] font-mono uppercase tracking-widest">Storage</span>
          </div>
          
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white">Aggregating Ballots</span>
              <Calculator className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-primary w-2/3" />
            </div>
            <p className="text-[9px] text-muted-foreground">Server multiplies ciphertexts: Product = C₁ * C₂ * ... * Cₙ</p>
          </div>
        </div>

        <div className="flex justify-center">
           <ChevronRight className="w-6 h-6 text-muted-foreground rotate-90" />
        </div>

        {/* Step 2: Decryption */}
        <div className="flex items-center gap-6">
           <div className="flex-1 text-right flex flex-col gap-1">
              <h4 className="text-xs font-bold text-white">Threshold Decryption</h4>
              <p className="text-[10px] text-muted-foreground italic">Private Key applied only to the final product</p>
           </div>
           
           <div className="p-4 rounded-xl bg-primary/20 border border-primary/30 relative">
             <Unlock className="w-8 h-8 text-primary" />
             <div className="absolute inset-0 bg-primary/20 blur-xl -z-10" />
           </div>
           
           <div className="flex-1 text-left flex flex-col gap-1">
              <h4 className="text-xs font-bold text-success">Result Extraction</h4>
              <p className="text-[10px] text-muted-foreground">Plaintext totals: [Cand A: 45, Cand B: 32...]</p>
           </div>
        </div>

        {/* Final State */}
        <div className="mt-4 p-4 rounded-xl bg-success/5 border border-success/10 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <BarChart3 className="w-5 h-5 text-success" />
             <span className="text-sm font-bold text-white tracking-tight">Public Results Published</span>
           </div>
           <ShieldCheck className="w-5 h-5 text-success" />
        </div>
      </div>
    </div>
  );
}
