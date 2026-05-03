"use client";

import { Verified } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function ResultsChart({
  results,
}: {
  results: {
    candidates: { name: string; party: string | null; votes: number }[];
    ballotCount: number;
  };
}) {
  const chartData = results.candidates.map((c, i) => ({
    name: c.name,
    party: c.party,
    votes: c.votes,
    percentage:
      results.ballotCount > 0 ? (c.votes / results.ballotCount) * 100 : 0,
    isWinner: i === 0,
  }));

  const maxVotes = Math.max(...results.candidates.map((c) => c.votes), 1);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white font-serif tracking-tight">
        Final Tally Breakdown
      </h2>

      {/* Recharts Bar Chart */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-medium text-muted-foreground mb-4">
          Vote Distribution
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis
                dataKey="name"
                stroke="#666"
                tick={{ fill: "#999", fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#666" tick={{ fill: "#999", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #262626",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#fff" }}
                formatter={(value) => [`${value ?? 0} votes`, "Votes"]}
              />
              <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isWinner ? "hsl(215 80% 49%)" : "hsl(0 0% 30%)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Results Table */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-12 gap-6 p-6 border-b border-[#262626] bg-[#1A1A1A]/50">
          <div className="col-span-1"></div>
          <div className="col-span-6 font-bold text-muted-foreground text-[10px] uppercase tracking-[0.2em]">
            Candidate
          </div>
          <div className="col-span-3 text-right font-bold text-muted-foreground text-[10px] uppercase tracking-[0.2em]">
            Votes
          </div>
          <div className="col-span-2 text-right font-bold text-muted-foreground text-[10px] uppercase tracking-[0.2em]">
            Percentage
          </div>
        </div>

        <div className="divide-y divide-[#262626]">
          {results.candidates.map((candidate, i) => {
            const percentage =
              results.ballotCount > 0
                ? (candidate.votes / results.ballotCount) * 100
                : 0;
            const initials = candidate.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={candidate.name}
                className={`grid grid-cols-12 gap-6 p-8 items-center transition-all hover:bg-white/[0.02] ${i === 0 ? "bg-primary/5" : ""}`}
              >
                <div className="col-span-1 flex justify-center">
                  {i === 0 ? (
                    <Verified className="w-8 h-8 text-primary shadow-[0_0_20px_rgba(29,132,221,0.3)]" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-[#262626] flex items-center justify-center text-muted-foreground text-xs font-bold">
                      {i + 1}
                    </div>
                  )}
                </div>
                <div className="col-span-6 flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white font-bold text-xl border border-white/5 group-hover:border-primary/30 transition-all">
                    {initials}
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white block leading-none mb-1">
                      {candidate.name}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                      {candidate.party}
                    </span>
                  </div>
                </div>
                <div className="col-span-3 text-right">
                  <span className="text-2xl font-mono text-muted-foreground">
                    <NumberTicker value={candidate.votes} />
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <span
                    className={`text-2xl font-bold ${i === 0 ? "text-primary" : "text-white"}`}
                  >
                    {percentage.toFixed(2)}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="col-span-12 mt-6">
                  <div className="w-full bg-[#1A1A1A] rounded-full h-2 overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? "bg-primary shadow-[0_0_15px_rgba(29,132,221,0.5)]" : "bg-muted-foreground/30"}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
