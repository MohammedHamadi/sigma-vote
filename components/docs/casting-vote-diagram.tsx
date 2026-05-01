"use client";

import React from "react";
import {
  MousePointer2,
  Lock,
  ShieldCheck,
  Send,
  CheckCircle2,
  FileJson,
  FileSignature,
} from "lucide-react";

export function CastingVoteDiagram() {
  return (
    <div className="my-8 w-full rounded-2xl border border-white/10 bg-[#111113]/50 p-8 backdrop-blur-xl">
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Step 1: Client Choice */}
        <div className="flex flex-col items-center gap-4 text-center w-full md:w-1/4">
          <div className="p-4 rounded-full bg-white/5 border border-white/10 relative">
            <MousePointer2 className="w-6 h-6 text-white" />
            <div className="absolute -top-2 -right-2 bg-primary rounded-full px-2 py-0.5 text-[8px] font-bold">
              1
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-1">
              Select Candidate
            </h4>
            <p className="text-[10px] text-muted-foreground">
              Voter makes choice in UI
            </p>
          </div>
        </div>

        {/* Step 2: Encryption */}
        <div className="flex flex-col items-center gap-4 text-center w-full md:w-1/4">
          <div className="p-4 rounded-full bg-primary/10 border border-primary/20 relative">
            <Lock className="w-6 h-6 text-primary" />
            <div className="absolute -top-2 -right-2 bg-primary rounded-full px-2 py-0.5 text-[8px] font-bold">
              2
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-1">
              Encrypt & Prove
            </h4>
            <p className="text-[10px] text-muted-foreground">
              Paillier encryption + ZKPs generated locally
            </p>
          </div>
        </div>

        {/* Step 3: Transmit */}
        <div className="flex flex-col items-center gap-4 text-center w-full md:w-1/4">
          <div className="p-4 rounded-full bg-white/5 border border-white/10 relative">
            <Send className="w-6 h-6 text-muted-foreground" />
            <div className="absolute -top-2 -right-2 bg-primary rounded-full px-2 py-0.5 text-[8px] font-bold">
              3
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-1">
              Submit Payload
            </h4>
            <p className="text-[10px] text-muted-foreground">
              Encrypted ballot + Credentials sent via API
            </p>
          </div>
        </div>

        {/* Step 4: Verification */}
        <div className="flex flex-col items-center gap-4 text-center w-full md:w-1/4">
          <div className="p-4 rounded-full bg-success/10 border border-success/20 relative">
            <CheckCircle2 className="w-6 h-6 text-success" />
            <div className="absolute -top-2 -right-2 bg-primary rounded-full px-2 py-0.5 text-[8px] font-bold">
              4
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-1">
              Server Verification
            </h4>
            <p className="text-[10px] text-muted-foreground">
              ZKP validated + Ballot recorded
            </p>
          </div>
        </div>


      </div>

      <div className="mt-12 p-4 rounded-xl bg-primary/5 border border-primary/10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <FileJson className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-mono text-muted-foreground">
            Payload: &#123; ciphertexts: [], proofs: [], token: "" &#125;
          </span>
        </div>
        <div className="flex items-center gap-3">
          <FileSignature className="w-4 h-4 text-success" />
          <span className="text-[10px] font-mono text-muted-foreground">
            Result: Receipt hash provided for verification
          </span>
        </div>
      </div>
    </div>
  );
}
