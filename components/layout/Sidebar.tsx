"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, GitBranch, Gauge } from "lucide-react";

const navItems = [
  { href: "/overview", label: "Head Office View", icon: LayoutDashboard },
  { href: "/branch/riyadh-main", label: "Branch Detail", icon: Building2 },
  { href: "/service-flow", label: "Service Flow", icon: GitBranch },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0f1623] border-r border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#d4a017] flex items-center justify-center">
            <Gauge className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Golden Petrol</p>
            <p className="text-gray-400 text-xs">Quick Lube Network</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Operations</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/overview" && pathname.startsWith(href.split("/").slice(0, 2).join("/")));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#d4a017]/10 text-[#d4a017] border border-[#d4a017]/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-800">
        <p className="text-xs text-gray-600">POC Demo · v1.0</p>
        <p className="text-xs text-gray-600 mt-0.5">Data as of today</p>
      </div>
    </aside>
  );
}
