"use client";

import { useState } from "react";
import type { Candidate } from "@/db/schema";
import { CandidateSelector } from "./CandidateSelector";
import { VoteProgress } from "./VoteProgress";
import { VoteConfirmation } from "./VoteConfirmation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { encryptBallot, EncryptedBallotPackage } from "@/lib/crypto/ballot-client";
import { Loader2 } from "lucide-react";

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
      setStep(2); // Show encrypting step
      
      // Yield to let UI update, then encrypt
      setTimeout(async () => {
        try {
          if (!selectedCandidate) throw new Error("No candidate selected");
          
          const payload = await encryptBallot(
            selectedCandidate.position,
            candidates.length,
            { n: paillierPubN, g: paillierPubG }
          );
          
          setEncryptedPayload(payload);
          setStep(3); // Move to Submit
        } catch (error) {
          alert(error instanceof Error ? error.message : "Encryption failed");
          setStep(1); // Go back to review on failure
        }
      }, 50);
    } else if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    // If we're on submit (3), go back to review (1) and discard encryption
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
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg font-semibold text-success">Vote submitted successfully!</p>
          <p className="text-muted-foreground mt-2">Your vote has been recorded anonymously and encrypted.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <VoteProgress currentStep={step} totalSteps={STEPS.length} steps={STEPS} />
      <div className="mt-6">
        {step === 0 && (
          <CandidateSelector
            candidates={candidates}
            selected={selectedCandidate}
            onSelect={handleSelect}
          />
        )}
        {step === 1 && selectedCandidate && <VoteConfirmation candidate={selectedCandidate} />}
        {step === 2 && (
          <Card>
            <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div>
                <p className="font-semibold text-lg">Encrypting Ballot & Generating Proofs</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                  Generating Zero-Knowledge Proofs to ensure your vote is mathematically valid without revealing your choice. This usually takes a few seconds...
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        {step === 3 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="mb-2 font-semibold">Ready to cast your secure ballot?</p>
              <p className="text-sm text-muted-foreground mb-6">
                Your vote is fully encrypted and proven valid.
              </p>
              <Button onClick={handleSubmit} disabled={isSubmitting} size="lg" className="px-8">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting to Blockchain...
                  </>
                ) : (
                  "Cast Ballot"
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={handleBack} 
          disabled={step === 0 || step === 2 || isSubmitting}
        >
          Back
        </Button>
        {step < STEPS.length - 1 && step !== 2 && (
          <Button 
            onClick={handleNext} 
            disabled={(!selectedCandidate && step === 0) || isSubmitting}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
