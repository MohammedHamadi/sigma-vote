'use client';

import React from 'react';
import { User, ShieldCheck, Lock, EyeOff, Key, ArrowRight, UserCheck, Server } from 'lucide-react';

export function BlindSignatureDiagram() {
  return (
    <div className="my-8 w-full rounded-2xl border border-white/10 bg-[#111113]/50 p-8 backdrop-blur-xl">
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Voter side */}
          <div className="flex flex-col gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Voter (Client)</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
                <EyeOff className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-mono text-white">m' = m · rᵉ mod N</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic">Message is "blinded" with random factor r</p>
            </div>
          </div>

          {/* Authority side */}
          <div className="flex flex-col gap-6 p-6 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-primary" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Authority (Server)</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <Key className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-mono text-white">s' = (m')ᵈ mod N</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic">Signs blinded message without seeing content</p>
            </div>
          </div>

          {/* Connector Arrow */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-background border border-white/10 z-10">
            <ArrowRight className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Final Result */}
        <div className="flex flex-col items-center gap-4 border-t border-white/10 pt-8">
           <div className="flex items-center gap-4 bg-success/10 border border-success/20 px-6 py-3 rounded-full">
              <ShieldCheck className="w-5 h-5 text-success" />
              <span className="text-xs font-mono text-white font-bold">s = s' · r⁻¹ = mᵈ mod N</span>
           </div>
           <p className="text-[10px] text-muted-foreground max-w-sm text-center">
             Voter unblinds the signature locally. Result is a valid RSA signature on the original message m.
           </p>
        </div>
      </div>
    </div>
  );
}
