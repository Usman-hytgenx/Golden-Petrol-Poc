import { Package, AlertTriangle } from "lucide-react";
import type { StockItem, StockStatus } from "@/lib/types";

interface StockAlertsProps {
  items: StockItem[];
}

const statusConfig: Record<StockStatus, { bar: string; badge: string; label: string }> = {
  ok: { bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "OK" },
  low: { bar: "bg-amber-500", badge: "bg-amber-50 text-amber-700 border-amber-200", label: "Low" },
  critical: { bar: "bg-red-500", badge: "bg-red-50 text-red-700 border-red-200", label: "Critical" },
};

export default function StockAlerts({ items }: StockAlertsProps) {
  const alerts = items.filter((i) => i.status !== "ok").length;
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-900">Stock Levels</h2>
        </div>
        {alerts > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
            <AlertTriangle className="w-3 h-3" />
            {alerts} alert{alerts > 1 ? "s" : ""}
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        {items.map((item) => {
          const cfg = statusConfig[item.status];
          const pct = Math.min(100, Math.round((item.current / (item.min * 3)) * 100));
          return (
            <div key={item.item}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">{item.item}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${cfg.badge}`}>{cfg.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${cfg.bar}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-20 text-right">{item.current} / min {item.min} {item.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
