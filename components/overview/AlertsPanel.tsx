import Link from "next/link";
import { AlertTriangle, Package, Timer, TrendingDown } from "lucide-react";
import type { Alert, AlertSeverity, AlertType } from "@/lib/types";

interface AlertsPanelProps {
  alerts: Alert[];
}

const severityConfig: Record<AlertSeverity, { className: string; dot: string }> = {
  critical: { className: "bg-red-50 border-red-200", dot: "bg-red-500" },
  warning: { className: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  info: { className: "bg-blue-50 border-blue-200", dot: "bg-blue-500" },
};

const typeIcon: Record<AlertType, React.ElementType> = {
  "wait-time": Timer,
  stock: Package,
  performance: TrendingDown,
};

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h2 className="text-sm font-semibold text-gray-900">Active Alerts</h2>
        </div>
        <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-medium">{alerts.length}</span>
      </div>
      <div className="p-3 space-y-2 max-h-[320px] overflow-y-auto">
        {alerts.map((alert) => {
          const cfg = severityConfig[alert.severity];
          const Icon = typeIcon[alert.type];
          return (
            <div key={alert.id} className={`rounded-lg border p-3 ${cfg.className}`}>
              <div className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Icon className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                    <Link href={`/branch/${alert.branchId}`} className="text-xs font-semibold text-gray-800 hover:text-[#d4a017] truncate">
                      {alert.branch}
                    </Link>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
