"use client";
import React from 'react';
import { motion } from 'framer-motion';

const Header = ({ titleText, subtitleText }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className='text-center'
    >
        <h3 className='text-3xl md:text-4xl font-inter font-bold text-slate-900 dark:text-white tracking-tight'>
          {titleText}
        </h3>
        {subtitleText && (
          <p className='text-slate-600 dark:text-neutral-400 mt-4 font-inter text-[17px] leading-relaxed max-w-2xl mx-auto'>
            {subtitleText}
          </p>
        )}
    </motion.div>
  )
}

export default Header;
