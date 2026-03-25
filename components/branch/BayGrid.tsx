import { Wrench, Clock, User } from "lucide-react";
import type { Bay, BayStatus } from "@/lib/types";

interface BayGridProps {
  bays: Bay[];
}

const statusConfig: Record<BayStatus, { label: string; bg: string; border: string; badge: string; dot: string }> = {
  active: { label: "Active", bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  waiting: { label: "Waiting", bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  idle: { label: "Idle", bg: "bg-gray-50", border: "border-gray-200", badge: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
  maintenance: { label: "Maintenance", bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

export default function BayGrid({ bays }: BayGridProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Bay Status</h2>
        <p className="text-xs text-gray-400 mt-0.5">Live bay activity</p>
      </div>
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {bays.map((bay) => {
          const cfg = statusConfig[bay.status];
          return (
            <div key={bay.id} className={`rounded-xl border p-3.5 ${cfg.bg} ${cfg.border}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">{bay.label}</span>
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>
              {bay.vehicle ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Wrench className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 font-medium">{bay.vehicle}</span>
                  </div>
                  <p className="text-xs text-gray-500">{bay.serviceType}</p>
                  {bay.technician && (
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-500">{bay.technician}</span>
                    </div>
                  )}
                  {bay.startTime && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-500">{bay.startTime} → {bay.estimatedEnd}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-1">
                  {bay.status === "maintenance" ? "Equipment under repair" : "Available for next vehicle"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
