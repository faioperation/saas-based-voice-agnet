"use client";
import React from 'react';


import { FiTwitter, FiLinkedin, FiGithub, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Container from '../Container';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(doScroll, 500);
    } else {
      doScroll();
    }
  };

  return (
    <footer className="bg-slate-50 dark:bg-[#140803] text-slate-600 dark:text-neutral-400 py-12 font-inter border-t border-slate-200 dark:border-neutral-800">
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12"
        >
          {/* Logo & Description */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link to="/">
              <div className="flex items-center gap-4">
               
                  <img
                    src="/logo.png"
                    alt="Logo"
                    width={48}
                    height={48}
                    className="h-15 w-auto object-contain dark:hidden"
                  />
                  <img
                    src="/logoDark.png"
                    alt="Logo"
                    width={48}
                    height={48}
                    className="h-15 w-auto object-contain hidden dark:block"
                  />
                
                <div>
                 
                 
                </div>
              </div>
            </Link>
            
            <p className="text-sm font-inter text-slate-600 dark:text-neutral-400 pr-4 leading-relaxed max-w-sm">
             AI-powered voice automation for modern businesses.
            </p>

            {/* <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 border border-sky-200 flex items-center justify-center text-[#888888] hover:text-sky-950 hover:bg-white/10 transition-all">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 border border-sky-200 flex items-center justify-center text-[#888888] hover:text-sky-950 hover:bg-white/10 transition-all">
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 border border-sky-200 flex items-center justify-center text-[#888888] hover:text-sky-950 hover:bg-white/10 transition-all">
                <FiGithub className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 border border-sky-200 flex items-center justify-center text-[#888888] hover:text-sky-950 hover:bg-white/10 transition-all">
                <FiMail className="w-5 h-5" />
              </a>
            </div> */}
          </div>

          {/* Links */}
          <div className="flex flex-col items-start gap-4 ">
            <h4 className="text-slate-900 dark:text-white font-inter font-semibold mb-2">Product</h4>
            <button onClick={() => scrollToSection('feature')} className="text-sm font-inter text-slate-600 dark:text-neutral-400 hover:text-orange-500 transition-colors cursor-pointer">Features</button>
            <button onClick={() => scrollToSection('pricing')} className="text-sm font-inter text-slate-600 dark:text-neutral-400 hover:text-orange-500 transition-colors cursor-pointer">Pricing</button>
          </div>

          <div className="flex flex-col items-start gap-4">
            <h4 className="text-slate-900 dark:text-white font-inter font-semibold mb-2">Company</h4>
            <button onClick={() => scrollToSection('aboutUs')} className="text-sm font-inter text-slate-600 dark:text-neutral-400 hover:text-orange-500 transition-colors cursor-pointer">About</button>
            <button onClick={() => scrollToSection('faq')} className="text-sm font-inter text-slate-600 dark:text-neutral-400 hover:text-orange-500 transition-colors cursor-pointer">FAQ</button>
          </div>

          {/* <div className="flex flex-col gap-4">
            <h4 className="text-sky-950 font-inter font-semibold mb-2">Resources</h4>
            <Link href="#" className="text-sm font-inter text-[#CDCDCD] hover:text-[#AD46FF] transition-colors">Help Center</Link>
          </div> */}

          <div className="flex flex-col gap-4">
            <h4 className="text-slate-900 dark:text-white font-inter font-semibold mb-2">Legal</h4>
            <Link to="/privacy" className="text-sm font-inter text-slate-600 dark:text-neutral-400 hover:text-orange-500 transition-colors">Privacy Policy</Link>
            <Link to="/termscondition" className="text-sm font-inter text-slate-600 dark:text-neutral-400 hover:text-orange-500 transition-colors">Terms of Service</Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="py-8 border-t border-slate-200 dark:border-neutral-900"
        > 
          <p className="text-sm font-inter text-slate-500 dark:text-neutral-500">
            © {new Date().getFullYear()} FireVoice. All rights reserved.
          </p>
        </motion.div>
      </Container>
    </footer>
  );
};

export default Footer;