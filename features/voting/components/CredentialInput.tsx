"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, FileKey, Loader2 } from "lucide-react";
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
      
      // Cryptographically verify signature and check if token is used
      await verifyVotingCredential(electionId, creds.token, creds.signature);
      
      onValidCredentials(creds.token, creds.signature);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credential format. Please make sure you copied the entire text.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="bg-[#111113] border-white/10 shadow-none">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 w-fit">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Enter Voting Credentials</CardTitle>
        <CardDescription>
          Paste your anonymous credentials to access the voting booth.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <textarea 
            className="w-full h-32 p-4 bg-black/40 border border-white/10 rounded-md font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            placeholder="Paste your Base64 encoded credentials here..."
            value={credentialStr}
            onChange={handlePaste}
          />
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <Button onClick={handleVerify} className="w-full" size="lg" disabled={isVerifying}>
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying Credentials...
              </>
            ) : (
              <>
                <FileKey className="mr-2 h-4 w-4" /> Verify & Enter Booth
              </>
            )}
          </Button>
        </div>
        <div className="mt-6 text-xs text-center text-muted-foreground">
          Your identity is completely decoupled from these credentials. The server does not know who you are.
        </div>
      </CardContent>
    </Card>
  );
}
