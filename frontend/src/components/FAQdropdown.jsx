"use client";
import React, { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const FAQdropdown = ({ question, answer, details, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
      className="w-full flex justify-center mb-4"
    >
      <div 
        className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden bg-white dark:bg-neutral-900 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-md dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] ${
          isOpen ? "border-orange-500/50 " : "border-slate-200 dark:border-neutral-800 "
        } ${className}`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-6 flex items-center justify-between gap-4 text-left cursor-pointer outline-none"
        >
          <h4 className="text-slate-900 dark:text-white text-base md:text-lg font-inter font-semibold">
            {question}
          </h4>
           
          <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-300 ${
            isOpen ? "bg-orange-500/20 text-orange-500" : "bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400"
          }`}>
            {isOpen ? <FiMinus className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-6 pb-6 pt-0">
                <p className="text-slate-600 dark:text-neutral-400 font-inter text-sm md:text-base leading-relaxed">
                  {answer}
                </p>
                {details && (
                  <p className="text-slate-600 dark:text-neutral-400 font-inter text-sm md:text-base leading-relaxed mt-4">
                    {details}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FAQdropdown;
