"use client";

import { Progress } from "@/components/ui/progress";

export function VoteProgress({
  currentStep,
  totalSteps,
  steps,
}: {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
        {steps.map((label, i) => (
          <span key={i} className={i <= currentStep ? "text-foreground font-medium" : ""}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
