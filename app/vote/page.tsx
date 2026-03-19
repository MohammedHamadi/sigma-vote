import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users } from "lucide-react";

const mockElections = [
  {
    id: "e-2026-gen",
    title: "General Assembly Elections 2026",
    status: "active",
    participants: 14205,
    deadline: "2026-11-03T20:00:00Z",
  },
  {
    id: "e-dao-prop-42",
    title: "DAO Proposal 42: Protocol Upgrade v3",
    status: "active",
    participants: 342,
    deadline: "2026-03-25T12:00:00Z",
  },
  {
    id: "e-board-25",
    title: "Board of Directors Q1",
    status: "upcoming",
    participants: 0,
    deadline: "2026-04-01T00:00:00Z",
  }
];

export default function VoteDashboard() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-12 lg:px-20 max-w-7xl">
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Active Elections</h1>
        <p className="text-muted-foreground">Select an election below to authenticate and cast your ballot securely.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockElections.map((election) => (
          <Card key={election.id} className="flex flex-col bg-[#111113] border-white/10 hover:border-white/20 transition-colors rounded-2xl overflow-hidden shadow-none !pb-0 !gap-0">
            <CardHeader className="p-6">
              <div className="flex justify-between items-center mb-4">
                <Badge variant={election.status === "active" ? "default" : "secondary"} className={election.status === "active" ? "bg-primary/20 text-primary hover:bg-primary/30" : ""}>
                  {election.status === "active" ? "Live" : "Upcoming"}
                </Badge>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                  <span>{election.participants.toLocaleString()}</span>
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <CardDescription className="text-muted-foreground mb-2 text-xs uppercase tracking-wider font-semibold">
                Closes {new Date(election.deadline).toLocaleDateString()}
              </CardDescription>
              <CardTitle className="leading-tight text-xl font-bold">{election.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 px-6 pb-6"></CardContent>
            <Link 
              href={election.status === "active" ? `/vote/${election.id}` : "#"} 
              className={`mt-4 border-t border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex w-full py-4 items-center justify-center text-sm font-medium ${election.status === "active" ? "text-foreground" : "text-muted-foreground cursor-not-allowed opacity-50 pointer-events-none"}`}
            >
              {election.status === "active" ? "Enter Voting Booth" : "Not yet open"}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
