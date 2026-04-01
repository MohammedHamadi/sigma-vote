"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Election, Candidate } from "@/db/schema";
import { openElection, closeElection, addCandidate } from "@/features/admin/actions";
import { ElectionStatus } from "@/features/elections/components/ElectionStatus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ManageElectionPanel({
  election,
  candidates,
}: {
  election: Election;
  candidates: Candidate[];
}) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCandidate, setNewCandidate] = useState({ name: "", party: "" });

  const handleStatusChange = async (action: "open" | "close") => {
    setIsUpdating(true);
    setError(null);
    try {
      if (action === "open") {
        await openElection(election.id.toString());
      } else {
        await closeElection(election.id.toString());
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.name.trim()) return;
    try {
      await addCandidate(election.id.toString(), {
        name: newCandidate.name,
        party: newCandidate.party || undefined,
        position: candidates.length,
      });
      setNewCandidate({ name: "", party: "" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add candidate");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{election.title}</CardTitle>
          <ElectionStatus status={election.status ?? "SETUP"} />
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{election.description}</p>
          <div className="flex gap-2 flex-wrap">
            {election.status === "SETUP" && (
              <Button onClick={() => handleStatusChange("open")} disabled={isUpdating}>
                Open Election
              </Button>
            )}
            {election.status === "OPEN" && (
              <Button variant="destructive" onClick={() => handleStatusChange("close")} disabled={isUpdating}>
                Close Election
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push(`/admin/tally/${election.id}`)}>
              Go to Tally
            </Button>
          </div>
          {error && <p className="text-sm text-destructive mt-3">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Candidates ({candidates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            {candidates.map((c) => (
              <div key={c.id} className="flex justify-between items-center p-2 border rounded">
                <span>{c.name}</span>
                {c.party && <Badge variant="outline">{c.party}</Badge>}
              </div>
            ))}
          </div>
          {election.status === "SETUP" && (
            <form onSubmit={handleAddCandidate} className="flex gap-2">
              <Input
                placeholder="Name"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
              />
              <Input
                placeholder="Party (optional)"
                value={newCandidate.party}
                onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
              />
              <Button type="submit">Add</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
