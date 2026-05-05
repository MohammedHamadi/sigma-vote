"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronRight, Shield, User, Server, Lock, EyeOff, Key, Database, 
  RefreshCw, Layers, Vote, CheckCircle2, ArrowRight, Network, 
  Users, KeyRound, Play, FileLock2, Unlock
} from "lucide-react";

const SLIDES = [
  {
    id: "intro",
    title: "SigmaVote Architecture",
    subtitle: "Secure, Anonymous, Verifiable E-Voting",
    render: () => (
      <div className="flex flex-col items-center justify-center space-y-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-3xl" />
          <Shield className="w-32 h-32 text-cyan-400 relative z-10" />
        </motion.div>
        
        <div className="flex items-center gap-16 text-slate-300 mt-8">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center backdrop-blur-sm shadow-[0_0_15px_rgba(34,211,238,0.1)]">
              <User className="w-12 h-12 text-cyan-300" />
            </div>
            <span className="text-xl font-medium tracking-wide">Voters</span>
          </motion.div>

          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 }} className="flex gap-2 text-cyan-500/50">
            <RefreshCw className="w-10 h-10 animate-spin-slow" />
          </motion.div>

          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <Server className="w-12 h-12 text-violet-400" />
            </div>
            <span className="text-xl font-medium tracking-wide">SigmaVote Server</span>
          </motion.div>
        </div>
      </div>
    )
  },
  {
    id: "flow",
    title: "End-to-End Cryptographic Flow",
    subtitle: "How a vote travels securely through the system",
    render: () => (
      <div className="w-full max-w-5xl flex flex-col items-center justify-center space-y-12 mt-4">
        
        <div className="grid grid-cols-4 gap-4 w-full items-center relative">
          
          {/* Node 1 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col items-center gap-3 z-10">
            <div className="p-4 rounded-xl bg-slate-800 border border-cyan-500/30">
              <User className="w-8 h-8 text-cyan-400" />
            </div>
            <span className="font-semibold text-slate-200">1. Voter</span>
            <span className="text-xs text-slate-400 text-center">Identity verification</span>
          </motion.div>

          {/* Node 2 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col items-center gap-3 z-10">
            <div className="p-4 rounded-xl bg-slate-800 border border-indigo-500/30">
              <EyeOff className="w-8 h-8 text-indigo-400" />
            </div>
            <span className="font-semibold text-slate-200">2. Blind Signature</span>
            <span className="text-xs text-slate-400 text-center">Anonymizes the voter's token</span>
          </motion.div>

          {/* Node 3 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="flex flex-col items-center gap-3 z-10">
            <div className="p-4 rounded-xl bg-slate-800 border border-violet-500/30">
              <FileLock2 className="w-8 h-8 text-violet-400" />
            </div>
            <span className="font-semibold text-slate-200">3. Encrypted Ballot</span>
            <span className="text-xs text-slate-400 text-center">Paillier Encryption + ZKP</span>
          </motion.div>

          {/* Node 4 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0 }} className="flex flex-col items-center gap-3 z-10">
            <div className="p-4 rounded-xl bg-slate-800 border border-fuchsia-500/30">
              <Database className="w-8 h-8 text-fuchsia-400" />
            </div>
            <span className="font-semibold text-slate-200">4. Final Tally</span>
            <span className="text-xs text-slate-400 text-center">Shamir Threshold Decryption</span>
          </motion.div>

          {/* Animated Arrows */}
          <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.5, duration: 2 }} className="absolute top-8 left-[12.5%] h-0.5 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 -z-0" />
          
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-6 mt-8">
          <p className="text-slate-300 text-center text-lg">
            This flow ensures <span className="text-cyan-400 font-semibold">Anonymity</span>, guarantees <span className="text-violet-400 font-semibold">Integrity</span>, and allows <span className="text-fuchsia-400 font-semibold">End-to-End Verifiability</span>.
          </p>
        </motion.div>
      </div>
    )
  },
  {
    id: "rsa",
    title: "1. RSA Blind Signatures",
    subtitle: "Mathematical Unlinkability for Authorization",
    render: () => (
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-12">
        <div className="flex items-center justify-between w-full relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10" />

          {/* Step 1 */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center gap-4 bg-slate-950 p-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <Vote className="w-8 h-8 text-slate-300" />
            </div>
            <span className="text-sm">Raw Token</span>
          </motion.div>

          {/* Step 2 */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-col items-center gap-4 bg-slate-950 p-4">
            <div className="w-16 h-16 rounded-full bg-indigo-900/50 flex items-center justify-center border border-indigo-500/30">
              <EyeOff className="w-8 h-8 text-indigo-400" />
            </div>
            <span className="text-sm">Blinded Token</span>
          </motion.div>

          {/* Step 3 */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.4 }} className="flex flex-col items-center gap-4 bg-slate-950 p-4">
            <div className="w-16 h-16 rounded-full bg-violet-900/50 flex items-center justify-center border border-violet-500/30 relative">
              <EyeOff className="w-8 h-8 text-indigo-400 opacity-50" />
              <Key className="w-6 h-6 text-violet-400 absolute bottom-2 right-2" />
            </div>
            <span className="text-sm text-center">Server Signs<br/>(Blindly)</span>
          </motion.div>

          {/* Step 4 */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 2.0 }} className="flex flex-col items-center gap-4 bg-slate-950 p-4">
            <div className="w-16 h-16 rounded-full bg-cyan-900/50 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <CheckCircle2 className="w-8 h-8 text-cyan-400" />
            </div>
            <span className="text-sm">Unblinded,<br/>Valid Token</span>
          </motion.div>
        </div>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="mt-16 text-lg text-slate-400 max-w-2xl text-center leading-relaxed">
          The server signs the authorization token without ever seeing its contents. This mathematically decouples the voter's real-world identity from their eventual ballot payload.
        </motion.p>
      </div>
    )
  },
  {
    id: "paillier",
    title: "2. Paillier Homomorphic Encryption",
    subtitle: "Tallying Without Decrypting",
    render: () => (
      <div className="flex flex-col items-center justify-center space-y-12 w-full max-w-3xl">
        <div className="flex justify-center items-center gap-8 w-full">
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center gap-4">
             <Lock className="w-10 h-10 text-cyan-500" />
             <div className="text-xl font-mono text-cyan-200">E(m₁)</div>
             <div className="text-sm text-slate-400">Encrypted Vote 1</div>
          </motion.div>

          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8 }} className="text-4xl font-light text-slate-500">
            ×
          </motion.div>

          <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center gap-4">
             <Lock className="w-10 h-10 text-cyan-500" />
             <div className="text-xl font-mono text-cyan-200">E(m₂)</div>
             <div className="text-sm text-slate-400">Encrypted Vote 2</div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="h-12 w-0.5 bg-gradient-to-b from-slate-700 to-cyan-500/50" />

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.8 }} className="bg-cyan-950/30 p-8 rounded-3xl border border-cyan-500/30 flex flex-col items-center gap-4 w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-cyan-500/5 blur-3xl" />
          <Database className="w-12 h-12 text-cyan-400 relative z-10" />
          <div className="text-2xl font-mono text-cyan-100 relative z-10">E(m₁ + m₂) mod n²</div>
          <div className="text-sm text-cyan-400/80 relative z-10">Homomorphically Aggregated Encrypted Tally</div>
        </motion.div>
      </div>
    )
  },
  {
    id: "zkp",
    title: "3. Zero-Knowledge Proofs",
    subtitle: "Proving Validity Without Revealing Data",
    render: () => (
      <div className="flex flex-col items-center space-y-16 mt-8">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-slate-900 ring-1 ring-slate-800 rounded-2xl p-10 flex flex-col items-center gap-6">
            <Layers className="w-16 h-16 text-violet-400" />
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-medium text-slate-200">Disjunctive Chaum-Pedersen Proof</h3>
              <p className="text-slate-400 max-w-md mt-4 text-lg">
                The voter proves the encrypted payload is exactly <span className="text-cyan-400 font-mono font-bold">0</span> or <span className="text-cyan-400 font-mono font-bold">1</span>, preventing malicious actors from casting weighted votes (e.g., casting 100 votes).
              </p>
            </div>
            
            <div className="flex gap-6 mt-6 w-full justify-center">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="px-6 py-3 rounded-lg bg-slate-800 border border-emerald-500/30 font-mono text-sm text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                ✅ Proof Confirms Valid Weight
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="px-6 py-3 rounded-lg bg-slate-800 border border-violet-500/30 font-mono text-sm text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                🔒 Vote Content Remains Hidden
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  },
  {
    id: "shamir",
    title: "4. Shamir's Secret Sharing",
    subtitle: "Distributed Trust & Threshold Decryption",
    render: () => (
      <div className="flex flex-col items-center justify-center space-y-12 w-full max-w-4xl mt-8">
        
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center gap-2">
          <KeyRound className="w-12 h-12 text-amber-400" />
          <span className="text-sm font-semibold text-amber-200">Master Decryption Key</span>
          <span className="text-xs text-slate-400">Never stored in one place</span>
        </motion.div>

        <div className="flex justify-center items-center gap-12 w-full relative">
          {/* Node 1 */}
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-col items-center gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <Users className="w-8 h-8 text-slate-300" />
            <span className="text-xs text-slate-300">Admin 1 Share</span>
          </motion.div>

          {/* Node 2 */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-col items-center gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <Users className="w-8 h-8 text-slate-300" />
            <span className="text-xs text-slate-300">Admin 2 Share</span>
          </motion.div>

          {/* Node 3 */}
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.0 }} className="flex flex-col items-center gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <Users className="w-8 h-8 text-slate-300" />
            <span className="text-xs text-slate-300">Admin 3 Share</span>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="bg-amber-950/30 border border-amber-500/30 p-6 rounded-2xl flex flex-col items-center gap-4 max-w-xl text-center shadow-[0_0_30px_rgba(245,158,11,0.1)]">
          <Unlock className="w-8 h-8 text-amber-500" />
          <p className="text-slate-300">
            The encrypted master tally can <span className="font-bold text-amber-400">only</span> be decrypted when a threshold of election administrators combine their independent key shares.
          </p>
        </motion.div>

      </div>
    )
  },
  {
    id: "demo",
    title: "SigmaVote in Action",
    subtitle: "End-to-End Live Demonstration",
    render: () => (
      <div className="flex flex-col items-center justify-center space-y-16 mt-16">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 1, type: "spring" }}
          className="relative group cursor-default"
        >
          <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition duration-500"></div>
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-600 to-violet-600 flex items-center justify-center relative z-10 shadow-2xl shadow-cyan-500/20 border-4 border-slate-900">
            <Play className="w-12 h-12 text-white ml-2" fill="currentColor" />
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-center space-y-4">
          <h2 className="text-3xl font-light text-slate-200">Now we continue with the software</h2>
          <p className="text-slate-400 text-lg">Switching to the live application demo...</p>
        </motion.div>
      </div>
    )
  }
];

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) setCurrentSlide(s => s + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(s => s - 1);
  };

  const Slide = SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans selection:bg-cyan-500/30 overflow-hidden">
      {/* Header */}
      <header className="p-8 flex justify-between items-center relative z-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <span className="font-semibold text-lg tracking-tight">SigmaVote</span>
        </motion.div>
        <div className="text-slate-500 font-mono text-sm bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          {currentSlide + 1} / {SLIDES.length}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={Slide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full max-w-5xl flex flex-col items-center"
          >
            <div className="text-center mb-12 space-y-4">
              <motion.h1 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400"
              >
                {Slide.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-cyan-400/80 font-light"
              >
                {Slide.subtitle}
              </motion.p>
            </div>

            <div className="w-full flex justify-center">
              {Slide.render()}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Controls */}
      <div className="absolute bottom-12 right-12 flex gap-4 z-20">
        <button 
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <button 
          onClick={nextSlide}
          disabled={currentSlide === SLIDES.length - 1}
          className="w-16 h-16 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.4)] flex items-center justify-center disabled:opacity-50 disabled:hover:bg-cyan-600 transition-all active:scale-95 group"
        >
          <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Keyboard navigation script */}
      <script dangerouslySetInnerHTML={{__html: `
        document.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' || e.key === ' ') {
            const nextBtn = document.querySelectorAll('button')[1];
            if(!nextBtn.disabled) nextBtn.click();
          }
          if (e.key === 'ArrowLeft') {
            const prevBtn = document.querySelectorAll('button')[0];
            if(!prevBtn.disabled) prevBtn.click();
          }
        });
      `}} />
    </div>
  );
}
