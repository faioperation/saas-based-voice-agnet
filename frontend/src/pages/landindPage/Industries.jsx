import React from "react";
import { motion } from "framer-motion";
import { Stethoscope, Hotel, Utensils, ShoppingCart, Home, Car, Building } from "lucide-react";
import Header from "@/components/Header";
import Container from "@/components/Container";

const industriesData = [
  {
    icon: <Stethoscope className="w-6 h-6 text-orange-500" />,
    title: "Healthcare",
    description: "Hospital & Clinic Reception, Patient Appointment Booking, and Information Assistant.",
    bg: "bg-orange-500/10",
  },
  {
    icon: <Hotel className="w-6 h-6 text-red-500" />,
    title: "Hospitality",
    description: "Hotel Reception, Room Reservation, Guest Support, and Booking Confirmation.",
    bg: "bg-red-500/10",
  },
  {
    icon: <Utensils className="w-6 h-6 text-rose-500" />,
    title: "Restaurants",
    description: "Table Reservation, Food Order Assistance, Customer Support, and Delivery Information.",
    bg: "bg-rose-500/10",
  },
  {
    icon: <ShoppingCart className="w-6 h-6 text-amber-500" />,
    title: "E-Commerce",
    description: "Order Confirmation Calls, Customer Verification, Delivery Updates, and Return Assistance.",
    bg: "bg-amber-500/10",
  },
  {
    icon: <Home className="w-6 h-6 text-orange-400" />,
    title: "Real Estate",
    description: "Property Inquiry Handling, Lead Qualification, and Appointment Scheduling.",
    bg: "bg-orange-400/10",
  },
  
  {
    icon: <Building className="w-6 h-6 text-rose-400" />,
    title: "Small & Medium Businesses",
    description: "Any business that receives customer phone calls can deploy a FireVoice AI employee.",
    bg: "bg-rose-400/10",
  }
];

const IndustryCard = ({ industry, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-8 rounded-[24px] flex flex-col gap-4 transition-all duration-300 group hover:-translate-y-1 hover:shadow-md hover:border-orange-500/50 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
  >
    <div
      className={`${industry.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-sm`}
    >
      {industry.icon}
    </div>
    <div className="flex flex-col gap-2">
      <h3 className="text-slate-900 dark:text-white font-inter text-xl font-semibold tracking-tight">
        {industry.title}
      </h3>
      <p className="text-slate-600 dark:text-neutral-400 font-inter text-[15px] leading-relaxed">
        {industry.description}
      </p>
    </div>
  </motion.div>
);

const Industries = () => {
  return (
    <section id="industries" className="py-20 relative bg-slate-50 dark:bg-gradient-to-b dark:from-[#140803] dark:to-neutral-950">
      <Container>
        <div className="mb-14">
          <Header
            titleText="Industries We Serve"
            subtitleText="FireVoice is built to support businesses across multiple industries"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industriesData.map((industry, index) => (
            <IndustryCard key={index} industry={industry} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Industries;
