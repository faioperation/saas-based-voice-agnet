import React from "react";
import { motion } from "framer-motion";
import { Bot, Brain, Receipt, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Container from "@/components/Container";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Bot className="w-8 h-8 text-orange-500" />,
      title: "Answers Like A Real Team Member",
      description:
        "FireVoice speaks naturally with your customers, helping them place orders without waiting.",
      slogan:
        "From menu questions to special requests — FireVoice handles the conversation.",
      bg: "bg-orange-500/10",
      list: null,
    },
    {
      icon: <Brain className="w-8 h-8 text-red-500" />,
      title: "Understands Your Restaurant",
      description: "Your AI assistant learns your:",
      slogan: null,
      bg: "bg-red-500/10",
      list: ["Menu", "Prices", "Opening hours", "Special offers", "FAQs"],
    },
    {
      icon: <Receipt className="w-8 h-8 text-rose-500" />,
      title: "Sends Orders Straight To Your Kitchen",
      description:
        "Orders are organised clearly and sent directly to your printer. Customers receive a confirmation email and have the ability to pay via card.",
      slogan: null,
      bg: "bg-rose-500/10",
      list: null,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 relative bg-white dark:bg-gradient-to-b dark:from-neutral-950 dark:to-[#160606]"
    >
      <Container>
        <div className="mb-16 text-center max-w-4xl mx-auto flex flex-col items-center">
          <Header
            titleText="Meet FireVoice — Your AI Restaurant Assistant"
            subtitleText="FireVoice gives your business an intelligent phone assistant that works alongside your team, creating a faster experience for customers while saving you time."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="mt-8 inline-flex items-center justify-center bg-orange-500/10 border border-orange-500/30 px-6 py-2.5 rounded-full shadow-sm backdrop-blur-sm"
          >
            <span className="text-orange-500 font-inter text-[15px] sm:text-[16px] font-medium tracking-wide">
              ✨ No complicated setup. No changes for your customers.
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-8 rounded-[24px] flex flex-col gap-5 relative overflow-hidden group hover:border-orange-500/50 transition-colors shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
            >
              {/* Background Glow */}
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 ${step.bg} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`}
              />

              <div
                className={`${step.bg} w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm shrink-0`}
              >
                {step.icon}
              </div>

              <h3 className="text-slate-900 dark:text-white font-inter text-2xl font-bold tracking-tight leading-tight">
                {step.title}
              </h3>

              <p className="text-slate-600 dark:text-neutral-400 font-inter text-[16px] leading-relaxed">
                {step.description}
              </p>

              {step.list && (
                <ul className="flex flex-col gap-3 mt-2">
                  {step.list.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-slate-700 dark:text-neutral-300 font-inter text-[15px]"
                    >
                      <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {step.slogan && (
                <div className="mt-auto pt-5 border-t border-slate-200 dark:border-neutral-800">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                    <p className="text-orange-600 dark:text-orange-400 font-medium font-inter text-[14px] leading-snug">
                      "{step.slogan}"
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;
