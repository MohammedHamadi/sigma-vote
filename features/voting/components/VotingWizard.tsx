"use client";

import { useState } from "react";
import type { Candidate } from "@/db/schema";
import { CandidateSelector } from "./CandidateSelector";
import { VoteProgress } from "./VoteProgress";
import { VoteConfirmation } from "./VoteConfirmation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = ["Select Candidate", "Review", "Submit"];

export function VotingWizard({
  electionId,
  candidates,
}: {
  electionId: number;
  candidates: Candidate[];
}) {
  const [step, setStep] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCandidate) return;
    setIsSubmitting(true);
    try {
      const ciphertexts = Array(candidates.length).fill("0");
      ciphertexts[selectedCandidate.position] = "1";

      const response = await fetch(`/api/vote/${electionId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: "0",
          signature: "0",
          ciphertexts,
          proofs: [],
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
          <p className="text-lg font-semibold">Vote submitted successfully!</p>
          <p className="text-muted-foreground mt-2">Your vote has been recorded anonymously.</p>
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
            <CardContent className="pt-6 text-center">
              <p className="mb-4">Ready to submit your encrypted ballot?</p>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Vote"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack} disabled={step === 0}>
          Back
        </Button>
        {step < STEPS.length - 1 && (
          <Button onClick={handleNext} disabled={!selectedCandidate && step === 0}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
