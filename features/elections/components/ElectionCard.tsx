import Link from "next/link";
import type { Election } from "@/db/schema";
import { Shield, Lock, Clock, CheckCircle, Settings, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ElectionCard({ election }: { election: Election }) {
  const isOpen = election.status === "OPEN";
  const isSetup = election.status === "SETUP";
  const isClosed = election.status === "CLOSED";

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-xl p-8 hover:border-primary/50 hover:bg-[#151515] transition-all flex flex-col h-full group relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-3 rounded-lg ${isOpen ? "bg-primary/10 text-primary" : isSetup ? "bg-purple-accent/10 text-purple-accent" : "bg-white/5 text-muted-foreground"}`}>
          {isOpen ? <Vote className="w-6 h-6" /> : isSetup ? <Settings className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
        </div>
        
        <span className={`px-3 py-1 rounded-full border text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(var(--primary),0.1)] ${
          isOpen ? "border-primary/30 text-primary" : 
          isSetup ? "border-purple-accent/30 text-purple-accent" : 
          "border-[#262626] text-muted-foreground"
        }`}>
          {isOpen && <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>}
          {election.status || "SETUP"}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-white mb-2 relative z-10 leading-tight">
        {election.title}
      </h3>
      
      <p className="text-muted-foreground mb-6 flex-grow relative z-10 line-clamp-3">
        {election.description || "Secure, mathematically verifiable voting event."}
      </p>

      <div className="flex items-center gap-2 mb-8 text-muted-foreground text-xs font-mono tracking-tighter relative z-10">
        {isOpen ? (
          <><Shield className="w-4 h-4 text-primary" /> <span>End-to-End Verifiable</span></>
        ) : isClosed ? (
          <><CheckCircle className="w-4 h-4 text-success" /> <span className="text-success shadow-[0_0_10px_rgba(var(--success),0.3)]">Tally Verified</span></>
        ) : (
          <><Clock className="w-4 h-4" /> <span>Key generation in progress</span></>
        )}
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        {isOpen && (
          <Link href={`/elections/${election.id}/vote`} className="w-full">
            <Button className="w-full bg-[#1D84DD] hover:bg-[#1D84DD]/90 text-white font-bold py-6 shadow-[0_0_20px_rgba(29,132,221,0.2)]">
              Vote Now
            </Button>
          </Link>
        )}

        <Link href={`/elections/${election.id}`} className="w-full">
          <Button variant="secondary" className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-6">
            View Details
          </Button>
        </Link>
      </div>

    </div>
  );
}

