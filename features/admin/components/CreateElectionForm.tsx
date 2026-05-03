"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createElection, addCandidate } from "@/features/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { Voter } from "@/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type IssuedShare = {
  adminId: number;
  shareX: string;
  shareY: string;
};

export function CreateElectionForm({ admins }: { admins: Voter[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<
    { name: string; party: string }[]
  >([{ name: "", party: "" }]);
  const [issued, setIssued] = useState<{
    electionId: number;
    shares: IssuedShare[];
  } | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [totalShares, setTotalShares] = useState(3);
  const [selectedAdminIds, setSelectedAdminIds] = useState<number[]>(
    admins.slice(0, 3).map((a) => a.id),
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const threshold = parseInt(formData.get("threshold") as string, 10);
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;

    const selectedIds = selectedAdminIds.slice(0, totalShares);
    if (selectedIds.length !== totalShares) {
      setError(`Please select exactly ${totalShares} admins for key shares`);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await createElection({
        title,
        description,
        threshold,
        totalShares,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        adminIds: selectedIds,
      });

      const validCandidates = candidates.filter((c) => c.name.trim());
      for (let i = 0; i < validCandidates.length; i++) {
        await addCandidate(result.election.id.toString(), {
          name: validCandidates[i].name,
          party: validCandidates[i].party || undefined,
          position: i,
        });
      }

      setIssued({
        electionId: result.election.id,
        shares: result.shares.map(
          (s: { adminId: number; shareX: string; shareY: string }) => ({
            adminId: s.adminId,
            shareX: s.shareX,
            shareY: s.shareY,
          }),
        ),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create election",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCandidateRow = () => {
    setCandidates([...candidates, { name: "", party: "" }]);
  };

  const updateCandidate = (
    index: number,
    field: "name" | "party",
    value: string,
  ) => {
    const updated = [...candidates];
    updated[index][field] = value;
    setCandidates(updated);
  };

  if (issued) {
    const sharesJson = JSON.stringify(issued, null, 2);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Key Ceremony Output</CardTitle>
          <CardDescription>
            Record each admin&apos;s share now. Shares are also stored in the
            database, but you should distribute them out-of-band so the
            threshold ceremony is not trivially server-side.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Admin ID</th>
                  <th className="px-3 py-2 text-left font-medium">Share x</th>
                  <th className="px-3 py-2 text-left font-medium">
                    Share y (truncated)
                  </th>
                </tr>
              </thead>
              <tbody>
                {issued.shares.map((s) => (
                  <tr key={s.adminId} className="border-t">
                    <td className="px-3 py-2 font-mono">{s.adminId}</td>
                    <td className="px-3 py-2 font-mono">{s.shareX}</td>
                    <td className="px-3 py-2 font-mono opacity-80">
                      {s.shareY.slice(0, 24)}…{s.shareY.slice(-8)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <details>
            <summary className="cursor-pointer text-sm font-medium">
              Show full JSON (copy & store securely)
            </summary>
            <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-muted/40 p-3 text-xs">
              {sharesJson}
            </pre>
          </details>

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              I have recorded all shares and understand the server still has
              copies for this prototype. In production, shares would be
              encrypted to each admin and erased server-side.
            </span>
          </label>

          <div className="flex gap-2">
            <Button
              onClick={() =>
                router.push(`/admin/elections/${issued.electionId}`)
              }
              disabled={!acknowledged}
            >
              Continue to Manage Election
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(sharesJson);
              }}
            >
              Copy JSON
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Election</CardTitle>
        <CardDescription>
          Configure the election and run the key ceremony
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold (t)</Label>
              <Input
                id="threshold"
                name="threshold"
                type="number"
                min={1}
                defaultValue={2}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalShares">Total Shares (n)</Label>
              <Input
                id="totalShares"
                name="totalShares"
                type="number"
                min={1}
                defaultValue={3}
                required
                onChange={(e) =>
                  setTotalShares(parseInt(e.target.value, 10) || 1)
                }
              />
            </div>
          </div>

          {admins.length > totalShares && (
            <div className="rounded-lg border p-4 space-y-3">
              <Label className="block">
                Select Admins for Key Shares ({selectedAdminIds.length}/
                {totalShares} selected)
              </Label>
              <p className="text-sm text-muted-foreground">
                There are {admins.length} admins but only {totalShares} shares.
                Select which admins will receive shares.
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {admins.map((admin) => (
                  <label
                    key={admin.id}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedAdminIds.includes(admin.id)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          if (selectedAdminIds.length < totalShares) {
                            setSelectedAdminIds([
                              ...selectedAdminIds,
                              admin.id,
                            ]);
                          }
                        } else {
                          setSelectedAdminIds(
                            selectedAdminIds.filter((id) => id !== admin.id),
                          );
                        }
                      }}
                    />
                    <span className="text-sm">
                      {admin.name} ({admin.email})
                    </span>
                  </label>
                ))}
              </div>
              {selectedAdminIds.length !== totalShares && (
                <p className="text-sm text-amber-500">
                  Please select exactly {totalShares} admin(s)
                </p>
              )}
            </div>
          )}

          {admins.length <= totalShares && (
            <div className="rounded-lg border p-4 space-y-2">
              <Label className="block">Key Share Holders</Label>
              <p className="text-sm text-muted-foreground">
                All {admins.length} admin(s) will receive key shares:
              </p>
              <div className="flex flex-wrap gap-2">
                {admins.map((admin) => (
                  <Badge key={admin.id} variant="secondary">
                    {admin.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" name="startTime" type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" name="endTime" type="datetime-local" />
            </div>
          </div>

          <div className="space-y-2">
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCandidateRow}
              className="mt-2"
            >
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
