import TopBar from "@/components/layout/TopBar";
import VehicleTracker from "@/components/service-flow/VehicleTracker";
import QueueView from "@/components/service-flow/QueueView";
import serviceFlowData from "@/data/service-flow.json";
import type { ActiveVehicle, WaitingVehicle } from "@/lib/types";

const activeVehicles = serviceFlowData.activeVehicles as ActiveVehicle[];
const waitingQueue = serviceFlowData.waitingQueue as WaitingVehicle[];

export default function ServiceFlowPage() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar
        title="Service Flow"
        subtitle="Live vehicle journey — Riyadh Main Branch"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Summary strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "In Service", value: activeVehicles.length, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
              { label: "Waiting", value: waitingQueue.length, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
              { label: "Completed Today", value: 72, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
              { label: "Avg Steps Time", value: "18 min", color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
            ].map((s) => (
              <div key={s.label} className={`bg-white rounded-xl border p-4 ${s.bg}`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs font-medium text-gray-600 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Flow steps legend */}
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Service Journey — 7 Steps</p>
            <div className="flex items-center gap-0 flex-wrap">
              {[
                "Arrival & Check-in",
                "Job Card Opened",
                "Bay Assigned",
                "Service In Progress",
                "Add-on Logged",
                "Payment Processed",
                "Job Closed",
              ].map((step, i, arr) => (
                <div key={step} className="flex items-center">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="w-5 h-5 rounded-full bg-[#d4a017] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-xs text-gray-700 font-medium whitespace-nowrap">{step}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-6 h-0.5 bg-gray-300 mx-0.5 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VehicleTracker vehicles={activeVehicles} />
            </div>
            <div className="lg:col-span-1">
              <QueueView queue={waitingQueue} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
