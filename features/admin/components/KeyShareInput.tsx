"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitKeyShare } from "@/features/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function KeyShareInput({
  electionId,
  adminId,
}: {
  electionId: number;
  adminId: number;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ thresholdMet: boolean; submittedCount: number; threshold: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await submitKeyShare(electionId.toString(), adminId.toString());
      setResult({ thresholdMet: res.thresholdMet, submittedCount: res.submittedCount, threshold: res.threshold });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit key share");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Key Share</CardTitle>
        <CardDescription>Submit your Shamir secret share for threshold decryption</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
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
