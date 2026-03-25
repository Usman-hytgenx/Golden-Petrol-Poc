import TopBar from "@/components/layout/TopBar";
import KPICards from "@/components/overview/KPICards";
import BranchTable from "@/components/overview/BranchTable";
import AlertsPanel from "@/components/overview/AlertsPanel";
import BranchSideBySide from "@/components/overview/BranchSideBySide";
import BranchComparison from "@/components/overview/BranchComparison";
import branchesData from "@/data/branches.json";
import alertsData from "@/data/alerts.json";
import stockData from "@/data/stock.json";
import type { Branch, Alert, StockItem } from "@/lib/types";

const branches = branchesData as Branch[];
const alerts = alertsData as Alert[];
const stock = stockData as Record<string, StockItem[]>;

const stockAlerts: Record<string, number> = {};
for (const [branchId, items] of Object.entries(stock)) {
  stockAlerts[branchId] = items.filter((i) => i.status !== "ok").length;
}

export default function OverviewPage() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar
        title="Head Office Overview"
        subtitle="Golden Petrol Quick Lube Network · All Branches · Today"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">

          {/* KPIs */}
          <KPICards branches={branches} />

          {/* Branch listing + alerts */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              <BranchTable branches={branches} stockAlerts={stockAlerts} />
            </div>
            <div className="xl:col-span-1">
              <AlertsPanel alerts={alerts} />
            </div>
          </div>

          {/* Side-by-side branch comparison */}
          <BranchSideBySide branches={branches} stockAlerts={stockAlerts} />

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Chart comparison */}
          <BranchComparison branches={branches} />

        </div>
      </div>
    </div>
  );
}
