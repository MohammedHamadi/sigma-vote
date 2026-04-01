import { getElections } from "@/features/elections/actions";
import { ElectionStatus } from "@/features/elections/components/ElectionStatus";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ManageElectionsPage() {
  const elections = await getElections();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Elections</h1>
        <Link href="/admin/elections/create">
          <Button>Create Election</Button>
        </Link>
      </div>
      <div className="grid gap-4">
        {elections.map((election) => (
          <Card key={election.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{election.title}</CardTitle>
              <ElectionStatus status={election.status ?? "SETUP"} />
            </CardHeader>
            <CardContent className="flex gap-2">
              <Link href={`/admin/elections/${election.id}`}>
                <Button variant="outline" size="sm">Manage</Button>
              </Link>
              <Link href={`/admin/tally/${election.id}`}>
                <Button variant="outline" size="sm">Tally</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
