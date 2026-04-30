"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShieldCheck, CalendarCheck, Users } from "lucide-react";

export default function ResultsDashboard() {
  const electionTheme = {
    title: "General Assembly Elections 2026",
    status: "tallied",
    totalVotes: 14205,
    candidates: [
      { id: "c1", name: "Alice Johnson", party: "Progressive Technology Party", votes: 6842, percentage: 48.16 },
      { id: "c2", name: "Bob Smith", party: "Conservative Heritage Group", votes: 5120, percentage: 36.04 },
      { id: "c3", name: "Charlie Davis", party: "Independent Consensus", votes: 2243, percentage: 15.79 },
    ]
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-12 lg:px-20 max-w-7xl">
      <div className="flex flex-col gap-2 mb-10">
        <div className="inline-flex items-center rounded-full border border-success/30 bg-success/10 px-3 py-1 text-sm text-success max-w-fit mb-4">
          <ShieldCheck className="mr-2 h-4 w-4" />
          <span>Homomorphic Tally Complete & Verified</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Election Results</h1>
        <p className="text-muted-foreground text-xl">{electionTheme.title}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Votes Cast</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              <NumberTicker value={electionTheme.totalVotes} />
            </div>
            <p className="text-sm text-muted-foreground">+20.1% from last election</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Cryptographic Status</CardTitle>
            <ShieldCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-success mt-1">Zero-Knowledge Validated</div>
            <p className="text-sm text-muted-foreground mt-1">All proofs mathematically verified.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Tally Timestamp</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold mt-1">2026-11-03 21:05 UTC</div>
            <p className="text-sm text-muted-foreground mt-1">Decryption key combined successfully.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Final Tally Breakdown</CardTitle>
          <CardDescription>
            Results are decrypted and tallied directly from the blockchain state.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Party / Affiliation</TableHead>
                <TableHead className="text-right text-primary font-bold">Votes</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {electionTheme.candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium text-base">{candidate.name}</TableCell>
                  <TableCell className="text-muted-foreground text-base">{candidate.party}</TableCell>
                  <TableCell className="text-right font-bold text-primary text-lg">
                    <NumberTicker value={candidate.votes} />
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {candidate.percentage.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
