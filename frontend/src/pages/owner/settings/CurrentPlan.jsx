import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Loader2 } from "lucide-react";

const CurrentPlan = () => {
  const axiosSecure = useAxiosSecure();

  const { data: subResponse, isLoading } = useQuery({
    queryKey: ["mySubscription"],
    queryFn: async () => {
      const response = await axiosSecure.get(
        "/business-owner/subscription/my-subscription",
      );
      return response.data;
    },
  });

  const sub = subResponse?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100px] mt-6 mb-12">
        <Loader2 className="animate-spin text-[#2563EB] w-8 h-8" />
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="relative bg-white border border-[#272727] rounded-2xl p-6 mt-6 mb-12 flex flex-col items-center justify-center gap-4">
        <p className="text-sky-700">You do not have an active subscription.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="relative bg-white border border-slate-100 rounded-[24px] p-6 md:p-8 mt-6 mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Badge */}
      <div className="absolute -top-3.5 left-8 bg-white border border-slate-200 px-4 py-1.5 rounded-full text-[13px] text-sky-600 font-semibold shadow-sm">
        Current Plan
      </div>

      {/* Left Content */}
      <div className="flex flex-col gap-2 pt-2 sm:pt-0">
        <div className="flex items-center gap-4 mb-1">
          <h2 className="text-[28px] sm:text-[32px] font-bold text-slate-800 tracking-tight leading-none">
            {sub?.plan?.name || "Unknown Plan"}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-[12px] font-bold tracking-wide mt-1 ${sub?.status === "active" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-rose-50 text-rose-600 border border-rose-200"}`}
          >
            {sub?.status === "active" ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>
        <p className="text-[15px] font-medium text-slate-500 mb-2">
          <span className="text-slate-800 font-bold">${sub?.plan?.priceMonthly}</span>/month
        </p>
        <div className="flex items-center gap-3 text-[14px] text-slate-500 mt-2">
          <span>
            Start Date :{" "}
            <span className="font-medium text-slate-700">{formatDate(
              sub?.currentPeriodStart || sub?.createdAt || sub?.startDate,
            )}</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          <span>
            End Date : <span className="font-medium text-slate-700">{formatDate(sub?.currentPeriodEnd || sub?.endDate)}</span>
          </span>
        </div>
      </div>

      {/* Right Button */}
      <div>
        <button
          disabled={sub?.status === "active"}
          className={`px-8 py-3 rounded-xl text-[14.5px] font-semibold transition-all whitespace-nowrap shadow-sm ${
            sub?.status === "active"
              ? "border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
              : "border border-transparent bg-sky-600 hover:bg-sky-700 text-white hover:shadow-md hover:shadow-sky-600/20 cursor-pointer"
          }`}
        >
          Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default CurrentPlan;
