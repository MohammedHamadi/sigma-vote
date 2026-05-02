import { getElectionById } from "@/features/elections/actions";
import { VotingContainer } from "@/features/voting/components/VotingContainer";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default async function VotePage({
  params,
}: {
  params: Promise<{ electionId: string }>;
}) {
  const { electionId } = await params;
  const { election, candidates } = await getElectionById(electionId);

  return (
    <div className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-20 mt-10">
      <Link href={`/elections/${electionId}`} className="inline-flex items-center text-sm font-mono tracking-tighter text-muted-foreground hover:text-primary mb-12 transition-colors uppercase gap-2 group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Election Details
      </Link>
      
      <div className="mb-16 text-center">
        <div className="flex items-center gap-3 mb-6 max-w-md mx-auto">
           <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase shrink-0">
            SECURE ACCESS
          </div>
          <div className="h-[1px] flex-grow bg-[#262626]"></div>
        </div>
        <h1 className="text-6xl font-bold font-serif text-white mb-4 tracking-tight">Cast Your Vote</h1>
        <p className="text-xl text-muted-foreground max-w-2xl font-sans mx-auto opacity-70">
          {election.title}
        </p>
      </div>

      <VotingContainer 
        electionId={election.id} 
        candidates={candidates} 
        paillierPubN={election.paillierPubN || ""}
        paillierPubG={election.paillierPubG || ""}
      />

      <div className="mt-20 pt-8 border-t border-[#262626] flex items-center justify-center gap-2">
        <Shield className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">End-to-End Cryptographic Confidentiality Guaranteed</span>
      </div>
    </div>
  );
}
