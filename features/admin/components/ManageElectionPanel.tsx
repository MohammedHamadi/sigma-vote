"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Election, Candidate } from "@/db/schema";
import {
  openElection,
  closeElection,
  addCandidate,
  deleteElectionAction,
  updateCandidate,
  deleteCandidateAction,
  reorderCandidates,
} from "@/features/admin/actions";
import { ElectionStatus } from "@/features/elections/components/ElectionStatus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUp, ArrowDown, Edit, Trash2, X, Check } from "lucide-react";

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
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(
    null,
  );
  const [editForm, setEditForm] = useState({ name: "", party: "" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const handleDeleteElection = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      await deleteElectionAction(election.id.toString());
      router.push("/admin/elections");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete election",
      );
      setIsUpdating(false);
    }
  };

  const handleDeleteCandidate = async (candidateId: number) => {
    try {
      await deleteCandidateAction(
        election.id.toString(),
        candidateId.toString(),
      );
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete candidate",
      );
    }
  };

  const startEditing = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setEditForm({ name: candidate.name, party: candidate.party || "" });
  };

  const cancelEditing = () => {
    setEditingCandidate(null);
    setEditForm({ name: "", party: "" });
  };

  const saveCandidateEdit = async () => {
    if (!editingCandidate || !editForm.name.trim()) return;
    try {
      await updateCandidate(
        election.id.toString(),
        editingCandidate.id.toString(),
        {
          name: editForm.name,
          party: editForm.party || undefined,
        },
      );
      setEditingCandidate(null);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update candidate",
      );
    }
  };

  const moveCandidate = async (index: number, direction: "up" | "down") => {
    if (election.status !== "SETUP") return;
    const newOrder = [...candidates];
    if (direction === "up" && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [
        newOrder[index - 1],
        newOrder[index],
      ];
    } else if (direction === "down" && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [
        newOrder[index + 1],
        newOrder[index],
      ];
    }
    try {
      await reorderCandidates(
        election.id.toString(),
        newOrder.map((c) => c.id),
      );
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reorder candidates",
      );
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
              <Button
                onClick={() => handleStatusChange("open")}
                disabled={isUpdating}
              >
                Open Election
              </Button>
            )}
            {election.status === "OPEN" && (
              <Button
                variant="destructive"
                onClick={() => handleStatusChange("close")}
                disabled={isUpdating}
              >
                Close Election
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/tally/${election.id}`)}
            >
              Go to Tally
            </Button>
            {election.status === "SETUP" && (
              <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogTrigger
                  render={
                    <Button variant="destructive" disabled={isUpdating}>
                      Delete Election
                    </Button>
                  }
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Election</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete "{election.title}"? This
                      action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteElection}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
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
            {candidates.map((c, index) => (
              <div
                key={c.id}
                className="flex justify-between items-center p-2 border rounded gap-2"
              >
                {editingCandidate?.id === c.id ? (
                  <div className="flex gap-2 flex-[3] min-w-0">
                    <Input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      placeholder="Name"
                      className="flex-1 min-w-0"
                    />
                    <Input
                      value={editForm.party}
                      onChange={(e) =>
                        setEditForm({ ...editForm, party: e.target.value })
                      }
                      placeholder="Party"
                      className="w-32 shrink-0"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-medium truncate">{c.name}</span>
                    {c.party && (
                      <Badge variant="outline" className="shrink-0">
                        {c.party}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1 shrink-0">
                  {election.status === "SETUP" && (
                    <>
                      {editingCandidate?.id === c.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={saveCandidateEdit}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={cancelEditing}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveCandidate(index, "up")}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveCandidate(index, "down")}
                            disabled={index === candidates.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(c)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCandidate(c.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {election.status === "SETUP" && (
            <form onSubmit={handleAddCandidate} className="flex gap-2">
              <Input
                placeholder="Name"
                value={newCandidate.name}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, name: e.target.value })
                }
              />
              <Input
                placeholder="Party (optional)"
                value={newCandidate.party}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, party: e.target.value })
                }
              />
              <Button type="submit">Add</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
