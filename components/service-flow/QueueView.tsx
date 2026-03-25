import { Clock, Star } from "lucide-react";
import type { WaitingVehicle } from "@/lib/types";

interface QueueViewProps {
  queue: WaitingVehicle[];
}

export default function QueueView({ queue }: QueueViewProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Waiting Queue</h2>
          <p className="text-xs text-gray-400 mt-0.5">Vehicles awaiting bay assignment</p>
        </div>
        <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-medium">{queue.length}</span>
      </div>
      <div className="p-4 space-y-2">
        {queue.map((v, i) => (
          <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-amber-50/30 hover:border-amber-100 transition-colors">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-gray-800">{v.plate}</p>
                {v.priority === "vip" && (
                  <Star className="w-3 h-3 text-[#d4a017] fill-[#d4a017]" />
                )}
              </div>
              <p className="text-xs text-gray-500">{v.make} · {v.serviceType}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                <Clock className="w-3 h-3" />
                {v.waitTime}
              </div>
              <p className="text-xs text-gray-400">waiting</p>
            </div>
          </div>
        ))}
        {queue.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-6">No vehicles currently waiting</p>
        )}
      </div>
    </div>
  );
}
