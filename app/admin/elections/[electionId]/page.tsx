// admin/elections/[electionId] — Manage single election
export default function ManageElectionPage({
  params,
}: {
  params: { electionId: string };
}) {
  return (
    <div>
      <h1>Manage Election</h1>
      {/* TODO: Import and render ManageElectionPanel from features/admin/components */}
    </div>
  );
}
