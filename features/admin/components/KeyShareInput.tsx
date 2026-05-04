"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitKeyShare } from "@/features/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function KeyShareInput({
  electionId,
  adminId,
}: {
  electionId: number;
  adminId: number;
}) {
  const router = useRouter();
  const [shareValue, setShareValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    thresholdMet: boolean;
    submittedCount: number;
    threshold: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await submitKeyShare(
        electionId.toString(),
        adminId.toString(),
        shareValue.trim(),
      );
      setResult({
        thresholdMet: res.thresholdMet,
        submittedCount: res.submittedCount,
        threshold: res.threshold,
      });
      setShareValue("");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit key share",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Key Share</CardTitle>
        <CardDescription>
          Paste your secret share value received via email to verify and submit
          it
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="shareValue">Your Secret Share</Label>
          <Input
            id="shareValue"
            type="password"
            value={shareValue}
            onChange={(e) => setShareValue(e.target.value)}
            placeholder="Paste your secret share here..."
            disabled={isSubmitting}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !shareValue.trim()}
        >
          {isSubmitting ? "Submitting..." : "Submit My Key Share"}
        </Button>
        {result && (
          <p className="mt-3 text-sm">
            Submitted: {result.submittedCount}/{result.threshold} required.
            {result.thresholdMet ? " Threshold met!" : ""}
          </p>
        )}
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
