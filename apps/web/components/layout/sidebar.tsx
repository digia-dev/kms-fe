/**
 * Sidebar — role-based navigation menu.
 */

"use client";

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  FolderOpen,
  Ticket,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  permission?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tickets", href: "/tickets", icon: Ticket, permission: "ticket.read" },
  { label: "Customers", href: "/customers", icon: FolderOpen, permission: "customer.read" },
  { label: "Users", href: "/users", icon: Users, permission: "admin.user" },
  { label: "Roles", href: "/roles", icon: ShieldCheck, permission: "admin.permission" },
  { label: "Directorates", href: "/directorates", icon: Building2, permission: "admin.workflow" },
  { label: "Reports", href: "/reports", icon: BarChart3, permission: "report.team" },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [collapsed, setCollapsed] = useState(false);

  // Filter nav items based on user permissions (simplified — role name check)
  const role = user?.roles?.[0] ?? "Staff";
  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!item.permission) return true;
    // Admin/Direktur see everything
    if (role === "Direktur" || role === "General Manager") return true;
    if (role === "Kabag") return true;
    // Staff: limited
    const staffPerms = ["ticket.read", "customer.read", "task.read"];
    return staffPerms.includes(item.permission);
  });

  return (
    <aside
      className={cn(
        "h-screen bg-navy-900 text-white flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">K</span>
        </div>
        {!collapsed && <span className="text-lg font-bold">KMS</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center py-3 border-t border-white/10 text-gray-400 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </aside>
  );
}
