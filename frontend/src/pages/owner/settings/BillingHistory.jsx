import React from "react";
import Table from "../../../components/Table";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Loader2 } from "lucide-react";

const BillingHistory = () => {
  const axiosSecure = useAxiosSecure();

  const { data: billingResponse, isLoading } = useQuery({
    queryKey: ["billingHistory"],
    queryFn: async () => {
      const response = await axiosSecure.get(
        "/business-owner/subscription/billing-history",
      );
      return response.data;
    },
  });

  const invoices = billingResponse?.data || [];

  const tableHeads = [
    { key: "date", Title: "Date", width: "40%" },
    { key: "details", Title: "Details", width: "40%" },
    { key: "amount", Title: "Amount", width: "20%" },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const tableRows = invoices.map((inv, idx) => ({
    id: inv.id || idx,
    date: formatDate(inv.createdAt),
    details: inv.subscription?.plan?.name
      ? `${inv.subscription.plan.name} plan`
      : "Subscription plan",
    amount: `£${inv.amount || inv.total || inv.amountPaid || 0}`,
  }));

  if (isLoading) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-xl font-bold text-slate-800 mb-1">
          Billing History
        </h2>
        <p className="text-[14px] text-slate-500 mb-8">
          Your subscription plan Billing
        </p>
        <div className="h-[300px] flex items-center justify-center">
          <Loader2 className="animate-spin text-sky-500 w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-slate-800 mb-1">Billing History</h2>
      <p className="text-[14px] text-slate-500 mb-8">
        Your subscription plan Billing
      </p>

      <div className="w-full">
        {tableRows.length > 0 ? (
          <Table
            TableHeads={tableHeads}
            TableRows={tableRows}
            headClass="border-b border-slate-100 text-slate-800 whitespace-nowrap bg-slate-50/50"
            tableClass="border-none"
            wrapperClass="overflow-visible"
          />
        ) : (
          <div className="p-8 text-center text-slate-500 text-[14px]">
            No billing history found.
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingHistory;
