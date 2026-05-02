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
    <div className="mb-10">
      <div className="flex justify-between mb-4">
        {steps.map((label, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
              i <= currentStep ? "bg-primary shadow-[0_0_10px_rgba(29,132,221,0.5)] scale-125" : "bg-[#262626]"
            }`}></div>
            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${
              i <= currentStep ? "text-primary" : "text-muted-foreground opacity-50"
            }`}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <Progress value={progress} className="h-1 bg-white/5" />
    </div>
  );
}
