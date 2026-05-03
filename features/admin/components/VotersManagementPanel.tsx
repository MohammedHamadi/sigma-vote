"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Voter } from "@/db/schema";
import { updateVoterRole } from "@/features/admin/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function VotersManagementPanel({ voters }: { voters: Voter[] }) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = async (voterId: number, newRole: string) => {
    setUpdatingId(voterId);
    setError(null);
    try {
      await updateVoterRole(voterId.toString(), newRole);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const votersList = voters.sort((a, b) => {
    // Sort by role (admin first), then by name
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Voters ({voters.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="text-sm text-destructive mb-4">{error}</p>
        )}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {votersList.map((voter) => (
                <TableRow key={voter.id}>
                  <TableCell className="font-medium">{voter.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {voter.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={voter.role === "admin" ? "default" : "secondary"}
                    >
                      {voter.role || "voter"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updatingId === voter.id}
                      onClick={() =>
                        handleRoleChange(
                          voter.id,
                          voter.role === "admin" ? "voter" : "admin"
                        )
                      }
                    >
                      {updatingId === voter.id
                        ? "Updating..."
                        : voter.role === "admin"
                        ? "Demote to Voter"
                        : "Promote to Admin"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
