import { getElectionById } from "@/features/elections/actions";
import { ManageElectionPanel } from "@/features/admin/components/ManageElectionPanel";

export default async function ManageElectionPage({
  params,
}: {
  params: Promise<{ electionId: string }>;
}) {
  const { electionId } = await params;
  const { election, candidates } = await getElectionById(electionId);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Election</h1>
      <ManageElectionPanel election={election} candidates={candidates} />
    </div>
  );
}
