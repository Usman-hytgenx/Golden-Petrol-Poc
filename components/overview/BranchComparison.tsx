"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, Cell,
} from "recharts";
import type { Branch } from "@/lib/types";

interface BranchComparisonProps {
  branches: Branch[];
}

const SHORT: Record<string, string> = {
  "riyadh-main": "Riyadh M.",
  "jeddah-north": "Jeddah N.",
  "dammam-1": "Dammam",
  "riyadh-east": "Riyadh E.",
  khobar: "Khobar",
  medina: "Madinah",
};

const STATUS_COLOR: Record<string, string> = {
  "on-track": "#10b981",
  watch: "#f59e0b",
  critical: "#ef4444",
};

const TOOLTIP_STYLE = { fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" };

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5 mb-4">{subtitle}</p>
      {children}
    </div>
  );
}

export default function BranchComparison({ branches }: BranchComparisonProps) {
  const carsData = branches.map((b) => ({
    name: SHORT[b.id] ?? b.name,
    Actual: b.carsServicedToday,
    Target: b.carsTarget,
    status: b.status,
  }));

  const revenueData = branches.map((b) => ({
    name: SHORT[b.id] ?? b.name,
    Revenue: b.dailyRevenue,
    Target: b.revenueTarget,
    status: b.status,
  }));

  const timeData = branches.map((b) => ({
    name: SHORT[b.id] ?? b.name,
    "Avg Time (min)": b.avgServiceTime,
    Target: b.avgServiceTimeTarget,
    status: b.status,
  }));

  const waitData = branches.map((b) => ({
    name: SHORT[b.id] ?? b.name,
    "Wait Time (min)": b.highWaitTime,
    status: b.status,
    alert: b.waitTimeAlert,
  }));

  const avgTarget = Math.round(branches.reduce((s, b) => s + b.avgServiceTimeTarget, 0) / branches.length);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Branch-by-Branch Comparison</h2>
          <p className="text-xs text-gray-400 mt-0.5">Key metrics compared across all locations</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />On Track</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" />Watch</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" />Critical</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Cars Serviced vs Target */}
        <ChartCard title="Cars Serviced Today" subtitle="Actual vs daily target — per branch">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={carsData} margin={{ top: 4, right: 4, left: -14, bottom: 0 }} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "#f9fafb" }} />
              <Bar dataKey="Actual" radius={[4, 4, 0, 0]} maxBarSize={28}>
                {carsData.map((d, i) => (
                  <Cell key={i} fill={STATUS_COLOR[d.status]} />
                ))}
              </Bar>
              <Bar dataKey="Target" radius={[4, 4, 0, 0]} fill="#e5e7eb" maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 rounded-sm bg-emerald-500 inline-block" />Actual</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 rounded-sm bg-gray-200 inline-block" />Target</span>
          </div>
        </ChartCard>

        {/* Daily Revenue vs Target */}
        <ChartCard title="Daily Revenue (SAR)" subtitle="Actual vs revenue target — per branch">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} margin={{ top: 4, right: 4, left: 8, bottom: 0 }} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                cursor={{ fill: "#f9fafb" }}
                formatter={(v) => [`SAR ${Number(v).toLocaleString()}`, ""]}
              />
              <Bar dataKey="Revenue" radius={[4, 4, 0, 0]} maxBarSize={28}>
                {revenueData.map((d, i) => (
                  <Cell key={i} fill={STATUS_COLOR[d.status]} />
                ))}
              </Bar>
              <Bar dataKey="Target" radius={[4, 4, 0, 0]} fill="#e5e7eb" maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 rounded-sm bg-emerald-500 inline-block" />Actual</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 rounded-sm bg-gray-200 inline-block" />Target</span>
          </div>
        </ChartCard>

        {/* Avg Service Time */}
        <ChartCard title="Average Service Time" subtitle="Minutes per vehicle — target is 20 min">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={timeData} margin={{ top: 4, right: 4, left: -14, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[0, 35]} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                cursor={{ fill: "#f9fafb" }}
                formatter={(v) => [`${v} min`, ""]}
              />
              <ReferenceLine y={avgTarget} stroke="#d4a017" strokeDasharray="5 3" label={{ value: `Target ${avgTarget}m`, position: "insideTopRight", fontSize: 10, fill: "#d4a017" }} />
              <Bar dataKey="Avg Time (min)" radius={[4, 4, 0, 0]} maxBarSize={32}>
                {timeData.map((d, i) => (
                  <Cell key={i} fill={d["Avg Time (min)"] <= d.Target ? "#10b981" : "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 rounded-sm bg-emerald-500 inline-block" />Within target</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 rounded-sm bg-red-500 inline-block" />Over target</span>
            <span className="flex items-center gap-1.5"><span className="w-5 border-t border-dashed border-[#d4a017] inline-block" />Target line</span>
          </div>
        </ChartCard>

        {/* Wait Time */}
        <ChartCard title="Customer Wait Time" subtitle="Minutes waiting before bay — flag at 25 min">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={waitData} margin={{ top: 4, right: 4, left: -14, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[0, 40]} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                cursor={{ fill: "#f9fafb" }}
                formatter={(v) => [`${v} min`, ""]}
              />
              <ReferenceLine y={25} stroke="#ef4444" strokeDasharray="5 3" label={{ value: "Alert 25m", position: "insideTopRight", fontSize: 10, fill: "#ef4444" }} />
              <Bar dataKey="Wait Time (min)" radius={[4, 4, 0, 0]} maxBarSize={32}>
                {waitData.map((d, i) => (
                  <Cell key={i} fill={d.alert ? "#ef4444" : d["Wait Time (min)"] >= 20 ? "#f59e0b" : "#10b981"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 rounded-sm bg-emerald-500 inline-block" />Normal</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 rounded-sm bg-amber-500 inline-block" />Elevated</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 rounded-sm bg-red-500 inline-block" />Alert</span>
          </div>
        </ChartCard>

      </div>
    </div>
  );
}
