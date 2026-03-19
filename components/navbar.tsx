import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-mono text-lg tracking-tight">SigmaVote</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-6">
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <Link
              href="/vote"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Active Elections
            </Link>
            <Link
              href="/results"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Results
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden md:flex">
              Verify Ballot
            </Button>
            <Button size="sm">Connect Wallet</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
