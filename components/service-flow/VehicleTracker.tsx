"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Loader2, Car, Plus } from "lucide-react";
import type { ActiveVehicle, StepStatus } from "@/lib/types";

interface VehicleTrackerProps {
  vehicles: ActiveVehicle[];
}

const stepIcon: Record<StepStatus, React.ReactNode> = {
  done: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  active: <Loader2 className="w-5 h-5 text-[#d4a017] animate-spin" />,
  pending: <Circle className="w-5 h-5 text-gray-300" />,
};

const stepLine: Record<StepStatus, string> = {
  done: "bg-emerald-400",
  active: "bg-gradient-to-b from-emerald-400 to-gray-200",
  pending: "bg-gray-200",
};

export default function VehicleTracker({ vehicles }: VehicleTrackerProps) {
  const [selected, setSelected] = useState(vehicles[0]?.id ?? null);
  const vehicle = vehicles.find((v) => v.id === selected);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Vehicle Journey Tracker</h2>
        <p className="text-xs text-gray-400 mt-0.5">Live service flow — step by step</p>
      </div>

      {/* Vehicle selector */}
      <div className="px-5 pt-4 flex gap-2 flex-wrap">
        {vehicles.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelected(v.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              selected === v.id
                ? "bg-[#d4a017] border-[#d4a017] text-white"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:border-[#d4a017] hover:text-[#d4a017]"
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            {v.plate}
          </button>
        ))}
      </div>

      {vehicle && (
        <div className="p-5">
          {/* Vehicle info */}
          <div className="bg-gray-50 rounded-lg p-3 mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">{vehicle.make}</p>
              <p className="text-xs text-gray-500">{vehicle.serviceType}</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div>
                <p className="text-gray-400">Advisor</p>
                <p className="font-medium text-gray-700">{vehicle.advisor}</p>
              </div>
              <div>
                <p className="text-gray-400">Est. Total</p>
                <p className="font-medium text-gray-700">SAR {vehicle.totalAmount}</p>
              </div>
              {vehicle.addOns.length > 0 && (
                <div className="flex items-center gap-1.5 bg-[#d4a017]/10 text-[#d4a017] px-2 py-0.5 rounded-full border border-[#d4a017]/20">
                  <Plus className="w-3 h-3" />
                  <span>{vehicle.addOns[0]}</span>
                </div>
              )}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-0">
            {vehicle.steps.map((step, i) => {
              const isLast = i === vehicle.steps.length - 1;
              return (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex-shrink-0">{stepIcon[step.status]}</div>
                    {!isLast && (
                      <div className={`w-0.5 flex-1 my-1 min-h-[28px] ${stepLine[step.status]}`} />
                    )}
                  </div>
                  <div className={`pb-5 flex-1 ${isLast ? "pb-0" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm font-medium ${step.status === "pending" ? "text-gray-400" : "text-gray-800"}`}>
                          {step.label}
                        </p>
                        <p className={`text-xs mt-0.5 ${step.status === "pending" ? "text-gray-300" : "text-gray-500"}`}>
                          {step.description}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {step.time !== "—" && (
                          <p className="text-xs font-medium text-gray-700">{step.time}</p>
                        )}
                        <p className="text-xs text-gray-400">{step.duration}</p>
                        {step.person !== "—" && (
                          <p className="text-xs text-gray-400">{step.person}</p>
                        )}
                      </div>
                    </div>
                    {step.status === "active" && (
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs bg-[#d4a017]/10 text-[#d4a017] px-2.5 py-1 rounded-full border border-[#d4a017]/20 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4a017] animate-pulse" />
                        In Progress
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
