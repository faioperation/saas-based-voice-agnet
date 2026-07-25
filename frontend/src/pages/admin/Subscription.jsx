import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Download,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import Table from "../../components/Table";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PlanCard = ({ plan }) => {
  const isPopular = plan.name?.toLowerCase() === "pro" || plan.isPopular;
  const price = plan.priceMonthly;

  return (
    <div
      className={`bg-white border ${isPopular ? "border-sky-300 shadow-[0_4px_20px_rgba(14,165,233,0.15)] bg-sky-50/50" : "border-sky-100 shadow-[0_4px_20px_rgba(14,165,233,0.05)]"} p-6 rounded-[28px] flex flex-col gap-6 hover:shadow-[0_8px_30px_rgba(14,165,233,0.12)] transition-all group`}
    >
      <div className="flex flex-col gap-5">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium w-fit transition-colors ${isPopular ? "bg-blue-100 text-blue-600 border border-blue-200" : "bg-sky-50 text-sky-700 border border-sky-100"}`}
        >
          {plan.name}
          <Sparkles
            className={`w-3.5 h-3.5 ${isPopular ? "text-blue-600" : "text-sky-600"}`}
          />
        </div>

        <div className="flex items-baseline gap-1.5">
          {plan.name?.toLowerCase() === "enterprise" ? (
            <span className="text-sky-950 text-[24px] font-bold tracking-tight">
              Custom Price
            </span>
          ) : (
            <>
              <span className="text-sky-950 text-[32px] font-bold tracking-tight">
                ${price}
              </span>
              <span className="text-sky-600 text-sm font-medium">/month</span>
            </>
          )}
        </div>

        <p className="text-sky-700 text-[13px] leading-relaxed min-h-[40px]">
          {plan.description || `The ${plan.name} plan for your business.`}
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {plan.features?.map((feature, idx) => {
          const text = typeof feature === "string" ? feature : feature.text;
          const included =
            typeof feature === "string" ? true : feature.included;
          return (
            <div key={idx} className="flex items-center gap-3 items-start">
              {included ? (
                <Check className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              ) : (
                <X className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              )}
              <span
                className={`text-[13px] leading-tight ${included ? "text-sky-800" : "text-gray-500"}`}
              >
                {text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Subscription = () => {
  const axiosSecure = useAxiosSecure();

  const { data: plansResponse, isLoading: isPlansLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/system-owner/subscription-billing/plans",
      );
      return res.data;
    },
  });

  const plans = [
    ...(Array.isArray(plansResponse?.data) ? plansResponse.data : []),
  ].sort((a, b) => {
    if (a.name?.toLowerCase() === "enterprise") return 1;
    if (b.name?.toLowerCase() === "enterprise") return -1;
    return 0;
  });

  const { data: billingsResponse, isLoading: isBillingsLoading } = useQuery({
    queryKey: ["billings"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/system-owner/subscription-billing/billings",
      );
      return res.data;
    },
  });

  const billingsData = billingsResponse?.data || {
    stats: {},
    recent_invoices: [],
  };
  const apiStats = billingsData.stats;

  const stats = [
    {
      title: "Total Revenue",
      value: `$${apiStats?.total_revenue?.toLocaleString() || 0}`,
      label: "All time",
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      title: "This Month",
      value: `$${apiStats?.monthly_revenue?.toLocaleString() || 0}`,
      label: (
        <div className="flex items-center gap-3">
          <span className="text-sky-600 text-[11px]">revenue this month</span>
        </div>
      ),
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Active Plans",
      value: apiStats?.active_plans || 0,
      label: "Subscribed tenants",
      labelColor: "text-green-500",
      icon: <CreditCard className="w-6 h-6" />,
    },
  ];

  const tableHeads = [
    { key: "invoice_no", Title: "Invoice No." },
    { key: "company_name", Title: "Company Name" },
    { key: "plan", Title: "Plan" },
    {
      key: "amount",
      Title: "Amount",
      render: (row) => `$${row.amount}`,
    },
    {
      key: "expiry_date",
      Title: "Expiry Date",
      render: (row) => new Date(row.expiry_date).toLocaleDateString("en-GB"),
    },
    {
      key: "status",
      Title: "Status",
      render: (row) => (
        <span
          className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold capitalize ${row.status === "paid" ? "bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm" : "bg-rose-50 text-rose-600 border border-rose-200 shadow-sm"}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "billing_cycle",
      Title: "Billing Cycle",
      render: (row) => <span className="capitalize">{row.billing_cycle}</span>,
    },
    // {
    //   key: 'action',
    //   Title: 'Action',
    //   render: () => (
    //     <button className="text-sky-700 hover:text-sky-950 transition-colors">
    //       <Download className="w-5 h-5" />
    //     </button>
    //   )
    // }
  ];

  const tableRows = billingsData.recent_invoices || [];

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-[0_4px_20px_rgba(14,165,233,0.08)] border border-sky-100 p-7 rounded-[32px] flex flex-col gap-6"
          >
            <div className="flex items-center gap-3 text-sky-950">
              <div className="opacity-80">{stat.icon}</div>
              <h3 className="text-sm font-medium tracking-wide">
                {stat.title}
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sky-950 text-[28px] font-semibold leading-none">
                {stat.value}
              </span>
              <div className="mt-2">
                {typeof stat.label === "string" ? (
                  <span
                    className={`text-[11px] font-medium ${stat.labelColor || "text-sky-600"}`}
                  >
                    {stat.label}
                  </span>
                ) : (
                  stat.label
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan */}
      <div className="my-15">
        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-end mb-8 gap-6 sm:gap-0"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {isPlansLoading ? (
            <div className="col-span-full flex justify-center py-10">
              <span className="text-sky-700">Loading plans...</span>
            </div>
          ) : (
            plans.map((plan, index) => (
              <PlanCard key={plan.id || index} plan={plan} />
            ))
          )}
        </div>
      </div>

      {/* Billing History */}
      <div className="mt-15">
        {isBillingsLoading ? (
          <div className="flex items-center justify-center py-20 text-sky-950">
            Loading billing history...
          </div>
        ) : (
          <Table
            TableHeads={tableHeads}
            TableRows={tableRows}
            headClass=" border-none text-sky-700 tracking-wider"
            tableClass="border-none"
          />
        )}
      </div>
    </div>
  );
};

export default Subscription;
