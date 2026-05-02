"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "@/features/auth/actions";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserPlus, ArrowRight, Loader2, Lock } from "lucide-react";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await registerAction(formData);
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
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1 font-serif">Create Account</h2>
          <p className="text-muted-foreground text-sm">Join the verified voting registry.</p>
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
              <Label htmlFor="name" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase px-1">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                type="text" 
                placeholder="Alice Smith" 
                required 
                className="bg-black/40 border-[#262626] rounded-xl h-12 focus:ring-primary/50 transition-all"
              />
            </div>
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
              <Label htmlFor="password" title="Password" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase px-1">Password</Label>
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
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Registering...</>
            ) : (
              <>Create Account <ArrowRight className="ml-2 h-5 w-5" /></>
            )}
          </Button>

          <div className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>
      
      <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Identity fully decoupled from vote state</span>
      </div>
    </div>
  );
}
