import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Banner from "@/pages/landindPage/Banner";
import CustomerCalls from "@/pages/landindPage/CustomerCalls";
import FAQ from "@/pages/landindPage/FAQ";
import Features from "@/pages/landindPage/Features";
import HowItWorks from "@/pages/landindPage/HowItWorks";
import Demo from "@/pages/landindPage/Demo";
import Pricing from "@/pages/landindPage/Pricing";
import Stats from "@/pages/landindPage/Stats";
import Contact from "@/pages/landindPage/Contact";
import Industries from "@/pages/landindPage/Industries";
import React from "react";


const LandingPageLayout = () => {
  return (
    <div className="bg-neutral-950">
      <Navbar />
      <Banner />
      <Stats />
      <HowItWorks />
      <Industries />
      
      <Features />
      <Pricing />
      <FAQ />
      <Contact />
      <CustomerCalls />
      <Footer />
    </div>
  );
};

export default LandingPageLayout;
