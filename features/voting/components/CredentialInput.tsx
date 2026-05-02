"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, FileKey, Loader2, ShieldAlert } from "lucide-react";
import { verifyVotingCredential } from "../actions";

export function CredentialInput({ 
  electionId,
  onValidCredentials 
}: { 
  electionId: number;
  onValidCredentials: (token: string, signature: string) => void 
}) {
  const [credentialStr, setCredentialStr] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCredentialStr(e.target.value);
    setError(null);
  };

  const handleVerify = async () => {
    try {
      if (!credentialStr.trim()) {
        setError("Please enter your credentials.");
        return;
      }
      
      const jsonStr = atob(credentialStr.trim());
      const creds = JSON.parse(jsonStr);
      
      if (!creds.token || !creds.signature) {
        throw new Error("Invalid format");
      }
      
      setIsVerifying(true);
      setError(null);
      
      await verifyVotingCredential(electionId, creds.token, creds.signature);
      
      onValidCredentials(creds.token, creds.signature);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credential format. Please make sure you copied the entire text.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        
        <div className="p-10 border-b border-[#262626] text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full mb-6 w-fit text-primary ring-1 ring-primary/20">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 font-serif">Credential Authentication</h2>
          <p className="text-muted-foreground leading-relaxed">
            Paste your anonymous credentials below to prove eligibility without revealing your identity.
          </p>
        </div>

        <div className="p-10 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase px-1">
              Encrypted Credential Token
            </label>
            <textarea 
              className="w-full h-40 p-6 bg-black/60 border border-[#262626] rounded-xl font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all placeholder:opacity-30"
              placeholder="Paste your Base64 encoded credentials here..."
              value={credentialStr}
              onChange={handlePaste}
            />
            {error && (
              <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-lg border border-destructive/20 text-sm font-bold">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
          </div>

          <Button 
            onClick={handleVerify} 
            className="w-full bg-[#1D84DD] hover:bg-[#1D84DD]/90 text-white font-bold py-8 text-lg rounded-xl shadow-[0_0_30px_rgba(29,132,221,0.2)] group" 
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Verifying Credentials...
              </>
            ) : (
              <>
                <FileKey className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" /> Access Voting Booth
              </>
            )}
          </Button>
          
          <div className="text-[10px] font-bold text-center text-muted-foreground uppercase tracking-[0.2em] opacity-50">
            Cryptographic Anonymity Guaranteed
          </div>
        </div>
      </div>
    </div>
  );
}
