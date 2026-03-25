export type BranchStatus = "on-track" | "watch" | "critical";
export type BayStatus = "active" | "idle" | "waiting" | "maintenance";
export type TechnicianStatus = "working" | "break" | "idle";
export type StockStatus = "ok" | "low" | "critical";
export type StepStatus = "done" | "active" | "pending";
export type AlertSeverity = "critical" | "warning" | "info";
export type AlertType = "wait-time" | "stock" | "performance";

export interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  operatingHours: string;
  carsServicedToday: number;
  carsTarget: number;
  carsWaiting: number;
  activeBays: number;
  totalBays: number;
  avgServiceTime: number;
  avgServiceTimeTarget: number;
  dailyRevenue: number;
  revenueTarget: number;
  status: BranchStatus;
  lastUpdated: string;
  waitTimeAlert: boolean;
  highWaitTime: number;
}

export interface Bay {
  id: number;
  label: string;
  status: BayStatus;
  technician: string | null;
  vehicle: string | null;
  serviceType: string | null;
  startTime: string | null;
  estimatedEnd: string | null;
}

export interface Technician {
  id: number;
  name: string;
  jobsCompleted: number;
  avgServiceTime: number;
  status: TechnicianStatus;
  shiftStart: string;
  revenue: number;
}

export interface ServiceMix {
  oilChange: { count: number; revenue: number; avgPrice: number };
  filterChange: { count: number; revenue: number; avgPrice: number };
  tireRotation: { count: number; revenue: number; avgPrice: number };
  topUp: { count: number; revenue: number; avgPrice: number };
  fullService: { count: number; revenue: number; avgPrice: number };
}

export interface StockItem {
  item: string;
  current: number;
  min: number;
  unit: string;
  status: StockStatus;
}

export interface HourlyData {
  hour: string;
  cars: number;
  revenue: number;
}

export interface ServiceStep {
  id: number;
  label: string;
  description: string;
  time: string;
  duration: string;
  status: StepStatus;
  person: string;
}

export interface ActiveVehicle {
  id: string;
  plate: string;
  make: string;
  serviceType: string;
  advisor: string;
  currentStep: number;
  totalAmount: number;
  addOns: string[];
  steps: ServiceStep[];
}

export interface WaitingVehicle {
  id: string;
  plate: string;
  make: string;
  serviceType: string;
  waitTime: string;
  priority: "normal" | "vip";
}

export interface Alert {
  id: number;
  type: AlertType;
  branch: string;
  branchId: string;
  message: string;
  severity: AlertSeverity;
  time: string;
}
