import Container from "@/components/Container";
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CustomerCalls = () => {
  return (
    <div className="bg-white dark:bg-gradient-to-b dark:from-neutral-950 dark:to-[#140803] py-20  dark:border-neutral-800">
      <Container className={`text-center lg:!w-[60%]`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-slate-900 dark:text-white text-4xl md:text-6xl font-bold tracking-tight mb-4">
            FireVoice is not just another
            <span className="text-orange-500"> AI voice platform</span>
          </h1>
          <p className="text-sm md:text-lg text-slate-600 dark:text-neutral-400 my-6 leading-relaxed">
            FireVoice Builds AI Employees. We believe every
            business should have access to intelligent digital team members that
            work 24/7, understand customers, integrate with business systems,
            and deliver conversations that feel genuinely human.
          </p>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/auth/login">
              <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-full text-white font-bold text-base px-10 py-3 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all duration-300">
                Start Free Trial
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
};

export default CustomerCalls;
