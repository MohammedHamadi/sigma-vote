import { Lock, FileText, Calculator, Key, ArrowRight, ShieldCheck, Database } from "lucide-react";

export function HomomorphicAdditionDiagram() {
  return (
    <div className="my-8 flex flex-col items-center w-full bg-[#111113] rounded-3xl border border-white/5 p-6 sm:p-10 shadow-2xl overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-3xl relative z-10 gap-8 md:gap-0">
        
        {/* Step 1: Individual Votes */}
        <div className="flex flex-col items-center gap-6 w-full md:w-auto">
          <div className="flex justify-center gap-4 w-full">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center shadow-sm">
                <span className="text-white font-mono font-bold">1</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Vote A</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center shadow-sm">
                <span className="text-white font-mono font-bold">0</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Vote B</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-success">
            <Lock className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-mono">Encrypt</span>
          </div>

          <div className="flex justify-center gap-4 w-full">
            <div className="h-12 w-12 rounded-lg bg-success/10 border border-success/30 flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-success/20 blur-md opacity-50"></div>
              <FileText className="w-5 h-5 text-success relative z-10" />
              <Lock className="w-3 h-3 text-success absolute bottom-2 right-2 z-10" />
            </div>
            <div className="h-12 w-12 rounded-lg bg-success/10 border border-success/30 flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-success/20 blur-md opacity-50"></div>
              <FileText className="w-5 h-5 text-success relative z-10" />
              <Lock className="w-3 h-3 text-success absolute bottom-2 right-2 z-10" />
            </div>
          </div>
        </div>

        {/* Math Operator Arrow */}
        <div className="hidden md:flex flex-1 h-px border-t-2 border-dashed border-white/10 mx-6 relative items-center justify-center">
          <div className="absolute bg-[#111113] px-3 flex flex-col items-center gap-1">
            <Calculator className="w-5 h-5 text-primary" />
            <span className="text-[9px] text-primary uppercase font-mono tracking-widest whitespace-nowrap">Ciphertext Multiply</span>
          </div>
        </div>
        
        {/* Mobile Math Operator */}
        <div className="md:hidden flex flex-col items-center gap-1 my-2">
            <Calculator className="w-5 h-5 text-primary" />
            <span className="text-[9px] text-primary uppercase font-mono tracking-widest whitespace-nowrap">Ciphertext Multiply</span>
            <ArrowRight className="w-4 h-4 text-white/20 rotate-90 my-1" />
        </div>

        {/* Step 2: Aggregation */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-20 w-20 rounded-2xl bg-[#111] border border-primary/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(var(--primary),0.15)]">
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-60 rounded-2xl"></div>
            <Database className="w-8 h-8 text-primary relative z-10" />
            <Lock className="w-4 h-4 text-primary absolute bottom-3 right-3 z-10" />
          </div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono text-center">Encrypted<br/>Tally</span>
          
          <div className="flex items-center gap-2 text-purple-accent mt-2">
            <Key className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-mono">Decrypt (End of Election)</span>
          </div>

          <div className="h-12 w-20 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)] mt-1">
            <span className="text-white font-mono font-bold text-lg">1</span>
          </div>
          <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Final Result</span>
        </div>

      </div>
    </div>
  );
}
