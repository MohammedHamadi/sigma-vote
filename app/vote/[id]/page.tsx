"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { BorderBeam } from "@/components/ui/border-beam";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { CheckCircle2, Lock, ArrowLeft, Loader2, KeyRound, Database, FileKey } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const mockCandidates = [
  { id: "c1", name: "Alice Johnson", party: "Progressive Technology Party" },
  { id: "c2", name: "Bob Smith", party: "Conservative Heritage Group" },
  { id: "c3", name: "Charlie Davis", party: "Independent Consensus" },
];

export default function VotingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  
  // Progress states for animation
  const [authProgress, setAuthProgress] = useState(0);
  const [encryptionProgress, setEncryptionProgress] = useState(0);

  // Initial Auth steps (Step 1 & 2)
  useEffect(() => {
    if (step === 1) {
      // Step 1: Preparing your ballot...
      const t1 = setTimeout(() => setStep(2), 1500);
      return () => clearTimeout(t1);
    }
    if (step === 2) {
      // Step 2: Getting authorization...
      const interval = setInterval(() => {
        setAuthProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(3), 500);
            return 100;
          }
           return p + 20;
        });
      }, 300);
      return () => clearInterval(interval);
    }
    // Encryption and submission steps (Step 4, 5, 6)
    if (step === 4 || step === 5 || step === 6) {
      const interval = setInterval(() => {
        setEncryptionProgress(p => {
          if (p >= 100 && step === 4) {
             clearInterval(interval);
             setTimeout(() => { setStep(5); setEncryptionProgress(0); }, 500);
             return 100;
          }
          if (p >= 100 && step === 5) {
             clearInterval(interval);
             setTimeout(() => { setStep(6); setEncryptionProgress(0); }, 500);
             return 100;
          }
          if (p >= 100 && step === 6) {
             clearInterval(interval);
             setTimeout(() => setStep(7), 800);
             return 100;
          }
          return p + (Math.random() * 20 + 10);
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleCastVote = () => {
    if (!selectedCandidate) return;
    setStep(4); // Start encryption
  };

  const isDialogOpen = step !== 3;

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 max-w-4xl relative">
      <Link href="/vote" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Elections
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Step 3: Select Your Candidate</h1>
        <p className="text-muted-foreground">
          Your blind signature has been acquired. Select one candidate to cast your anonymous ballot.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
        {mockCandidates.map((candidate) => (
          <div 
            key={candidate.id} 
            className="relative cursor-pointer transition-all duration-300"
            onClick={() => setSelectedCandidate(candidate.id)}
          >
            <Card className={`overflow-hidden transition-colors ${selectedCandidate === candidate.id ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/50'}`}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{candidate.name}</h3>
                  <p className="text-sm text-muted-foreground">{candidate.party}</p>
                </div>
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${selectedCandidate === candidate.id ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {selectedCandidate === candidate.id && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                </div>
              </CardContent>
              {selectedCandidate === candidate.id && (
                <BorderBeam size={200} duration={12} delay={9} colorFrom="var(--color-primary)" colorTo="var(--color-purple-accent)" />
              )}
            </Card>
          </div>
        ))}
      </div>
      
      <div className="mt-12 flex justify-center">
        <div className={selectedCandidate ? "opacity-100" : "opacity-50 pointer-events-none"}>
          <ShimmerButton 
            onClick={handleCastVote} 
            className="shadow-2xl px-12 py-4"
          >
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Cast Encrypted Ballot
            </span>
          </ShimmerButton>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" hideCloseButton>
          
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <DialogHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 w-fit">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
                <DialogTitle className="text-center">Preparing your ballot...</DialogTitle>
                <DialogDescription className="text-center mt-2">
                  Generating random ballot token &apos;T&apos; and blinding factor &apos;r&apos; locally in browser.
                </DialogDescription>
              </DialogHeader>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <DialogHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 w-fit">
                  <KeyRound className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <DialogTitle className="text-center">Getting authorization...</DialogTitle>
                <DialogDescription className="text-center mt-2">
                  Blinding token and POSTing to /blind-sign. Waiting for server signature.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <Progress value={authProgress} className="h-2" />
              </div>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <DialogHeader>
                <div className="mx-auto bg-purple-accent/10 p-3 rounded-full mb-4 w-fit">
                  <Lock className="h-6 w-6 text-purple-accent animate-spin" />
                </div>
                <DialogTitle className="text-center">Encrypting your vote...</DialogTitle>
                <DialogDescription className="text-center mt-2">
                  For each candidate, Paillier-encrypting 0 or 1.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <Progress value={encryptionProgress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground mt-4 animate-pulse">
                  Performing cryptographic operations client-side. Please do not close.
                </p>
              </div>
            </>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <>
              <DialogHeader>
                <div className="mx-auto bg-purple-accent/10 p-3 rounded-full mb-4 w-fit">
                  <FileKey className="h-6 w-6 text-purple-accent animate-pulse" />
                </div>
                <DialogTitle className="text-center">Generating proof...</DialogTitle>
                <DialogDescription className="text-center mt-2">
                  Generating Zero-Knowledge Proofs (ZKP) to prove validity without revealing selection.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <Progress value={encryptionProgress} className="h-2" />
              </div>
            </>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <>
              <DialogHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 w-fit">
                  <Database className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <DialogTitle className="text-center">Submitting...</DialogTitle>
                <DialogDescription className="text-center mt-2">
                  Sending anonymous ballot to the /submit endpoint without auth headers.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <Progress value={encryptionProgress} className="h-2" />
              </div>
            </>
          )}

          {/* STEP 7 */}
          {step === 7 && (
            <>
              <DialogHeader>
                <div className="mx-auto bg-success/10 p-3 rounded-full mb-4 w-fit">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <DialogTitle className="text-center">Vote cast!</DialogTitle>
                <DialogDescription className="text-center mt-2">
                  Your encrypted ballot has been verified and stored anonymously.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-muted/50 p-4 rounded-md text-xs font-mono break-all text-muted-foreground my-4 border text-center">
                Token Signature ID: <br />
                <span className="text-foreground">0x{Math.random().toString(16).slice(2, 64).padEnd(64, '0')}</span>
              </div>
              <DialogFooter className="sm:justify-center mt-2">
                <Button onClick={() => router.push('/results')} className="w-full sm:w-auto">
                  View Live Results
                </Button>
              </DialogFooter>
            </>
          )}

        </DialogContent>
      </Dialog>
    </div>
  );
}
