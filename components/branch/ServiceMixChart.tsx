"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { ServiceMix } from "@/lib/types";

interface ServiceMixChartProps {
  data: ServiceMix;
}

const COLORS = ["#d4a017", "#2563eb", "#10b981", "#8b5cf6", "#f59e0b"];

export default function ServiceMixChart({ data }: ServiceMixChartProps) {
  const chartData = [
    { name: "Oil Change", value: data.oilChange.count, revenue: data.oilChange.revenue },
    { name: "Filter Change", value: data.filterChange.count, revenue: data.filterChange.revenue },
    { name: "Tire Rotation", value: data.tireRotation.count, revenue: data.tireRotation.revenue },
    { name: "Full Service", value: data.fullService.count, revenue: data.fullService.revenue },
    { name: "Top-up", value: data.topUp.count, revenue: data.topUp.revenue },
  ];

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Service Mix</h2>
        <p className="text-xs text-gray-400 mt-0.5">{total} jobs today</p>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} jobs`, name]}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-1.5 mt-2">
          {chartData.map((item, i) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-gray-600">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-800">{item.value} jobs</span>
                <span className="text-gray-400">SAR {item.revenue.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
