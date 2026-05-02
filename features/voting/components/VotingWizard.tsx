"use client";

import { useState } from "react";
import type { Candidate } from "@/db/schema";
import { CandidateSelector } from "./CandidateSelector";
import { VoteProgress } from "./VoteProgress";
import { VoteConfirmation } from "./VoteConfirmation";
import { Button } from "@/components/ui/button";
import { encryptBallot, EncryptedBallotPackage } from "@/lib/crypto/ballot-client";
import { Loader2, ChevronRight, ChevronLeft, ShieldCheck, Lock, Database, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

const STEPS = ["Select Candidate", "Review", "Encrypting", "Submit"];

export function VotingWizard({
  electionId,
  candidates,
  token,
  signature,
  paillierPubN,
  paillierPubG,
}: {
  electionId: number;
  candidates: Candidate[];
  token: string;
  signature: string;
  paillierPubN: string;
  paillierPubG: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [encryptedPayload, setEncryptedPayload] = useState<EncryptedBallotPackage | null>(null);

  const handleSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      
      setTimeout(async () => {
        try {
          if (!selectedCandidate) throw new Error("No candidate selected");
          
          const payload = await encryptBallot(
            selectedCandidate.position,
            candidates.length,
            { n: paillierPubN, g: paillierPubG }
          );
          
          setEncryptedPayload(payload);
          setStep(3);
        } catch (error) {
          alert(error instanceof Error ? error.message : "Encryption failed");
          setStep(1);
        }
      }, 50);
    } else if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setEncryptedPayload(null);
      setStep(1);
    } else if (step > 0 && step !== 2) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCandidate || !encryptedPayload) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/vote/${electionId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          signature,
          ciphertexts: encryptedPayload.ciphertexts,
          proofs: encryptedPayload.proofs,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to submit vote");
      }

      setIsComplete(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to submit vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="bg-[#121212] border border-success/20 rounded-2xl p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-success/5 opacity-50"></div>
        <div className="relative z-10">
          <div className="mx-auto bg-success/10 p-5 rounded-full mb-8 w-fit text-success ring-1 ring-success/20">
            <ShieldCheck className="h-14 w-14" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 font-serif">Vote Recorded</h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
            Your encrypted ballot has been verified and stored in the anonymous registry.
          </p>
          <Button onClick={() => router.push(`/elections/${electionId}/results`)} className="bg-[#1D84DD] hover:bg-[#1D84DD]/90 text-white font-bold py-6 px-10 rounded-xl">
            View Live Results
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <VoteProgress currentStep={step} totalSteps={STEPS.length} steps={STEPS} />
      
      <div className="mt-12 min-h-[400px]">
        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6 font-serif px-1">Select Candidate</h2>
            <CandidateSelector
              candidates={candidates}
              selected={selectedCandidate}
              onSelect={handleSelect}
            />
          </div>
        )}
        
        {step === 1 && selectedCandidate && <VoteConfirmation candidate={selectedCandidate} />}
        
        {step === 2 && (
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-16 text-center">
             <div className="mx-auto bg-purple-accent/10 p-5 rounded-full mb-8 w-fit text-purple-accent animate-spin-slow">
              <Lock className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 font-serif">Cryptographic Sealing</h3>
            <p className="text-muted-foreground text-lg mb-2 max-w-sm mx-auto leading-relaxed">
              Applying Paillier homomorphic encryption and generating Zero-Knowledge Proofs...
            </p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse mt-10">
              NEVER LEAVING YOUR BROWSER UNENCRYPTED
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-12 text-center">
             <div className="mx-auto bg-primary/10 p-5 rounded-full mb-8 w-fit text-primary">
              <Database className="h-10 w-10" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4 font-serif">Final Submission</h3>
            <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
              Your ballot is fully encrypted and proven valid. Click below to submit to the anonymous registry.
            </p>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-[#1D84DD] hover:bg-[#1D84DD]/90 text-white font-bold py-8 text-xl rounded-xl shadow-[0_0_30px_rgba(29,132,221,0.2)]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Submitting to Blockchain...
                </>
              ) : (
                <>
                  Cast Secure Ballot <ChevronRight className="ml-2 h-6 w-6" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-12 pt-8 border-t border-[#262626]">
        <Button 
          variant="secondary" 
          onClick={handleBack} 
          disabled={step === 0 || step === 2 || isSubmitting}
          className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-6 px-8 rounded-xl"
        >
          <ChevronLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        
        {step < STEPS.length - 1 && step !== 2 && (
          <Button 
            onClick={handleNext} 
            disabled={(!selectedCandidate && step === 0) || isSubmitting}
            className={`font-bold py-6 px-10 rounded-xl transition-all ${
              (!selectedCandidate && step === 0) 
                ? "bg-white/5 text-muted-foreground border border-white/10" 
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            Next <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
