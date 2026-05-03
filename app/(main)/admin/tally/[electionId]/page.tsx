import { getElectionById } from "@/features/elections/actions";
import { KeyShareInput } from "@/features/admin/components/KeyShareInput";
import { TallyPanel } from "@/features/admin/components/TallyPanel";
import {
  getSharesByElectionAndAdmin,
  getSubmittedSharesByElection,
} from "@/db-actions/keyShares";
import { getVoterById } from "@/db-actions/voters";
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

  const [adminShares, submittedShares] = await Promise.all([
    adminId
      ? getSharesByElectionAndAdmin(election.id, adminId)
      : Promise.resolve([]),
    getSubmittedSharesByElection(election.id),
  ]);
  const hasAssignedShare = adminShares.length > 0;
  const alreadySubmitted = submittedShares.some((s) => s.adminId === adminId);

  // Resolve admin display info for each row in the share roster
  const rosterAdmins = await Promise.all(
    submittedShares.map(async (s) => ({
      adminId: s.adminId,
      submitted: true,
      voter: await getVoterById(s.adminId),
    })),
  );

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">Tally: {election.title}</h1>

      <div className="rounded-xl border bg-card p-4 text-sm">
        <p>
          Status: <span className="font-mono">{election.status}</span> ·
          Threshold:{" "}
          <span className="font-mono">
            {election.threshold}/{election.totalShares}
          </span>{" "}
          · Submitted shares:{" "}
          <span className="font-mono">{submittedShares.length}</span>
        </p>
        {rosterAdmins.length > 0 && (
          <ul className="mt-3 space-y-1">
            {rosterAdmins.map((r) => (
              <li key={r.adminId} className="text-muted-foreground">
                ✓ {r.voter?.name ?? `admin#${r.adminId}`}{" "}
                {r.voter?.email ? (
                  <span className="opacity-60">({r.voter.email})</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      {!hasAssignedShare ? (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          You are not one of the assigned key-share holders for this election.
          You cannot submit a share.
        </div>
      ) : alreadySubmitted ? (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm">
          You have already submitted your key share for this election.
        </div>
      ) : (
        <KeyShareInput electionId={election.id} adminId={adminId} />
      )}

      <TallyPanel electionId={election.id} />
    </div>
  );
}
