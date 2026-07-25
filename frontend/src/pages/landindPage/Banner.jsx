"use client";
import React from "react";

import { motion } from "framer-motion";
import { FiPlay, FiArrowRight } from "react-icons/fi";
import { RiSparklingFill } from "react-icons/ri";
import Container from "@/components/Container";
import BannerVideo from "./BannerVideo";

const Banner = () => {
  return (
    <section
      id="home"
      className="relative bg-white dark:bg-gradient-to-b dark:from-neutral-950 dark:to-[#140803] overflow-hidden flex items-center py-24 lg:py-36"
    >
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center md:items-start gap-6 "
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-sm "
            >
              <span className="text-sm font-inter font-semibold text-orange-500 flex items-center gap-2 ">
                <RiSparklingFill className="text-orange-400 w-5 h-5" />
                AI-Powered Voice Automation
              </span>
            </motion.div>

            {/* Heading */}
            <h1 className="text-3xl md:text-5xl font-bold leading-[1.1] font-inter text-center md:text-start text-slate-900 dark:text-white flex flex-col">
              AI That Answers Calls
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                & Takes Orders Automatically
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-slate-600 dark:text-neutral-400 font-inter text-center md:text-start">
              Better service for your customers, Less pressure on your team,
              FireVoice answers calls, takes orders, upsell on items and helps your
              business save time and money
            </p>

            {/* Buttons */}
            <div className="flex  items-center gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-2.5 md:px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-full text-white border border-transparent font-semibold font-inter text-base flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all cursor-pointer"
              >
                Start Free Trial
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.02,
                }}
                className="px-2.5 md:px-8 py-4 border border-slate-200 bg-white hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-orange-500/50 dark:hover:bg-neutral-800 rounded-full text-slate-800 dark:text-white font-semibold text-base flex items-center md:gap-3 gap-1 shadow-sm transition-all cursor-pointer"
              >
                <div className="w-7 h-7  flex items-center justify-center">
                  <FiPlay className="text-orange-500" />
                </div>
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          {/* Right Content - Custom UI Graphic */}
          <BannerVideo />
        </div>
      </Container>
    </section>
  );
};

export default Banner;
