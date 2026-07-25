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
        className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden bg-gradient-to-br from-[#1A1A27]  to-[#0F0F18] ${
          isOpen ? "border-[#0F42FF] " : "border-sky-200 "
        } ${className}`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-6 flex items-center justify-between gap-4 text-left cursor-pointer outline-none"
        >
          <h4 className="text-sky-950 text-base md:text-lg font-inter font-semibold">
            {question}
          </h4>
           
          <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-300 text-sky-950 ${
            isOpen ? "bg-sky-600 hover:bg-sky-700 " : "bg-[#00135B]/50 "
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
                <p className="text-[#99A1AF] font-inter text-sm md:text-base leading-relaxed">
                  {answer}
                </p>
                {details && (
                  <p className="text-[#99A1AF] font-inter text-sm md:text-base leading-relaxed mt-4">
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
