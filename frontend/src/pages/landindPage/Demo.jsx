import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Container from "@/components/Container";
import { Play } from "lucide-react";

const Demo = () => {
  return (
    <section
      id="demo"
      className="py-20 relative bg-slate-50 dark:bg-gradient-to-b dark:from-[#160606] dark:to-neutral-950"
    >
      <Container>
        <div className="mb-14 text-center max-w-4xl mx-auto">
          <Header
            titleText="Watch A Live Demo"
            subtitleText="Experience how FireVoice works with your restaurant to manage customer calls, orders and enquiries automatically."
          />
        </div>
      </Container>
    </section>
  );
};

export default Demo;
