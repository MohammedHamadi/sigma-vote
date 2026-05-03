import { getAllVoters } from "@/db-actions/voters";
import { VotersManagementPanel } from "@/features/admin/components/VotersManagementPanel";

export default async function VotersAdminPage() {
  const voters = await getAllVoters();

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Voter Management</h1>
      <VotersManagementPanel voters={voters} />
    </div>
  );
}
