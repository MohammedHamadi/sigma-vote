import Link from "next/link";
import { Shield, User as UserIcon, LogOut, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { signOutAction } from "@/features/auth/actions";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="fixed top-0 w-full z-50 bg-[#080808]/80 backdrop-blur-md border-b border-zinc-800 shadow-[0_0_30px_rgba(29,132,221,0.05)]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-2xl font-bold tracking-tighter text-white font-serif">
            SigmaVote
          </span>
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link
            href="/elections"
            className="text-zinc-400 font-medium hover:text-white transition-colors hover:bg-white/5 rounded-lg px-3 py-2 font-serif text-sm antialiased active:scale-95 duration-200"
          >
            Active Elections
          </Link>
          <Link
            href="/docs"
            className="text-zinc-400 font-medium hover:text-white transition-colors hover:bg-white/5 rounded-lg px-3 py-2 font-serif text-sm antialiased active:scale-95 duration-200"
          >
            Docs
          </Link>
          {session?.user?.role === "admin" && (
            <Link
              href="/admin"
              className="text-zinc-400 font-medium hover:text-white transition-colors hover:bg-white/5 rounded-lg px-3 py-2 font-serif text-sm antialiased active:scale-95 duration-200"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-white/5 rounded-full p-2 active:scale-95 transition-transform duration-200 text-primary"
          >
            <FileCheck className="w-6 h-6" />
          </Button>

          {session?.user ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center gap-2 text-sm font-medium mr-2 text-primary">
                <UserIcon className="h-5 w-5" />
                <span className="hidden sm:inline">{session.user.name}</span>
              </div>
              <form action={signOutAction}>
                <Button
                  variant="ghost"
                  size="icon"
                  type="submit"
                  className="hover:bg-white/5 rounded-full p-2 active:scale-95 transition-transform duration-200 text-primary"
                >
                  <LogOut className="w-6 h-6" />
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-[#1D84DD] hover:bg-[#1D84DD]/90 text-white font-bold px-6 py-2 rounded-lg shadow-[0_0_20px_rgba(29,132,221,0.2)]">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
