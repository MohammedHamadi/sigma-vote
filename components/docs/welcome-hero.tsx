'use client';

import React from 'react';
import { Shield, Lock, Eye, CheckCircle, Database, Cpu, Globe, ArrowRight } from 'lucide-react';

export function WelcomeHero() {
  return (
    <div className="relative my-12 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-12 shadow-2xl">
      <div className="absolute top-0 right-0 -m-12 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 border border-primary/20 mb-6">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">Secure by Design</span>
        </div>
        
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          The Future of <span className="text-primary">Verifiable</span> Voting.
        </h1>
        
        <p className="mb-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          SigmaVote is a next-generation electronic voting prototype that leverages state-of-the-art cryptography to guarantee absolute privacy and mathematical integrity for every ballot cast.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors">
            <div className="mb-4 rounded-xl bg-primary/10 p-2.5 w-fit">
               <Eye className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-bold text-white mb-2">Total Privacy</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Homomorphic encryption ensures that your vote remains secret even during the counting process.</p>
          </div>
          
          <div className="group rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors">
            <div className="mb-4 rounded-xl bg-success/10 p-2.5 w-fit">
               <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <h3 className="font-bold text-white mb-2">Immutable Integrity</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Zero-Knowledge Proofs prevent malicious actors from submitting invalid ballots or tampering with results.</p>
          </div>

          <div className="group rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors">
            <div className="mb-4 rounded-xl bg-purple-accent/10 p-2.5 w-fit">
               <Lock className="h-5 w-5 text-purple-accent" />
            </div>
            <h3 className="font-bold text-white mb-2">Voter Anonymity</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Blind signatures decouple your identity from your ballot, providing true cryptographic anonymity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
