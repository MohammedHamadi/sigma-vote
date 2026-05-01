import Link from "next/link";
import {
  Clock3,
  LayoutDashboard,
  ShieldAlert,
} from "lucide-react";

import { getVotersByRole } from "@/db-actions/voters";
import { getBallotCount } from "@/db-actions/ballots";
import { getElections } from "@/features/elections/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusStyles: Record<string, { label: string; className: string }> = {
  SETUP: {
    label: "Setup",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  OPEN: {
    label: "Open",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  CLOSED: {
    label: "Closed",
    className: "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  },
  TALLIED: {
    label: "Tallied",
    className: "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
};

function formatDate(value?: Date | string | null) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
}

function formatDateTime(value?: Date | string | null) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(date);
}

export default async function AdminDashboardPage() {
  const elections = await getElections();
  const admins = await getVotersByRole("admin");
  const voters = await getVotersByRole("voter");

  const totalElections = elections.length;
  const openElections = elections.filter((e) => e.status === "OPEN").length;
  const setupElections = elections.filter((e) => e.status === "SETUP").length;
  const closedElections = elections.filter((e) => e.status === "CLOSED").length;
  const talliedElections = elections.filter((e) => e.status === "TALLIED").length;

  const recentElections = [...elections]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 5);

  const recentElectionVotes = await Promise.all(
    recentElections.map(async (election) => ({
      electionId: election.id,
      title: election.title,
      votes: await getBallotCount(election.id),
    }))
  );

  const totalBallots = recentElectionVotes.reduce((sum, item) => sum + item.votes, 0) +
    (elections.length > recentElections.length
      ? (
          await Promise.all(
            elections.slice(recentElections.length).map(async (election) => getBallotCount(election.id))
          )
        ).reduce((sum, count) => sum + count, 0)
      : 0);

  const alerts = [
    {
      icon: ShieldAlert,
      title: `${setupElections} election${setupElections === 1 ? "" : "s"} still in setup`,
      description: "Finish candidate setup before opening them to voters.",
    },
    {
      icon: Clock3,
      title: `${openElections} election${openElections === 1 ? "" : "s"} currently open`,
      description: "Monitor turnout and keep an eye on the active vote window.",
    },
  ].filter((alert) => !alert.title.startsWith("0 "));

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <LayoutDashboard className="h-3.5 w-3.5" />
            Admin workspace
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Overview of election status and ballot activity. Use the sidebar for election
              actions like create, manage, and tally.
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Last updated</p>
          <p>{formatDateTime(new Date())}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Elections
            </CardTitle>
            <CardDescription>All elections in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalElections}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
            <CardDescription>Accepting votes now</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{openElections}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
            <CardDescription>Users with admin access</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{admins.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Voters</CardTitle>
            <CardDescription>Registered voting accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{voters.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Ballots Cast</CardTitle>
            <CardDescription>Total submitted votes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalBallots}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent Elections</CardTitle>
            <CardDescription>
              Most recently created elections, their current state, and a shortcut to manage them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentElections.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                No elections yet. Create your first election to populate the dashboard.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Election</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Window</TableHead>
                    <TableHead>Ballots</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentElections.map((election, index) => {
                    const statusKey = (election.status || "SETUP").toUpperCase();
                    const status = statusStyles[statusKey] ?? statusStyles.SETUP;
                    const voteCount = recentElectionVotes[index]?.votes ?? 0;

                    return (
                      <TableRow key={election.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{election.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Created {formatDate(election.createdAt)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}>
                            {status.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="space-y-1">
                            <p>Start: {formatDate(election.startTime)}</p>
                            <p>End: {formatDate(election.endTime)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{voteCount} ballots</p>
                            <p className="text-xs text-muted-foreground">Submitted votes</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/elections/${election.id}`}
                              className="rounded-lg border px-3 py-1.5 text-sm hover:bg-muted"
                            >
                              Manage
                            </Link>
                            {statusKey === "CLOSED" ? (
                              <Link
                                href={`/admin/tally/${election.id}`}
                                className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
                              >
                                Tally
                              </Link>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alerts & Summary</CardTitle>
              <CardDescription>Things that need attention or are ready for action.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.length === 0 ? (
                <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
                  No urgent alerts right now. Everything looks healthy.
                </div>
              ) : (
                alerts.map((alert) => {
                  const Icon = alert.icon;

                  return (
                    <div key={alert.title} className="flex gap-3 rounded-xl border p-4">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{alert.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vote Activity</CardTitle>
              <CardDescription>A compact look at ballot volume without repeating election status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Total ballots cast</p>
                <p className="mt-1 text-3xl font-bold">{totalBallots}</p>
              </div>

              <div className="space-y-3">
                {recentElectionVotes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No ballots have been submitted yet.</p>
                ) : (
                  recentElectionVotes.map((item) => {
                    const maxVotes = Math.max(...recentElectionVotes.map((vote) => vote.votes), 1);
                    const width = Math.max((item.votes / maxVotes) * 100, item.votes > 0 ? 8 : 0);

                    return (
                      <div key={item.electionId} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-muted-foreground">{item.votes} ballots</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
