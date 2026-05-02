import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-12 mt-auto bg-[#080808] border-t border-zinc-900 font-serif text-sm uppercase tracking-widest text-primary">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-zinc-500 hover:text-primary transition-colors cursor-pointer text-center md:text-left">
          © 2024 SigmaVote. Mathematical Certainty in Democracy.
        </p>
        <div className="flex space-x-6">
          <Link href="#" className="text-zinc-500 hover:text-primary transition-colors hover:underline underline-offset-4 cursor-pointer">Security</Link>
          <Link href="#" className="text-zinc-500 hover:text-primary transition-colors hover:underline underline-offset-4 cursor-pointer">Privacy</Link>
          <Link href="#" className="text-zinc-500 hover:text-primary transition-colors hover:underline underline-offset-4 cursor-pointer">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
