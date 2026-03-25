import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Car, Clock, Banknote, Users, Timer, MapPin } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import BayGrid from "@/components/branch/BayGrid";
import TechnicianTable from "@/components/branch/TechnicianTable";
import ServiceMixChart from "@/components/branch/ServiceMixChart";
import HourlyRevenue from "@/components/branch/HourlyRevenue";
import StockAlerts from "@/components/branch/StockAlerts";
import branchesData from "@/data/branches.json";
import baysData from "@/data/bays.json";
import techniciansData from "@/data/technicians.json";
import servicesData from "@/data/services.json";
import stockData from "@/data/stock.json";
import hourlyData from "@/data/hourly-revenue.json";
import type { Branch, Bay, Technician, ServiceMix, StockItem, HourlyData } from "@/lib/types";

const branches = branchesData as Branch[];
const bays = baysData as Record<string, Bay[]>;
const technicians = techniciansData as Record<string, Technician[]>;
const services = servicesData as Record<string, ServiceMix>;
const stock = stockData as Record<string, StockItem[]>;
const hourly = hourlyData as Record<string, HourlyData[]>;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BranchPage({ params }: PageProps) {
  const { id } = await params;
  const branch = branches.find((b) => b.id === id);
  if (!branch) notFound();

  const branchBays = bays[id] ?? [];
  const branchTechs = technicians[id] ?? [];
  const branchServices = services[id];
  const branchStock = stock[id] ?? [];
  const branchHourly = hourly[id] ?? [];

  const statusColors = {
    "on-track": "text-emerald-600 bg-emerald-50 border-emerald-200",
    watch: "text-amber-600 bg-amber-50 border-amber-200",
    critical: "text-red-600 bg-red-50 border-red-200",
  };
  const statusLabels = { "on-track": "On Track", watch: "Watch", critical: "Critical" };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar
        title={branch.name}
        subtitle={`Branch Detail · ${branch.location} · Today`}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Back + Branch Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                href="/overview"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 mb-3 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Overview
              </Link>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">{branch.name}</h2>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-xs font-semibold ${statusColors[branch.status]}`}>
                  {statusLabels[branch.status]}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                <MapPin className="w-3 h-3" />
                {branch.location} · Manager: {branch.manager} · {branch.operatingHours}
              </div>
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Cars Today", value: branch.carsServicedToday, icon: Car, target: `target ${branch.carsTarget}`, ok: branch.carsServicedToday >= branch.carsTarget },
              { label: "Cars Waiting", value: branch.carsWaiting, icon: Timer, target: "in queue", ok: branch.carsWaiting < 6 },
              { label: "Active Bays", value: `${branch.activeBays}/${branch.totalBays}`, icon: Users, target: "bays in use", ok: true },
              { label: "Avg Service Time", value: `${branch.avgServiceTime}m`, icon: Clock, target: `target ${branch.avgServiceTimeTarget}m`, ok: branch.avgServiceTime <= branch.avgServiceTimeTarget },
              { label: "Daily Revenue", value: `SAR ${branch.dailyRevenue.toLocaleString()}`, icon: Banknote, target: `target ${branch.revenueTarget.toLocaleString()}`, ok: branch.dailyRevenue >= branch.revenueTarget },
              { label: "Wait Time", value: `${branch.highWaitTime}m`, icon: Timer, target: branch.waitTimeAlert ? "Alert!" : "Normal", ok: !branch.waitTimeAlert },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${kpi.ok ? "bg-emerald-50" : "bg-red-50"}`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.ok ? "text-emerald-600" : "text-red-600"}`} />
                </div>
                <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs font-medium text-gray-600 mt-0.5">{kpi.label}</p>
                <p className={`text-xs mt-0.5 ${kpi.ok ? "text-gray-400" : "text-red-500 font-medium"}`}>{kpi.target}</p>
              </div>
            ))}
          </div>

          {/* Bay Grid */}
          <BayGrid bays={branchBays} />

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {branchServices && <ServiceMixChart data={branchServices} />}
            <HourlyRevenue data={branchHourly} />
          </div>

          {/* Technicians + Stock */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TechnicianTable technicians={branchTechs} />
            </div>
            <div className="lg:col-span-1">
              <StockAlerts items={branchStock} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return branchesData.map((b) => ({ id: b.id }));
}
