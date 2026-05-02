"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  KeyRound,
  Lock,
  FileKey,
  CheckCircle2,
  Copy,
  Shield,
  ShieldCheck,
} from "lucide-react";
import {
  requestBlindSignature,
  checkBlindSignatureStatus,
} from "@/features/voting/actions";
import {
  generateAndBlindToken,
  unblindAndPackCredential,
} from "@/lib/crypto/blind-sig-client";

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
      setProgress(10);

      await new Promise((resolve) => setTimeout(resolve, 800));
      setProgress(30);
      const rsaPubKey = { e: rsaPubE, n: rsaPubN };
      const { token, blindingFactor, blindedToken } =
        generateAndBlindToken(rsaPubKey);

      setStep(2);
      setProgress(50);
      const res = await requestBlindSignature(
        electionId.toString(),
        blindedToken.toString(),
      );
      setProgress(70);

      setStep(3);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const {
        token: unblindedTokenStr,
        signature: unblindedSigStr,
        credential,
      } = unblindAndPackCredential(res.signature, blindingFactor, token, {
        e: res.rsaPubE,
        n: res.rsaPubN,
      });

      setProgress(100);
      setRawToken(unblindedTokenStr);
      setRawSignature(unblindedSigStr);
      setCredentialBlob(credential);
      setStep(4);
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
    return (
      <Button disabled variant="outline" className="opacity-50">
        Checking status...
      </Button>
    );
  }

  return (
    <div className="w-full">
      {hasSignature ? (
        <div className="p-6 bg-success/5 border border-success/20 rounded-xl mb-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-success/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-success/10 rounded-lg text-success">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-success leading-tight mb-1">
                Credentials Issued
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                You have already generated anonymous credentials for this
                election. Ensure you have them saved to proceed.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-[#121212] border border-[#262626] rounded-xl hover:border-primary/30 transition-all group relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex flex-col items-center justify-between gap-8 relative z-10">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                Anonymous Credential Generation
              </h3>
            </div>
            <div className="shrink-0">
              <Button
                onClick={handleGenerate}
                className="bg-[#1D84DD] hover:bg-[#1D84DD]/90 text-white font-bold py-6 px-8 shadow-[0_0_20px_rgba(29,132,221,0.2)] whitespace-nowrap"
              >
                <KeyRound className="mr-2 h-5 w-5" />
                Generate Credentials
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-[#111415] border-[#262626] shadow-2xl">
          {error ? (
            <div className="p-6 text-center">
              <div className="mx-auto bg-destructive/10 p-4 rounded-full mb-4 w-fit">
                <Lock className="h-8 w-8 text-destructive" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white mb-2">
                  Access Denied
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {error}
                </DialogDescription>
              </DialogHeader>
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className="w-full mt-8 border-white/10 hover:bg-white/5"
              >
                Dismiss
              </Button>
            </div>
          ) : step === 1 ? (
            <div className="p-6">
              <div className="mx-auto bg-primary/10 p-4 rounded-full mb-6 w-fit">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
              <DialogHeader className="mb-8">
                <DialogTitle className="text-2xl font-bold text-center text-white mb-2">
                  Generating Ballot Token
                </DialogTitle>
                <DialogDescription className="text-center text-muted-foreground">
                  Creating random token 'T' and blinding factor 'r' locally...
                </DialogDescription>
              </DialogHeader>
              <Progress value={progress} className="h-2 bg-white/5" />
            </div>
          ) : step === 2 ? (
            <div className="p-6">
              <div className="mx-auto bg-purple-accent/10 p-4 rounded-full mb-6 w-fit">
                <Shield className="h-10 w-10 text-purple-accent animate-pulse" />
              </div>
              <DialogHeader className="mb-8">
                <DialogTitle className="text-2xl font-bold text-center text-white mb-2">
                  Requesting Signature
                </DialogTitle>
                <DialogDescription className="text-center text-muted-foreground">
                  Computing blinded token T' and requesting authority signature
                  S'...
                </DialogDescription>
              </DialogHeader>
              <Progress value={progress} className="h-2 bg-white/5" />
            </div>
          ) : step === 3 ? (
            <div className="p-6">
              <div className="mx-auto bg-primary/10 p-4 rounded-full mb-6 w-fit">
                <FileKey className="h-10 w-10 text-primary animate-spin" />
              </div>
              <DialogHeader className="mb-8">
                <DialogTitle className="text-2xl font-bold text-center text-white mb-2">
                  Unblinding Signature
                </DialogTitle>
                <DialogDescription className="text-center text-muted-foreground">
                  Removing blinding factor to isolate valid signature S...
                </DialogDescription>
              </DialogHeader>
              <Progress value={progress} className="h-2 bg-white/5" />
            </div>
          ) : step === 4 ? (
            <div className="p-6">
              <div className="mx-auto bg-success/10 p-4 rounded-full mb-6 w-fit">
                <ShieldCheck className="h-12 w-12 text-success" />
              </div>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-bold text-center text-white mb-2">
                  Credentials Secured
                </DialogTitle>
                <DialogDescription className="text-center text-muted-foreground">
                  Save these credentials safely! You will need them to cast your
                  vote anonymously.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-8 space-y-4 max-w-full overflow-hidden">
                <div className="bg-black/60 p-4 rounded-xl border border-white/10 flex items-center gap-3 w-full overflow-hidden">
                  <div className="flex-1 min-w-0 bg-white/5 px-4 py-3 rounded-lg border border-white/5 overflow-hidden">
                    <p className="text-xs font-mono text-muted-foreground truncate opacity-80 select-all">
                      {credentialBlob
                        ? `${credentialBlob.slice(0, 12)}...`
                        : "Generating..."}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-11 w-11 shrink-0 rounded-lg transition-all ${copied ? "bg-success/20 text-success border border-success/30" : "bg-[#1D84DD] text-white hover:bg-[#1D84DD]/90 shadow-lg"}`}
                    onClick={handleCopy}
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-2 px-1 text-[9px] font-mono uppercase tracking-widest text-muted-foreground opacity-50 overflow-hidden">
                  <span className="truncate">
                    TOKEN: {rawToken?.substring(0, 6)}...
                  </span>
                  <span className="truncate text-right">
                    SIG: {rawSignature?.substring(0, 6)}...
                  </span>
                </div>

                <Button
                  onClick={() => setIsDialogOpen(false)}
                  className="w-full bg-[#1D84DD] hover:bg-[#1D84DD]/90 text-white font-bold py-6 mt-4"
                >
                  I have saved my credentials
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
