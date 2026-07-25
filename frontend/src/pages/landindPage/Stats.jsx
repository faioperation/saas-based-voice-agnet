import React from "react";
import { motion } from "framer-motion";
import { PhoneOff, Users, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Container from "@/components/Container";

const problemsData = [
  {
    icon: <PhoneOff className="w-6 h-6 text-orange-500" />,
    title: "Missed Opportunities",
    description:
      "Busy phone lines and after-hours calls mean missed leads and lost revenue.",
    bg: "bg-orange-500/10", 
  },
  {
    icon: <Users className="w-6 h-6 text-red-500" />,
    title: "Expensive Call Centers",
    description:
      "Traditional call centers are expensive, difficult to scale, and limited by working hours.",
    bg: "bg-red-500/10", 
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-rose-500" />,
    title: "Staff Under Pressure",
    description: "Your team spends valuable time answering repetitive questions instead of focusing on high-value tasks.",
    bg: "bg-rose-500/10", 
  },
];

const ProblemCard = ({ problem, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-6 md:p-8 rounded-[24px] flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
  >
    <div
      className={`${problem.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-sm`}
    >
      {problem.icon}
    </div>
    <div className="flex flex-col gap-3">
      <h3 className="text-slate-900 dark:text-white font-inter text-2xl font-bold tracking-tight">
        {problem.title}
      </h3>
      <p className="text-slate-600 dark:text-neutral-400 font-inter text-[16px] leading-relaxed">
        {problem.description}
      </p>
    </div>
  </motion.div>
);

const Stats = () => {
  return (
    <section
      id="feature"
      className="py-20 relative bg-slate-50 dark:bg-gradient-to-b dark:from-[#140803] dark:to-neutral-950"
    >
      <Container>
        <div className="mb-14">
          <Header
            titleText="Why FireVoice?"
            subtitleText="FireVoice offers a smarter alternative by providing AI employees that are always available, highly consistent, and capable of handling thousands of conversations simultaneously."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mx-auto">
          {problemsData.map((problem, index) => (
            <ProblemCard key={index} problem={problem} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Stats;
