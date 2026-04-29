import Link from "next/link";
import { Shield, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { signOutAction } from "@/features/auth/actions";

export async function Navbar() {
  const session = await auth();

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
              href="/elections"
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

            {session?.user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm font-medium mr-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{session.user.name}</span>
                </div>
                <form action={signOutAction}>
                  <Button variant="secondary" size="sm" type="submit">Sign Out</Button>
                </form>
              </div>
            ) : (
              <Link href="/login">
                {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                }
                <Button variant="secondary" size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
