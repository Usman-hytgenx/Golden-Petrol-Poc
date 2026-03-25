import { Building2, Car, Banknote, Clock, AlertTriangle, Timer } from "lucide-react";
import type { Branch } from "@/lib/types";

interface KPICardsProps {
  branches: Branch[];
}

export default function KPICards({ branches }: KPICardsProps) {
  const totalBranches = branches.length;
  const totalCars = branches.reduce((s, b) => s + b.carsServicedToday, 0);
  const totalRevenue = branches.reduce((s, b) => s + b.dailyRevenue, 0);
  const avgServiceTime = Math.round(branches.reduce((s, b) => s + b.avgServiceTime, 0) / branches.length);
  const belowTarget = branches.filter((b) => b.status === "critical" || b.status === "watch").length;
  const highWait = branches.filter((b) => b.waitTimeAlert).length;

  const cards = [
    {
      label: "Branches Active",
      value: totalBranches,
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      sub: "All locations online",
    },
    {
      label: "Cars Serviced Today",
      value: totalCars.toLocaleString(),
      icon: Car,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      sub: "Across all branches",
    },
    {
      label: "Daily Revenue",
      value: `SAR ${totalRevenue.toLocaleString()}`,
      icon: Banknote,
      color: "text-[#d4a017]",
      bg: "bg-amber-50",
      border: "border-amber-100",
      sub: "Combined network total",
    },
    {
      label: "Avg Service Time",
      value: `${avgServiceTime} min`,
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      sub: "Network average",
    },
    {
      label: "Branches Below Target",
      value: belowTarget,
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
      sub: "Need attention",
    },
    {
      label: "High Wait Alerts",
      value: highWait,
      icon: Timer,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      sub: "Wait time exceeded",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`bg-white rounded-xl border ${card.border} p-4`}>
          <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <p className="text-xs font-medium text-gray-700 mt-0.5">{card.label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
