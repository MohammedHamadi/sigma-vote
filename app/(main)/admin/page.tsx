import { getElections } from "@/features/elections/actions";
import { getVotersByRole } from "@/db-actions/voters";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const elections = await getElections();
  const admins = await getVotersByRole("admin");
  const voters = await getVotersByRole("voter");

  const openElections = elections.filter((e) => e.status === "OPEN").length;


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Elections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{elections.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{openElections}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{admins.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Voters</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{voters.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-3">
        <Link href="/admin/elections/create">
          <Button>Create Election</Button>
        </Link>
        <Link href="/admin/elections">
          <Button variant="outline">Manage Elections</Button>
        </Link>
      </div>
    </div>
  );
}
