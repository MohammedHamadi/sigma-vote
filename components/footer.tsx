import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 md:py-12 mt-16">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-success" />
            <span className="font-semibold text-sm">SigmaVote Platform</span>
          </div>
          <p className="text-xs text-muted-foreground text-center md:text-left max-w-sm">
            Cryptographic electronic voting prototype utilizing Homomorphic Encryption and Zero-Knowledge Proofs for verifiable, private elections.
          </p>
        </div>
        
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Lock className="h-3 w-3" /> Security
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
