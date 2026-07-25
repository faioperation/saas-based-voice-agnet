import React, { useState } from "react";
import { Sparkles, Check, X, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import EnterpriseContactModal from "../../../components/EnterpriseContactModal";

const PlanCard = ({ plan, onUpgrade, isPendingUpgrade, isCurrentPlan }) => {
  const isPopular = plan.name?.toLowerCase() === "starter" || plan.isPopular;

  return (
    <div
      className={`bg-white border ${isPopular ? "border-sky-300 shadow-md ring-1 ring-sky-100" : "border-sky-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]"} p-6 md:p-8 rounded-3xl flex flex-col gap-6 hover:border-sky-200 transition-all group h-full`}
    >
      <div className="flex flex-col gap-5">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium w-fit bg-sky-50 text-sky-700"
        >
          {plan.name}
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
        </div>

        <div className="flex items-baseline gap-1.5">
          {plan.name?.toLowerCase() === "enterprise" ? (
            <span className="text-sky-950 text-[24px] font-bold tracking-tight">
              Custom Price
            </span>
          ) : (
            <>
              <span className="text-sky-950 text-[36px] font-bold tracking-tight">
                ${plan.priceMonthly}
              </span>
              <span className="text-sky-600 text-[14px] font-medium">/month</span>
            </>
          )}
        </div>

        <p className="text-sky-700 text-[13px] leading-relaxed min-h-[40px]">
          The {plan.name} plan for your business.
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-2 mb-6">
        {plan.features?.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <Check className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <span className="text-[13px] text-sky-800">{feature}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        {isCurrentPlan ? (
          <button
            disabled
            className="w-full py-3 rounded-[12px] border border-sky-100 bg-sky-50/50 text-[14.5px] font-semibold text-sky-400 cursor-not-allowed flex items-center justify-center gap-2"
          >
            Current Plan
          </button>
        ) : (
          <button
            onClick={() => onUpgrade(plan)}
            disabled={isPendingUpgrade}
            className={`w-full py-3 rounded-[12px] text-[14.5px] font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isPopular ? "bg-sky-500 hover:bg-sky-600 text-white shadow-sm hover:shadow-md hover:shadow-sky-500/20" : "bg-white border border-sky-200 hover:border-sky-300 hover:bg-sky-50 text-sky-700 shadow-sm"}`}
          >
            {isPendingUpgrade && <Loader2 className="w-4 h-4 animate-spin" />}
            {plan.name?.toLowerCase() === "enterprise"
              ? "Contact Us"
              : "Upgrade Plan"}
          </button>
        )}
      </div>
    </div>
  );
};

const Plan = () => {
  const axiosSecure = useAxiosSecure();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const { data: plansResponse, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: async () => {
      const response = await axiosSecure.get(
        "/business-owner/subscription/plans",
      );
      return response.data;
    },
  });

  const { data: subResponse, isLoading: isLoadingSub } = useQuery({
    queryKey: ["mySubscription"],
    queryFn: async () => {
      const response = await axiosSecure.get(
        "/business-owner/subscription/my-subscription",
      );
      return response.data;
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (planId) => {
      const payload = {
        planId,
        billingCycle: "monthly",
      };
      const response = await axiosSecure.post(
        "/business-owner/payment/create-checkout-session",
        payload,
      );
      return response.data;
    },
    onSuccess: (res) => {
      if (res?.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to initiate checkout session");
      }
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Payment error occurred",
      );
    },
  });

  const handleUpgrade = (plan) => {
    if (plan.name?.toLowerCase() === "enterprise") {
      setIsContactModalOpen(true);
      return;
    }
    checkoutMutation.mutate(plan.id);
  };

  const plans = [...(plansResponse?.data || [])].sort((a, b) => {
    if (a.name?.toLowerCase() === "enterprise") return 1;
    if (b.name?.toLowerCase() === "enterprise") return -1;
    return 0;
  });
  const currentPlanId = subResponse?.data?.plan?.id;

  if (isLoadingPlans || isLoadingSub) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#2563EB] w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-6 sm:gap-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">
            Choose Your Plan
          </h2>
          <p className="text-[14px] text-slate-500">Manage your subscription plan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {plans.map((plan, index) => (
          <PlanCard
            key={plan.id || index}
            plan={plan}
            onUpgrade={handleUpgrade}
            isPendingUpgrade={
              checkoutMutation.isPending &&
              checkoutMutation.variables === plan.id
            }
            isCurrentPlan={plan.id === currentPlanId}
          />
        ))}
      </div>

      <EnterpriseContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default Plan;
