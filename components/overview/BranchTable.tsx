"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Package } from "lucide-react";
import type { Branch, BranchStatus } from "@/lib/types";

interface BranchTableProps {
  branches: Branch[];
  stockAlerts: Record<string, number>;
}

const statusConfig: Record<BranchStatus, { label: string; className: string; dot: string }> = {
  "on-track": { label: "On Track", className: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  watch: { label: "Watch", className: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  critical: { label: "Critical", className: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};

function ProgressBar({ value, target, status }: { value: number; target: number; status: BranchStatus }) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  const colors: Record<BranchStatus, string> = {
    "on-track": "bg-emerald-500",
    watch: "bg-amber-500",
    critical: "bg-red-500",
  };
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${colors[status]}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{pct}%</span>
    </div>
  );
}

export default function BranchTable({ branches, stockAlerts }: BranchTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">All Branches — Daily Snapshot</h2>
        <span className="text-xs text-gray-400">Updated just now</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 font-medium uppercase tracking-wide">
              <th className="px-5 py-3 text-left">Branch</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Cars Today</th>
              <th className="px-4 py-3 text-left w-36">vs Target</th>
              <th className="px-4 py-3 text-right">Revenue (SAR)</th>
              <th className="px-4 py-3 text-right">Avg Time</th>
              <th className="px-4 py-3 text-right">Wait Time</th>
              <th className="px-4 py-3 text-right">Bays</th>
              <th className="px-4 py-3 text-center">Stock Alerts</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {branches.map((branch) => {
              const cfg = statusConfig[branch.status];
              const timeOk = branch.avgServiceTime <= branch.avgServiceTimeTarget;
              const alerts = stockAlerts[branch.id] ?? 0;
              return (
                <tr key={branch.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{branch.name}</p>
                    <p className="text-xs text-gray-400">{branch.location}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${cfg.className}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-gray-900">{branch.carsServicedToday}</td>
                  <td className="px-4 py-3.5 w-36">
                    <ProgressBar value={branch.carsServicedToday} target={branch.carsTarget} status={branch.status} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="font-medium text-gray-900">{branch.dailyRevenue.toLocaleString()}</span>
                    <div className="flex items-center justify-end gap-0.5 text-xs mt-0.5">
                      {branch.dailyRevenue >= branch.revenueTarget ? (
                        <><TrendingUp className="w-3 h-3 text-emerald-500" /><span className="text-emerald-600">Above</span></>
                      ) : (
                        <><TrendingDown className="w-3 h-3 text-red-500" /><span className="text-red-600">Below</span></>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`font-medium ${timeOk ? "text-emerald-600" : "text-red-600"}`}>{branch.avgServiceTime} min</span>
                    <p className="text-xs text-gray-400">target {branch.avgServiceTimeTarget}m</p>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`font-medium ${branch.waitTimeAlert ? "text-red-600" : "text-gray-700"}`}>{branch.highWaitTime} min</span>
                    {branch.waitTimeAlert && <p className="text-xs text-red-500">Alert</p>}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-gray-700">{branch.activeBays}/{branch.totalBays}</span>
                    <p className="text-xs text-gray-400">active</p>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {alerts > 0 ? (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium bg-red-50 text-red-700 border-red-200">
                        <Package className="w-3 h-3" />
                        {alerts}
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium bg-gray-50 text-gray-400 border-gray-200">
                        <Package className="w-3 h-3" />
                        OK
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/branch/${branch.id}`}
                      className="p-1.5 text-gray-400 hover:text-[#d4a017] hover:bg-amber-50 rounded-lg transition-colors inline-flex"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
