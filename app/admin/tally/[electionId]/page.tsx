import { getElectionById } from "@/features/elections/actions";
import { KeyShareInput } from "@/features/admin/components/KeyShareInput";
import { TallyPanel } from "@/features/admin/components/TallyPanel";
import { auth } from "@/auth";

export default async function TallyPage({
  params,
}: {
  params: Promise<{ electionId: string }>;
}) {
  const { electionId } = await params;
  const { election } = await getElectionById(electionId);
  const session = await auth();
  const adminId = session?.user?.id ? parseInt(session.user.id, 10) : 0;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Tally: {election.title}</h1>
      <KeyShareInput electionId={election.id} adminId={adminId} />
      <TallyPanel electionId={election.id} />
    </div>
  );
}
