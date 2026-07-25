"use client";
import React, { useState, useEffect } from "react";
import Container from "../Container";
import { FiX, FiMenu } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Image from "../Image";
import logo from "/logo.png";
import logoDark from "/logoDark.png";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import Cookies from "js-cookie";
import ThemeToggle from "../ThemeToggle";

const navitems = [
  { name: "Home", href: "home" },
  { name: "How it works", href: "how-it-works" },
  { name: "Demo", href: "demo" },
  { name: "Pricing", href: "pricing" },
  { name: "FAQ", href: "faq" },
  { name: "Contact Us", href: "contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();


  const { user } = useAuth();
  const userRole = (user?.role === "SYSTEM_OWNER" ? "admin" : "owner");
  const dashboardPath = `/${userRole}/dashboard`;
  const dashboardLabel = userRole === "admin" ? "Admin" : "Business Owner";

  useEffect(() => {
    if (location.pathname !== "/") return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for navbar

      navitems.forEach((item) => {
        if (!item.isRoute) {
          const section = document.getElementById(item.href);
          if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (
              scrollPosition >= sectionTop &&
              scrollPosition < sectionTop + sectionHeight
            ) {
              setActiveSection(item.href);
            }
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const scrollToSection = (id, closeMenu = false) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (closeMenu) setOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(doScroll, 500);
    } else {
      // wait for mobile menu close animation before scrolling
      setTimeout(doScroll, closeMenu ? 350 : 0);
    }
  };

  return (
    <div className="sticky top-0 left-0 right-0 z-[100] bg-white dark:bg-neutral-950/90 backdrop-blur-md py-4 border-b border-sky-100 dark:border-neutral-800 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <Container>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className=" rounded-2xl  flex items-center justify-between "
        >

            <Link to="/"  onClick={() => scrollToSection("home")}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Image
                src={logo}
                alt="Logo"
                className="h-10 dark:hidden"
              />
              <Image
                src={logoDark}
                alt="Logo"
                className="h-10 hidden dark:block"
              />
              
            </motion.div>
          </Link>
          <button
            className="lg:hidden text-3xl cursor-pointer p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors bg-white dark:bg-neutral-900 text-slate-800 dark:text-white border border-slate-200 dark:border-neutral-800"
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>

          

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center justify-end gap-1 ">
            {navitems.map((item, index) => (
              <motion.li key={index} whileHover={{ y: -2 }}>
                {item.isRoute ? (
                  <Link
                    to={item.href}
                    className={`py-2 px-4 font-inter text-lg font-medium transition-colors rounded-lg bg ${
                      location.pathname === item.href
                        ? "text-orange-500 "
                        : "text-slate-600 hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-500"
                    }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={`py-2 px-4 font-inter text-lg font-medium transition-colors rounded-lg cursor-pointer ${
                      activeSection === item.href
                        ? "text-orange-500 "
                        : "text-slate-600 hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-500"
                    }`}
                  >
                    {item.name}
                  </button>
                )}
              </motion.li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle className="mr-2" />
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >

            {user ? (
              <Link to={dashboardPath}>
                <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-full text-white font-bold text-base px-6 py-3 border border-transparent shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all cursor-pointer">
                  {dashboardLabel}
                </button>
              </Link>
            ) : (
               <Link to="/auth/login">
                <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-full text-white font-bold text-base px-6 py-3 border border-transparent shadow-[0_0_15px_rgba(239,68,68,0.3)]  transition-all cursor-pointer">
                  Log In
                </button>
              </Link> 
            )}
            </motion.div>
          </div>
        </motion.div>




        {/* Mobile Slide Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-neutral-900 mt-4 rounded-2xl shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-neutral-800 overflow-hidden"
            >
              <ul className="flex flex-col items-start gap-2 p-6">
                {navitems.map((item, index) => (
                  <motion.li
                    key={index}
                    className="w-full"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.isRoute ? (
                      <Link
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className={`py-3 px-4 font-inter text-lg font-medium block rounded-xl transition-all ${
                          location.pathname === item.href
                            ? "text-orange-500 bg-slate-50 dark:bg-neutral-800"
                            : "text-slate-600 hover:bg-slate-50 hover:text-orange-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-orange-500"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <button
                        onClick={() => scrollToSection(item.href, true)}
                        className={`py-3 px-4 font-inter text-lg font-medium block rounded-xl transition-all w-full text-left ${
                          activeSection === item.href
                            ? "text-orange-500 bg-slate-50 dark:bg-neutral-800"
                            : "text-slate-600 hover:bg-slate-50 hover:text-orange-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-orange-500"
                        }`}
                      >
                        {item.name}
                      </button>
                    )}
                  </motion.li>
                ))}

                <motion.div
                  className="w-full pt-4 mt-2 border-t border-slate-100 dark:border-neutral-800 flex flex-col gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex justify-center my-2">
                    <ThemeToggle />
                  </div>
                  {user ? (
                    <Link to={dashboardPath} onClick={() => setOpen(false)}>
                      <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-full text-white font-bold text-base px-6 py-3 border border-transparent w-full cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                        {dashboardLabel}
                      </button>
                    </Link>
                  ) : (
                   <Link to="/auth/login" onClick={() => setOpen(false)}>
                      <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-full text-white font-bold text-base px-6 py-3 border border-transparent w-full cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                        Log In
                      </button>
                 </Link> 
                  )}
                </motion.div>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default Navbar;