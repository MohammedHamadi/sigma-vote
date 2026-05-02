"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/features/auth/actions";
import { useRouter } from "next/navigation";
import { Shield, Lock, ArrowRight, Loader2 } from "lucide-react";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push("/elections");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        
        <div className="p-8 border-b border-[#262626] text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 w-fit text-primary ring-1 ring-primary/20">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1 font-serif">Welcome Back</h2>
          <p className="text-muted-foreground text-sm">Secure access to the SigmaVote registry.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold p-3 rounded-lg flex items-center gap-2 uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase px-1">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="alice@university.edu" 
                required 
                className="bg-black/40 border-[#262626] rounded-xl h-12 focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <Label htmlFor="password" title="Password" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Password</Label>
                <Link href="#" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Forgot?</Link>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-black/40 border-[#262626] rounded-xl h-12 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <Button 
            className="w-full bg-[#1D84DD] hover:bg-[#1D84DD]/90 text-white font-bold py-6 rounded-xl shadow-[0_0_20px_rgba(29,132,221,0.2)]" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Authenticating...</>
            ) : (
              <>Sign In <ArrowRight className="ml-2 h-5 w-5" /></>
            )}
          </Button>

          <div className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
