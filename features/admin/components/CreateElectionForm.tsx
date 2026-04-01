"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createElection, addCandidate } from "@/features/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export function CreateElectionForm({ adminIds }: { adminIds: number[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<{ name: string; party: string }[]>([
    { name: "", party: "" },
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const threshold = parseInt(formData.get("threshold") as string, 10);
    const totalShares = parseInt(formData.get("totalShares") as string, 10);
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;

    try {
      const result = await createElection({
        title,
        description,
        threshold,
        totalShares,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        adminIds,
      });

      const validCandidates = candidates.filter((c) => c.name.trim());
      for (let i = 0; i < validCandidates.length; i++) {
        await addCandidate(result.election.id.toString(), {
          name: validCandidates[i].name,
          party: validCandidates[i].party || undefined,
          position: i,
        });
      }

      router.push(`/admin/elections/${result.election.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create election");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCandidateRow = () => {
    setCandidates([...candidates, { name: "", party: "" }]);
  };

  const updateCandidate = (index: number, field: "name" | "party", value: string) => {
    const updated = [...candidates];
    updated[index][field] = value;
    setCandidates(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Election</CardTitle>
        <CardDescription>Configure the election and run the key ceremony</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="threshold">Threshold (t)</Label>
              <Input id="threshold" name="threshold" type="number" min={1} defaultValue={2} required />
            </div>
            <div>
              <Label htmlFor="totalShares">Total Shares (n)</Label>
              <Input id="totalShares" name="totalShares" type="number" min={1} defaultValue={3} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" name="startTime" type="datetime-local" />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" name="endTime" type="datetime-local" />
            </div>
          </div>

          <div>
            <Label>Candidates</Label>
            {candidates.map((c, i) => (
              <div key={i} className="flex gap-2 mt-2">
                <Input
                  placeholder="Name"
                  value={c.name}
                  onChange={(e) => updateCandidate(i, "name", e.target.value)}
                />
                <Input
                  placeholder="Party (optional)"
                  value={c.party}
                  onChange={(e) => updateCandidate(i, "party", e.target.value)}
                />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addCandidateRow} className="mt-2">
              Add Candidate
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Election"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
