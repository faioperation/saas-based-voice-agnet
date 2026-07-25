import React from "react";
import { Icon } from "@iconify/react";
import PlanDistribution from "../../components/PlanDistribution";
import TenantDistribution from "../../components/TenantDistribution";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

let StatCard = ({
  title,
  value,
  icon,
  iconBg = "bg-[#262626]",
  trend,
  trendText,
}) => {
  const isNegative = typeof trend === "string" && trend.startsWith("-");

  return (
    <div className="relative overflow-hidden bg-white shadow-[0_4px_20px_rgba(14,165,233,0.08)] rounded-2xl p-4 border border-sky-100 flex flex-col h-full transition-all duration-300 hover:shadow-[0_8px_30px_rgba(14,165,233,0.12)] hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-center gap-3 relative z-10">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center bg-sky-50 shadow-inner border border-sky-100`}
        >
          <Icon icon={icon} className="text-sky-600 w-6 h-6" />
        </div>
        <span className="text-[15px] font-medium text-gray-900">{title}</span>
      </div>

      {/* Value */}
      <div className="mt-5 mb-5 relative z-10">
        <h3 className="text-xl font-bold text-sky-950">{value}</h3>
      </div>

      {/* Trend */}
      <div className="flex items-center justify-between mt-auto text-[11px] text-sky-700 relative z-10">
        <span className="flex items-center gap-1 font-medium">
          {trend}{" "}
          <Icon
            icon={
              isNegative ? "lucide:arrow-down-right" : "lucide:arrow-up-right"
            }
            className={`text-[10px] ${isNegative ? "text-red-500" : "text-sky-950"}`}
          />
        </span>
        <span className="font-medium">{trendText}</span>
      </div>

      {/* Background Sparkline */}
      <div className="absolute bottom-0 left-0 w-full h-17 pointer-events-none opacity-80">
        <svg
          viewBox="0 0 200 50"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient
              id={`gradient-${title.replace(/\s+/g, "-")}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,45 C30,45 40,15 65,15 C90,15 100,40 130,40 C155,40 170,20 185,20 C195,20 198,30 200,30 L200,50 L0,50 Z"
            fill={`url(#gradient-${title.replace(/\s+/g, "-")})`}
          />
          <path
            d="M0,45 C30,45 40,15 65,15 C90,15 100,40 130,40 C155,40 170,20 185,20 C195,20 198,30 200,30"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2.5"
          />
        </svg>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: dashboardResponse, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/system-owner/dashboard");
      return res.data;
    },
  });

  const dashboardData = dashboardResponse?.data;
  const stats = dashboardData?.stats;

  const statsData = [
    {
      title: "Total Tenants",
      value: stats?.totalTenants?.value ?? 0,
      icon: "lucide:users",
      iconBg: "bg-transparent",
      trend: stats?.totalTenants?.change ?? "0%",
      trendText: stats?.totalTenants?.subtext ?? "",
    },
    {
      title: "Active Subscription",
      value: stats?.activeSubscriptions?.value ?? 0,
      icon: "lucide:phone-call",
      iconBg: "bg-transparent",
      trend: stats?.activeSubscriptions?.change ?? "0%",
      trendText: stats?.activeSubscriptions?.subtext ?? "",
    },
    {
      title: "Monthly Revenue",
      value: `$${stats?.monthlyRevenue?.value ?? 0}`,
      icon: "lucide:dollar-sign",
      iconBg: "bg-transparent",
      trend: stats?.monthlyRevenue?.change ?? "0%",
      trendText: stats?.monthlyRevenue?.subtext ?? "",
    },
    {
      title: "Expiring Tenants",
      value: stats?.expiringTenants?.value ?? 0,
      icon: "lucide:alert-circle",
      iconBg: "bg-transparent",
      trend: stats?.expiringTenants?.change ?? "0%",
      trendText: stats?.expiringTenants?.subtext ?? "",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-sky-700">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-5">
        {statsData.map((stat, index) => (
          <div key={index} className="col-span-12 sm:col-span-6 lg:col-span-3">
            <StatCard {...stat} />
          </div>
        ))}

        <div className="col-span-12 md:col-span-12 lg:col-span-6">
          <PlanDistribution apiData={dashboardData?.planDistribution} />
        </div>

        <div className="col-span-12 md:col-span-12 lg:col-span-6">
          <TenantDistribution
            apiData={dashboardData?.tenantStatusDistribution}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
