import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Lock, FileKey, User, EyeOff, Server, ShieldCheck, FileText, Database, Calculator, Key, CheckCircle, Network, Github, BookOpen } from "lucide-react";
import { RetroGrid } from "@/components/ui/retro-grid";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden">
        <div className="container relative z-10 flex flex-col items-center gap-8 py-20 text-center md:py-32">
        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary max-w-fit">
          <Shield className="mr-2 h-4 w-4" />
          <span>Homomorphic Encryption + Zero-Knowledge Proofs</span>
        </div>
        
        <h1 className="text-4xl font-serif tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          The future of <span className="text-primary font-serif">secure</span> voting.
        </h1>
        
        <p className="max-w-2xl leading-normal text-muted-foreground sm:text-lg sm:leading-8">
          SigmaVote provides cryptographic guarantees for elections. Cast your ballot with mathematically proven privacy, while maintaining end-to-end verifiability.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/elections">
            <Button size="lg" className="h-12 px-8 font-semibold">
              View Active Elections
            </Button>
          </Link>
          <Link href="/docs">
            <Button size="lg" variant="secondary" className="h-12 px-8">
              <BookOpen className="mr-2 w-5 h-5" />
              Read Docs
            </Button>
          </Link>
          <a href="https://github.com/MohammedHamadi/sigma-vote" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="secondary" className="h-12 px-8">
              <Github className="mr-2 w-5 h-5" />
              GitHub Repo
            </Button>
          </a>
        </div>
        
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-6xl w-full mx-auto text-left">
          <div className="flex flex-col gap-2 p-8 rounded-2xl border border-white/10 bg-[#111113]">
            <Lock className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-bold text-xl text-white">Absolute Privacy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Votes are encrypted in the browser. They remain encrypted forever, even during tallying.</p>
          </div>
          <div className="flex flex-col gap-2 p-8 rounded-2xl border border-white/10 bg-[#111113]">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-success mb-4" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
            <h3 className="font-bold text-xl text-white">Verifiable</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Every voter receives a cryptographic receipt to verify their vote was included in the final tally.</p>
          </div>
          <div className="flex flex-col gap-2 p-8 rounded-2xl border border-white/10 bg-[#111113]">
            <FileKey className="h-8 w-8 text-purple-accent mb-4" />
            <h3 className="font-bold text-xl text-white">Zero-Knowledge</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Prove eligibility without revealing identity using zero-knowledge proofs.</p>
          </div>
        </div>
      </div>
        
      {/* Background Magic UI Elements inside Hero Section */}
      <RetroGrid className="opacity-50" />
    </section>

      {/* Security Architecture Section */}
      <section className="w-full bg-[#111113]/50 border-t border-white/5 py-32 relative hidden sm:block">
        <div className="container mx-auto px-4 md:px-12 lg:px-20 max-w-7xl">
          <div className="text-center mb-20 lg:mb-32">
            <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl lg:text-5xl text-white mb-6">How It Works</h2>
            <p className="text-muted-foreground text-lg sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Our architecture is engineered from the ground up to guarantee absolute anonymity, 
              end-to-end confidentiality, and mathematical integrity through advanced cryptographic primitives.
            </p>
          </div>

          <div className="flex flex-col gap-32">
            
            {/* Concept 1: Blind Signatures */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                  <EyeOff className="mr-2 h-4 w-4" /> Threshold Cryptography
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight">Decentralized Anonymity</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Before you cast a ballot, your eligibility must be verified—but without the system knowing who you are voting for. 
                  We use <span className="text-foreground font-medium">RSA Blind Signatures</span> to achieve this. The server signs your blinded voter token without ever seeing its contents, permanently separating your identity from your voting packet.
                </p>
              </div>
              <div className="flex-1 w-full bg-[#111113] rounded-[2rem] border border-white/5 p-10 flex flex-col items-center justify-center relative shadow-2xl">
                <div className="flex items-center justify-between w-full max-w-md relative z-10">
                  {/* Node 1 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-[#111] border border-white/10 flex items-center justify-center relative shadow-[0_0_20px_rgba(var(--primary),0.1)] group">
                      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-50"></div>
                      <User className="text-primary w-7 h-7 relative z-10" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest text-center">Eligibility</span>
                  </div>
                  
                  {/* Arrow 1 */}
                  <div className="flex-1 h-px border-t-2 border-dashed border-white/10 mx-4 relative flex items-center justify-center">
                    <div className="bg-[#111113] px-2 absolute"><EyeOff className="w-5 h-5 text-muted-foreground/50" /></div>
                    <span className="absolute -top-6 text-[9px] text-muted-foreground/60 uppercase font-mono tracking-widest bg-[#111113] px-2 whitespace-nowrap">Blinded Token</span>
                  </div>
                  
                  {/* Node 2 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center relative">
                      <Server className="text-white w-6 h-6 relative z-10" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest text-center">Auth Server</span>
                  </div>
                  
                  {/* Arrow 2 */}
                  <div className="flex-1 h-px border-t-2 border-dashed border-success/30 mx-4 relative flex items-center justify-center">
                    <div className="bg-[#111113] px-2 absolute"><ShieldCheck className="w-5 h-5 text-success/70" /></div>
                    <span className="absolute -top-6 text-[9px] text-success/70 uppercase font-mono tracking-widest bg-[#111113] px-2 whitespace-nowrap">Signed Payload</span>
                  </div>

                  {/* Node 3 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-[#111] border border-white/10 flex items-center justify-center relative shadow-[0_0_20px_rgba(var(--success),0.1)]">
                      <div className="absolute inset-0 rounded-full bg-success/20 blur-xl opacity-50"></div>
                      <FileText className="text-success w-7 h-7 relative z-10" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest text-center">Anonymous<br/>Vote</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Concept 2: Homomorphic Encryption */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-success mb-2">
                  <Lock className="mr-2 h-4 w-4" /> Paillier Homomorphic Encryption
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight">End-to-End Confidentiality</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Your ballot is encrypted directly inside your browser. The ciphertext is sent to the database, where it remains encrypted forever. 
                  Our tallying system performs mathematical operations directly on the ciphertexts to count votes, meaning <span className="text-foreground font-medium">the individual ballots are never decrypted.</span>
                </p>
              </div>
              <div className="flex-1 w-full bg-[#111113] rounded-[2rem] border border-white/5 p-10 flex items-center justify-center relative shadow-2xl">
                <div className="flex items-center justify-between w-full max-w-md relative z-10">
                  {/* Node 1 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center relative">
                      <FileText className="text-white w-6 h-6 relative z-10" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Plaintext</span>
                  </div>

                  {/* Operator 1 */}
                  <div className="flex-1 mx-2 flex flex-col items-center justify-center relative">
                    <Lock className="w-5 h-5 text-success/80 mb-2 relative z-10 bg-[#111113] px-1" />
                    <div className="w-full absolute h-px border-t-2 border-dashed border-success/30"></div>
                  </div>

                  {/* Node 2 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center relative shadow-[0_0_20px_rgba(var(--success),0.1)]">
                      <div className="absolute inset-0 rounded-lg bg-success/10 blur-xl opacity-50"></div>
                      <FileText className="text-success/40 w-7 h-7 absolute z-0" />
                      <Lock className="text-success w-4 h-4 absolute z-10" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest text-center">Ciphertext<br/>Array</span>
                  </div>

                  {/* Operator 2 */}
                  <div className="flex-1 mx-2 flex flex-col items-center justify-center relative">
                    <Calculator className="w-5 h-5 text-primary/80 mb-2 relative z-10 bg-[#111113] px-1" />
                    <div className="w-full absolute h-px border-t-2 border-dashed border-primary/30"></div>
                    <span className="text-[9px] text-primary uppercase font-mono tracking-widest absolute -bottom-6 whitespace-nowrap">Math Add</span>
                  </div>

                  {/* Node 3 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center relative shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                      <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-50"></div>
                      <Database className="text-primary w-6 h-6 relative z-10" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest text-center">Encrypted<br/>Tally</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Concept 3: ZKPs */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center rounded-full bg-purple-accent/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-accent mb-2">
                  <CheckCircle className="mr-2 h-4 w-4" /> Zero-Knowledge Proofs (ZKPs)
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight">Public Verifiability</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To prevent malicious or invalid votes, your device generates a Zero-Knowledge Proof (ZKP). 
                  This mathematical construct proves that your encrypted vote is valid (exactly one vote cast) <span className="text-foreground font-medium">without ever revealing who you voted for</span>—maintaining absolute integrity without sacrificing privacy.
                </p>
              </div>
              <div className="flex-1 w-full bg-[#111113] rounded-[2rem] border border-white/5 p-10 flex items-center justify-center relative shadow-2xl">
                <div className="flex items-center justify-between w-full max-w-md relative z-10">
                  <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 relative z-10 shadow-lg">
                    {/* Node 1 */}
                    <div className="flex flex-col items-center">
                      <div className="h-14 w-14 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center">
                        <Lock className="text-success w-5 h-5 shadow-[0_0_10px_rgba(var(--success),0.5)]" />
                      </div>
                    </div>
                    <div className="text-white/30 font-light text-2xl">+</div>
                    {/* Node 2 */}
                    <div className="flex flex-col items-center">
                      <div className="h-14 w-14 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center relative shadow-[0_0_15px_rgba(var(--purple-accent),0.1)]">
                        <Key className="text-purple-accent w-5 h-5 relative z-10" />
                      </div>
                    </div>
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground uppercase font-mono tracking-widest bg-[#0a0a0a] px-3 py-0.5 rounded-full border border-white/10 whitespace-nowrap shadow-sm">Payload bundle</span>
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-purple-accent/60 uppercase font-mono tracking-widest px-2 whitespace-nowrap">ZKP Array</span>
                  </div>
                  
                  {/* Arrow */}
                  <div className="flex-1 h-px border-t-2 border-solid border-white/10 relative mx-4">
                    <div className="absolute inset-0 flex items-center justify-center -mt-3">
                      <CheckCircle className="bg-[#111113] px-2 box-content w-4 h-4 text-muted-foreground/50" />
                    </div>
                    <span className="absolute -bottom-6 w-full text-center text-[9px] text-muted-foreground/60 uppercase font-mono tracking-widest">Verify Math</span>
                  </div>
                  
                  {/* Final Node */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-primary relative shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-40"></div>
                      <Network className="w-7 h-7 relative z-10" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest text-center whitespace-nowrap">Accepted<br/>State</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
