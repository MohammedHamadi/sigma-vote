import { CreateElectionForm } from "@/features/admin/components/CreateElectionForm";
import { getVotersByRole } from "@/db-actions/voters";

export default async function CreateElectionPage() {
  const admins = await getVotersByRole("admin");

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create Election</h1>
      <CreateElectionForm admins={admins} />
    </div>
  );
}
