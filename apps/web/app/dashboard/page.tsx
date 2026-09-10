/**
 * Dashboard page — role-based stats and overview.
 */

"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/stores/auth";
import {
  Ticket,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

const STATS = [
  { label: "Total Tickets", value: "128", icon: Ticket, color: "bg-blue-500" },
  { label: "Open Tickets", value: "42", icon: Clock, color: "bg-yellow-500" },
  { label: "Resolved", value: "86", icon: CheckCircle, color: "bg-green-500" },
  { label: "Team Members", value: "24", icon: Users, color: "bg-purple-500" },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.roles?.[0] ?? "Staff";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {role} Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Selamat datang, {user?.name}. Berikut ringkasan hari ini.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { text: "Tiket #TK-0012 ditugaskan ke Andi", time: "5 menit lalu", type: "info" },
              { text: "Tiket #TK-0008 menunggu approval Kabag", time: "15 menit lalu", type: "warning" },
              { text: "Customer PT Sejahtera ditambahkan", time: "1 jam lalu", type: "success" },
              { text: "Tiket #TK-0005 diselesaikan", time: "2 jam lalu", type: "success" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                <AlertCircle
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    item.type === "warning"
                      ? "text-yellow-500"
                      : item.type === "success"
                      ? "text-green-500"
                      : "text-blue-500"
                  }`}
                />
                <div>
                  <p className="text-sm text-gray-700">{item.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
