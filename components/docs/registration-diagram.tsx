'use client';

import React from 'react';
import { User, Server, Lock, Key, EyeOff, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

export function RegistrationDiagram() {
  return (
    <div className="my-8 w-full rounded-2xl border border-white/10 bg-[#111113]/50 p-8 backdrop-blur-xl">
      <div className="flex flex-col gap-12">
        {/* Step 1 & 2 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center gap-3 w-40">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <UserCheck className="w-6 h-6 text-primary" />
            </div>
            <span className="text-[10px] font-mono text-center">1. Authenticate (OAuth/Pwd)</span>
          </div>
          
          <ArrowRight className="hidden md:block w-5 h-5 text-muted-foreground" />
          
          <div className="flex flex-col items-center gap-3 w-40">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <EyeOff className="w-6 h-6 text-primary" />
            </div>
            <span className="text-[10px] font-mono text-center">2. Generate & Blind Token</span>
          </div>
          
          <ArrowRight className="hidden md:block w-5 h-5 text-muted-foreground" />

          <div className="flex flex-col items-center gap-3 w-40">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <Server className="w-6 h-6 text-success" />
            </div>
            <span className="text-[10px] font-mono text-center">3. Authority Signs Blinded token</span>
          </div>
        </div>

        {/* Path Back */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
           <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <Key className="w-4 h-4 text-success" />
                 <span className="text-[10px] font-mono">Unblind Signature</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-primary" />
                 <span className="text-[10px] font-mono font-bold text-white">Valid Anonymous Credential</span>
              </div>
           </div>
        </div>
      </div>
      
      <div className="mt-8 text-center border-t border-white/5 pt-4">
        <p className="text-[11px] text-muted-foreground italic">
          Result: The voter holds a signature that the server recognizes, but the server doesn't know which voter it belongs to.
        </p>
      </div>
    </div>
  );
}
