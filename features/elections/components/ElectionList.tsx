import { getElections } from "@/features/elections/actions";
import { ElectionCard } from "./ElectionCard";

export async function ElectionList() {
  const elections = await getElections();

  if (elections.length === 0) {
    return <p className="text-muted-foreground">No elections available.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {elections.map((election) => (
        <ElectionCard key={election.id} election={election} />
      ))}
    </div>
  );
}
