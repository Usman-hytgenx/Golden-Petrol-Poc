import { TrendingUp } from "lucide-react";
import type { Technician, TechnicianStatus } from "@/lib/types";

interface TechnicianTableProps {
  technicians: Technician[];
}

const statusConfig: Record<TechnicianStatus, { label: string; className: string }> = {
  working: { label: "Working", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  break: { label: "On Break", className: "bg-amber-50 text-amber-700 border-amber-200" },
  idle: { label: "Idle", className: "bg-gray-100 text-gray-500 border-gray-200" },
};

export default function TechnicianTable({ technicians }: TechnicianTableProps) {
  const sorted = [...technicians].sort((a, b) => b.jobsCompleted - a.jobsCompleted);
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Technician Output</h2>
          <p className="text-xs text-gray-400 mt-0.5">Jobs completed this shift</p>
        </div>
        <TrendingUp className="w-4 h-4 text-gray-400" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 font-medium uppercase tracking-wide">
              <th className="px-5 py-3 text-left">Technician</th>
              <th className="px-4 py-3 text-center">Jobs</th>
              <th className="px-4 py-3 text-center">Avg Time</th>
              <th className="px-4 py-3 text-right">Revenue (SAR)</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((tech, i) => {
              const cfg = statusConfig[tech.status];
              return (
                <tr key={tech.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#d4a017]/10 flex items-center justify-center text-xs font-bold text-[#d4a017]">
                        {i + 1}
                      </div>
                      <span className="font-medium text-gray-800">{tech.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-gray-900">{tech.jobsCompleted}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={tech.avgServiceTime <= 20 ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
                      {tech.avgServiceTime} min
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-800">{tech.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.className}`}>
                      {cfg.label}
                    </span>
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
