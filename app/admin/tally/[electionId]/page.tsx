// admin/tally/[electionId] — Key share submission + tally trigger
export default function TallyPage({
  params,
}: {
  params: { electionId: string };
}) {
  return (
    <div>
      <h1>Tally Election</h1>
      {/* TODO: Import and render KeyShareInput + TallyPanel from features/admin/components */}
    </div>
  );
}
