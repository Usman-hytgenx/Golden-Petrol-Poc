"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Car, Banknote, Clock, Timer, Users, Package,
  CheckCircle2, AlertTriangle, MinusCircle, ArrowRight, X, Plus,
} from "lucide-react";
import type { Branch, BranchStatus } from "@/lib/types";

interface BranchSideBySideProps {
  branches: Branch[];
  stockAlerts: Record<string, number>;
}

const STATUS_CONFIG: Record<BranchStatus, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  "on-track": { label: "On Track", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-300" },
  watch: { label: "Watch", icon: MinusCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-300" },
  critical: { label: "Critical", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", border: "border-red-300" },
};

const BRANCH_COLORS = ["#d4a017", "#2563eb", "#10b981", "#8b5cf6"];

const METRICS = [
  { key: "cars", label: "Cars Serviced", icon: Car },
  { key: "target", label: "Car Target", icon: Car },
  { key: "revenue", label: "Daily Revenue", icon: Banknote },
  { key: "avgTime", label: "Avg Service Time", icon: Clock },
  { key: "waitTime", label: "Wait Time", icon: Timer },
  { key: "bays", label: "Active Bays", icon: Users },
  { key: "stock", label: "Stock Alerts", icon: Package },
];

function getValue(branch: Branch, key: string, stockAlerts: Record<string, number>) {
  switch (key) {
    case "cars": return { raw: branch.carsServicedToday, display: `${branch.carsServicedToday}`, sub: `target ${branch.carsTarget}`, ok: branch.carsServicedToday >= branch.carsTarget };
    case "target": return { raw: branch.carsTarget, display: `${branch.carsTarget}`, sub: "daily goal", ok: true };
    case "revenue": return { raw: branch.dailyRevenue, display: `SAR ${branch.dailyRevenue.toLocaleString()}`, sub: `target ${branch.revenueTarget.toLocaleString()}`, ok: branch.dailyRevenue >= branch.revenueTarget };
    case "avgTime": return { raw: branch.avgServiceTime, display: `${branch.avgServiceTime} min`, sub: `target ${branch.avgServiceTimeTarget} min`, ok: branch.avgServiceTime <= branch.avgServiceTimeTarget };
    case "waitTime": return { raw: branch.highWaitTime, display: `${branch.highWaitTime} min`, sub: branch.waitTimeAlert ? "Alert raised" : "Normal", ok: !branch.waitTimeAlert };
    case "bays": return { raw: branch.activeBays, display: `${branch.activeBays} / ${branch.totalBays}`, sub: "bays active", ok: branch.activeBays >= branch.totalBays * 0.6 };
    case "stock": {
      const n = stockAlerts[branch.id] ?? 0;
      return { raw: n, display: n === 0 ? "All OK" : `${n} alert${n > 1 ? "s" : ""}`, sub: n === 0 ? "No issues" : "Needs restock", ok: n === 0 };
    }
    default: return { raw: 0, display: "—", sub: "", ok: true };
  }
}

function getBest(branches: Branch[], key: string, stockAlerts: Record<string, number>): number {
  const raws = branches.map((b) => getValue(b, key, stockAlerts).raw);
  if (key === "avgTime" || key === "waitTime" || key === "stock") return Math.min(...raws);
  return Math.max(...raws);
}

export default function BranchSideBySide({ branches, stockAlerts }: BranchSideBySideProps) {
  const [selected, setSelected] = useState<string[]>(branches.slice(0, 3).map((b) => b.id));
  const [showPicker, setShowPicker] = useState(false);

  const selectedBranches = selected.map((id) => branches.find((b) => b.id === id)!).filter(Boolean);

  function toggle(id: string) {
    if (selected.includes(id)) {
      if (selected.length > 1) setSelected(selected.filter((s) => s !== id));
    } else {
      if (selected.length < 4) setSelected([...selected, id]);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Side-by-Side Branch Comparison</h2>
          <p className="text-xs text-gray-400 mt-0.5">Select up to 4 branches to compare key indicators head-to-head</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {selectedBranches.map((b, i) => (
            <span
              key={b.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium"
              style={{ borderColor: BRANCH_COLORS[i], color: BRANCH_COLORS[i], backgroundColor: `${BRANCH_COLORS[i]}10` }}
            >
              {b.name}
              {selected.length > 1 && (
                <button onClick={() => toggle(b.id)} className="hover:opacity-60 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
          {selected.length < 4 && (
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-gray-300 text-xs text-gray-400 hover:border-[#d4a017] hover:text-[#d4a017] transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Branch
            </button>
          )}
        </div>
      </div>

      {/* Branch picker dropdown */}
      {showPicker && (
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-2">
          {branches.filter((b) => !selected.includes(b.id)).map((b) => (
            <button
              key={b.id}
              onClick={() => { toggle(b.id); setShowPicker(false); }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-[#d4a017] hover:text-[#d4a017] bg-white transition-colors"
            >
              {b.name}
            </button>
          ))}
          {branches.filter((b) => !selected.includes(b.id)).length === 0 && (
            <p className="text-xs text-gray-400">All branches already selected</p>
          )}
        </div>
      )}

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Branch header row */}
          <thead>
            <tr>
              <th className="w-40 px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                Metric
              </th>
              {selectedBranches.map((branch, i) => {
                const cfg = STATUS_CONFIG[branch.status];
                const StatusIcon = cfg.icon;
                return (
                  <th key={branch.id} className="px-5 py-4 border-b border-gray-100 text-left min-w-[180px]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: BRANCH_COLORS[i] }} />
                          <p className="text-sm font-bold text-gray-900">{branch.name}</p>
                        </div>
                        <p className="text-xs text-gray-400 pl-4">{branch.location}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color} border-current/20 flex-shrink-0`}>
                        <StatusIcon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Metric rows */}
          <tbody>
            {METRICS.map((metric, mi) => {
              const bestRaw = getBest(selectedBranches, metric.key, stockAlerts);
              const Icon = metric.icon;
              return (
                <tr key={metric.key} className={mi % 2 === 0 ? "bg-white" : "bg-gray-50/40"}>
                  {/* Metric label */}
                  <td className="px-5 py-3.5 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-600">{metric.label}</span>
                    </div>
                  </td>

                  {/* Branch values */}
                  {selectedBranches.map((branch, i) => {
                    const val = getValue(branch, metric.key, stockAlerts);
                    const isBest = val.raw === bestRaw;
                    return (
                      <td key={branch.id} className="px-5 py-3.5 border-b border-gray-50">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-sm font-bold ${val.ok ? "text-gray-900" : "text-red-600"}`}>
                                {val.display}
                              </span>
                              {isBest && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                                  style={{ backgroundColor: `${BRANCH_COLORS[i]}15`, color: BRANCH_COLORS[i] }}>
                                  Best
                                </span>
                              )}
                            </div>
                            <p className={`text-xs mt-0.5 ${val.ok ? "text-gray-400" : "text-red-400"}`}>{val.sub}</p>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* View detail row */}
            <tr className="bg-gray-50">
              <td className="px-5 py-3.5 text-xs text-gray-400 font-medium">Full Detail</td>
              {selectedBranches.map((branch) => (
                <td key={branch.id} className="px-5 py-3.5">
                  <Link
                    href={`/branch/${branch.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#d4a017] hover:underline"
                  >
                    View Branch <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
