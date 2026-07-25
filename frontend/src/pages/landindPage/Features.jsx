import React from "react";
import { motion } from "framer-motion";
import { Bot, FileText, BarChart2, Mail, Lock, Clock } from "lucide-react";
import Header from "@/components/Header";
import Container from "@/components/Container";

const featuresData = [
  {
    icon: <Bot className="w-6 h-6 text-orange-500" />,
    title: "AI Voice Employee",
    description: "Deploy human-like voice agents that maintain conversational context and deliver minimal latency.",
    bg: "bg-orange-500/10",
  },
  {
    icon: <FileText className="w-6 h-6 text-red-500" />,
    title: "Business Knowledge Base",
    description: "Train your AI agent with your company's unique knowledge, business rules, and workflows.",
    bg: "bg-red-500/10",
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-rose-500" />,
    title: "Call Analytics & Insights",
    description: "Access detailed conversation history, call recordings, and AI-driven conversation insights.",
    bg: "bg-rose-500/10",
  },
  {
    icon: <Mail className="w-6 h-6 text-amber-500" />,
    title: "Deep Integrations",
    description: "Connect with your CRM, Calendar, Booking Systems, and Telephony systems seamlessly.",
    bg: "bg-amber-500/10",
  },
  {
    icon: <Lock className="w-6 h-6 text-orange-400" />,
    title: "Custom AI Workflows",
    description: "Configure custom prompts, dynamic workflows, and multi-language support for your business.",
    bg: "bg-orange-400/10",
  },
  {
    icon: <Clock className="w-6 h-6 text-red-400" />,
    title: "24/7 Availability",
    description: "Handle thousands of conversations simultaneously, without increasing staffing requirements.",
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
            subtitleText="FireVoice provides a complete AI Voice Agent platform, including:"
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
