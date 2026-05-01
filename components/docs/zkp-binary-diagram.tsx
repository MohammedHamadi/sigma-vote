'use client';

import React from 'react';
import { ToggleLeft, ToggleRight, CheckCircle2, ShieldQuestion, Fingerprint, Activity } from 'lucide-react';

export function ZKPBinaryDiagram() {
  return (
    <div className="my-8 w-full rounded-2xl border border-white/10 bg-[#111113]/50 p-8 backdrop-blur-xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
        {/* Scenario 0 */}
        <div className="flex flex-col items-center p-6 rounded-xl bg-white/5 border border-white/10 relative opacity-80 hover:opacity-100 transition-opacity">
          <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-mono text-muted-foreground uppercase">Case A</div>
          <ToggleLeft className="w-12 h-12 text-muted-foreground mb-4" />
          <div className="text-xl font-bold text-white mb-1">Vote: 0</div>
          <div className="text-[10px] font-mono text-primary/80 mb-4">C = g⁰ · rᴺ mod N²</div>
          
          <div className="w-full flex flex-col gap-2">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-primary w-3/4 animate-pulse" />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-muted-foreground uppercase">
              <span>Real Proof</span>
              <span>Simulation</span>
            </div>
          </div>
        </div>

        {/* Scenario 1 */}
        <div className="flex flex-col items-center p-6 rounded-xl bg-primary/10 border border-primary/20 relative">
          <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-primary/20 border border-primary/30 text-[10px] font-mono text-primary uppercase">Case B</div>
          <ToggleRight className="w-12 h-12 text-primary mb-4" />
          <div className="text-xl font-bold text-white mb-1">Vote: 1</div>
          <div className="text-[10px] font-mono text-primary/80 mb-4">C = g¹ · rᴺ mod N²</div>
          
          <div className="w-full flex flex-col gap-2">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-primary w-3/4" />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-muted-foreground uppercase">
              <span>Simulation</span>
              <span>Real Proof</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Overlay */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-success/20 border border-success/30">
          <ShieldQuestion className="w-5 h-5 text-success" />
          <span className="text-sm font-mono text-white">Verifier: Is it 0 or 1?</span>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2">
             <Fingerprint className="w-4 h-4 text-primary" />
             <span className="text-[10px] text-muted-foreground">Zero Knowledge</span>
           </div>
           <div className="flex items-center gap-2">
             <Activity className="w-4 h-4 text-success" />
             <span className="text-[10px] text-muted-foreground">Interactive (Fiat-Shamir)</span>
           </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-[11px] text-muted-foreground max-w-md mx-auto">
          The voter provides two partial proofs. One is a real mathematical response, the other is a carefully crafted simulation. The verifier can see both are valid but cannot tell which one is the "real" one.
        </p>
      </div>
    </div>
  );
}
