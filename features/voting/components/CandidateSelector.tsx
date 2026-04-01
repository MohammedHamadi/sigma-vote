"use client";

import type { Candidate } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CandidateSelector({
  candidates,
  selected,
  onSelect,
}: {
  candidates: Candidate[];
  selected: Candidate | null;
  onSelect: (candidate: Candidate) => void;
}) {
  return (
    <div className="grid gap-3">
      {candidates.map((candidate) => (
        <Card
          key={candidate.id}
          className={cn(
            "cursor-pointer transition-colors hover:border-primary",
            selected?.id === candidate.id && "border-primary bg-primary/5"
          )}
          onClick={() => onSelect(candidate)}
        >
          <CardHeader>
            <CardTitle>{candidate.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {candidate.party && (
              <p className="text-sm text-muted-foreground">{candidate.party}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
