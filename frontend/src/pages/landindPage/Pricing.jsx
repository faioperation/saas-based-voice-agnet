import React, { useState } from "react";
import { Sparkles, Check, X, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Container from "@/components/Container";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import EnterpriseContactModal from "@/components/EnterpriseContactModal";

const PlanCard = ({
  plan,
  index,
  role,
  onUpgrade,
  isPendingUpgrade,
  isCurrentPlan,
}) => {
  const isPopular = plan.name?.toLowerCase() === "starter" || plan.isPopular;
  const priceValue = plan.priceMonthly;
  const priceDisplay =
    priceValue !== undefined ? `${priceValue}` : plan.price || "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative bg-white dark:bg-neutral-900 border ${isPopular ? "border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] ring-1 ring-orange-500/50" : "border-slate-200 dark:border-neutral-800 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"} p-6 md:p-8 rounded-3xl flex flex-col gap-6 hover:border-orange-500/50 transition-all group h-full`}
    >
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 px-4 py-1 rounded-full border border-red-500 text-white text-[13px] font-semibold whitespace-nowrap shadow-sm">
            Most Popular
          </div>
        </div>
      )}
      <div className="flex flex-col gap-5">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium w-fit bg-orange-500/10 text-orange-500"
        >
          {plan.name}
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
        </div>

        <div className="flex items-baseline gap-1.5">
          {plan.name?.toLowerCase() === "enterprise" ? (
            <span className="text-slate-900 dark:text-white text-[24px] font-bold tracking-tight">
              Custom Price
            </span>
          ) : (
            <>
              <span className="text-slate-900 dark:text-white text-[36px] font-bold tracking-tight">
                ${priceDisplay}
              </span>
              <span className="text-orange-500 text-[14px] font-medium">/month</span>
            </>
          )}
        </div>

        <p className="text-slate-600 dark:text-neutral-400 text-[13px] leading-relaxed min-h-[40px]">
          {plan.description}
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-2 mb-6">
        {plan.features?.map((feature, idx) => {
          const text = typeof feature === "string" ? feature : feature.text;
          const included =
            typeof feature === "string" ? true : feature.included;
          return (
            <div key={idx} className="flex items-center gap-3">
              {included ? (
                <Check className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              ) : (
                <X className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
              )}
              <span
                className={`text-[13px] leading-tight ${included ? "text-slate-700 dark:text-neutral-300" : "text-slate-400 dark:text-neutral-600"}`}
              >
                {text}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-auto">
        {role === "BUSINESS_OWNER" && isCurrentPlan ? (
          <button
            disabled
            className="w-full py-3 rounded-[12px] border border-neutral-800 bg-neutral-800/50 text-[14.5px] font-semibold text-neutral-500 cursor-not-allowed flex items-center justify-center gap-2"
          >
            Current Plan
          </button>
        ) : (
          <button
            onClick={() => onUpgrade(plan)}
            disabled={isPendingUpgrade}
            className={`w-full py-3 rounded-[12px] text-[14.5px] font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isPopular ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]" : "bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 hover:border-orange-500/50 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-900 dark:text-white shadow-sm"}`}
          >
            {isPendingUpgrade && <Loader2 className="w-4 h-4 animate-spin" />}
            {plan.name?.toLowerCase() === "enterprise"
              ? "Contact Us"
              : plan.buttonText || "Upgrade plan"}
          </button>
        )}
      </div>
    </motion.div>
  );
};

const Pricing = () => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const role = Cookies.get("role");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { data: plansResponse, isLoading } = useQuery({
    queryKey: ["publicPlans"],
    queryFn: async () => {
      const res = await axiosPublic.get("/free-route/plans");
      return res.data;
    },
  });

  const { data: subResponse } = useQuery({
    queryKey: ["mySubscription"],
    queryFn: async () => {
      const response = await axiosSecure.get(
        "/business-owner/subscription/my-subscription",
      );
      return response.data;
    },
    enabled: role === "BUSINESS_OWNER",
  });

  const plans = [...(plansResponse?.data || [])].sort((a, b) => {
    if (a.name?.toLowerCase() === "enterprise") return 1;
    if (b.name?.toLowerCase() === "enterprise") return -1;
    return 0;
  });
  const currentPlanId = subResponse?.data?.plan?.id;

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
    if (role !== "BUSINESS_OWNER") {
      toast.error("Please log in as to upgrade");
      return;
    }

    if (plan.name?.toLowerCase() === "enterprise") {
      setIsContactModalOpen(true);
      return;
    }

    checkoutMutation.mutate(plan.id);
  };

  return (
    <div id="pricing" className="py-15 bg-slate-50 dark:bg-gradient-to-b dark:from-[#140803] dark:to-neutral-950">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <Header
            titleText={`Simple, Transparent Pricing`}
            subtitleText={`Choose the plan that fits your business needs`}
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-10 justify-center">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
            </div>
          ) : plans.length > 0 ? (
            plans.map((plan, index) => (
              <PlanCard
                key={plan.id || index}
                plan={plan}
                index={index}
                role={role}
                onUpgrade={handleUpgrade}
                isPendingUpgrade={
                  checkoutMutation.isPending &&
                  checkoutMutation.variables === plan.id
                }
                isCurrentPlan={plan.id === currentPlanId}
              />
            ))
          ) : (
            <div className="col-span-full flex justify-center py-12">
              <span className="text-neutral-400">
                No plans available right now.
              </span>
            </div>
          )}
        </div>
      </Container>

      <EnterpriseContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default Pricing;
