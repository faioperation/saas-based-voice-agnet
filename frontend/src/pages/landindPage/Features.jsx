import React from "react";
import { motion } from "framer-motion";
import { Bot, FileText, BarChart2, Mail, Lock, Clock } from "lucide-react";
import Header from "@/components/Header";
import Container from "@/components/Container";

const featuresData = [
  {
    icon: <Bot className="w-6 h-6 text-orange-500" />,
    title: "AI Call Handling",
    description: "Answers calls instantly using AI voice agents.",
    bg: "bg-orange-500/10",
  },
  {
    icon: <FileText className="w-6 h-6 text-red-500" />,
    title: "Smart Order Processing",
    description: "Automatically generates structured order summaries.",
    bg: "bg-red-500/10",
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-rose-500" />,
    title: "AI Usage Analytics",
    description: "Monitor call duration and usage in real-time.",
    bg: "bg-rose-500/10",
  },
  {
    icon: <Mail className="w-6 h-6 text-amber-500" />,
    title: "Automated Email Confirm",
    description: "Sent instant order confirmation emails to customers.",
    bg: "bg-amber-500/10",
  },
  {
    icon: <Lock className="w-6 h-6 text-orange-400" />,
    title: "Kitchen Printing",
    description: "Orders confirmed arrive to your printer instantly",
    bg: "bg-orange-400/10",
  },
  {
    icon: <Clock className="w-6 h-6 text-red-400" />,
    title: "24/7 Availability",
    description: "Never miss a customer inquiry again.",
    bg: "bg-red-400/10",
  },
];

const FeatureCard = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-8 rounded-[24px] flex flex-col gap-4 transition-all duration-300 group hover:-translate-y-1 hover:shadow-md hover:border-orange-500/50 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
  >
    <div
      className={`${feature.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-sm`}
    >
      {feature.icon}
    </div>
    <div className="flex flex-col gap-2">
      <h3 className="text-slate-900 dark:text-white font-inter text-xl font-semibold tracking-tight">
        {feature.title}
      </h3>
      <p className="text-slate-600 dark:text-neutral-400 font-inter text-[15px] leading-relaxed">
        {feature.description}
      </p>
    </div>
  </motion.div>
);

const Features = () => {
  return (
    <section className="py-20 relative bg-white dark:bg-gradient-to-b dark:from-neutral-950 dark:to-[#140803]">
      <Container>
        <div className="mb-14">
          <Header
            titleText="Everything You Need To Automate Customer Calls"
            subtitleText="Powerful features designed for modern businesses"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Features;
