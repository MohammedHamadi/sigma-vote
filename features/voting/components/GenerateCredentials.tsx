"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, KeyRound, Lock, FileKey, CheckCircle2, Copy } from "lucide-react";
import { requestBlindSignature, checkBlindSignatureStatus } from "@/features/voting/actions";
import { generateAndBlindToken, unblindAndPackCredential } from "@/lib/crypto/blind-sig-client";

export function GenerateCredentials({
  electionId,
  rsaPubE,
  rsaPubN,
}: {
  electionId: number;
  rsaPubE: string;
  rsaPubN: string;
}) {
  const [hasSignature, setHasSignature] = useState<boolean | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [credentialBlob, setCredentialBlob] = useState<string | null>(null);
  const [rawToken, setRawToken] = useState<string | null>(null);
  const [rawSignature, setRawSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkBlindSignatureStatus(electionId.toString()).then((res) => {
      setHasSignature(res.hasSignature);
    });
  }, [electionId]);

  const handleGenerate = async () => {
    try {
      setIsDialogOpen(true);
      setError(null);
      setStep(1);
      setProgress(10); // Start progress

      // Step 1: Generate token and blind it locally
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProgress(30);
      const rsaPubKey = { e: rsaPubE, n: rsaPubN };
      const { token, blindingFactor, blindedToken } = generateAndBlindToken(rsaPubKey);

      // Step 2: Request blind signature from server
      setStep(2);
      setProgress(50);
      const res = await requestBlindSignature(electionId.toString(), blindedToken.toString());
      setProgress(70);

      // Step 3: Unblind signature
      setStep(3);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const { token: unblindedTokenStr, signature: unblindedSigStr, credential } = unblindAndPackCredential(
        res.signature,
        blindingFactor,
        token,
        { e: res.rsaPubE, n: res.rsaPubN }
      );
      
      setProgress(100);
      setRawToken(unblindedTokenStr);
      setRawSignature(unblindedSigStr);
      setCredentialBlob(credential);
      setStep(4); // Success!
      setHasSignature(true);
      
    } catch (err: any) {
      console.error("Error generating credentials:", err);
      setError(err.message || "Failed to generate credentials");
    }
  };

  const handleCopy = () => {
    if (credentialBlob) {
      navigator.clipboard.writeText(credentialBlob);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (hasSignature === null) {
    return <Button disabled>Loading status...</Button>;
  }

  return (
    <div>
      {hasSignature ? (
        <div className="p-4 border border-white/10 bg-white/5 rounded-xl mb-6">
          <div className="flex items-center gap-2 text-success mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-semibold">Credentials Generated</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            You have already generated anonymous credentials for this election. 
            If you have copied them, you can proceed to the voting booth.
          </p>
        </div>
      ) : (
        <Button onClick={handleGenerate} size="lg" className="mb-6">
          <KeyRound className="mr-2 h-4 w-4" />
          Generate Anonymous Credentials
        </Button>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {error ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-destructive text-center">Error</DialogTitle>
                <DialogDescription className="text-center mt-2 text-red-400">
                  {error}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center mt-4">
                <Button onClick={() => setIsDialogOpen(false)} variant="outline">Close</Button>
              </DialogFooter>
            </>
          ) : step === 1 ? (
            <>
              <DialogHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 w-fit">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
                <DialogTitle className="text-center">Generating random ballot token...</DialogTitle>
                <DialogDescription className="text-center mt-2">
                  Creating random token 'T' and blinding factor 'r' locally in browser.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <Progress value={progress} className="h-2" />
              </div>
            </>
          ) : step === 2 ? (
            <>
              <DialogHeader>
                <div className="mx-auto bg-purple-accent/10 p-3 rounded-full mb-4 w-fit">
                  <Lock className="h-6 w-6 text-purple-accent animate-pulse" />
                </div>
                <DialogTitle className="text-center">Blinding and requesting signature...</DialogTitle>
                <DialogDescription className="text-center mt-2">
                  Computing blinded token T' and requesting server signature S'.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <Progress value={progress} className="h-2" />
              </div>
            </>
          ) : step === 3 ? (
            <>
              <DialogHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 w-fit">
                  <FileKey className="h-6 w-6 text-primary animate-spin" />
                </div>
                <DialogTitle className="text-center">Unblinding signature...</DialogTitle>
                <DialogDescription className="text-center mt-2">
                  Removing blinding factor to get valid signature S on your token T.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <Progress value={progress} className="h-2" />
              </div>
            </>
          ) : step === 4 ? (
            <>
              <DialogHeader>
                <div className="mx-auto bg-success/10 p-3 rounded-full mb-4 w-fit">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <DialogTitle className="text-center">Credentials Ready!</DialogTitle>
                <DialogDescription className="text-center mt-2">
                  Save these credentials safely! You will need them to vote. They cannot be regenerated.
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 w-full min-w-0">
                <div className="bg-muted p-3 rounded-md border border-white/10 flex items-center justify-between gap-3 w-full min-w-0">
                  <p className="text-xs font-mono text-muted-foreground truncate flex-1 min-w-0">
                    {credentialBlob}
                  </p>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 shrink-0"
                    onClick={handleCopy}
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="mt-4 text-xs text-muted-foreground flex justify-between px-1">
                  <span>Token: {rawToken?.substring(0, 16)}...</span>
                  <span>Sig: {rawSignature?.substring(0, 16)}...</span>
                </div>
              </div>

              <DialogFooter className="sm:justify-center mt-6">
                <Button onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                  I have copied my credentials
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
