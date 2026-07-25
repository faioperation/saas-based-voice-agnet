"use client";
import React from "react";

import { motion } from "framer-motion";
import Container from "@/components/Container";
import FAQdropdown from "@/components/FAQdropdown";
import Header from "@/components/Header";

const faqs = [
  {
    question: "What is FireVoice?",
    answer:
      "FireVoice is an AI phone assistant built for restaurants and takeaways. It answers customer calls, takes orders, answers questions and helps your team deliver a faster service.",
  },
  {
    question: "Will customers know they are speaking to AI?",
    answer:
      "Yes. FireVoice is designed to be transparent while still providing a natural and helpful customer experience. Your AI assistant will introduce itself clearly, for example:",
    details:
      "Hi, you're through to [Business Name]. I'm the virtual assistant. Would you like to place an order?",
  },
  {
    question: "Does FireVoice replace my staff?",
    answer:
      "No. FireVoice works alongside your team by handling phone calls and repetitive questions, giving your staff more time to focus on preparing food and serving customers.",
  },
  {
    question: "How does FireVoice learn about my restaurant?",
    answer:
      "FireVoice is trained using your restaurant information including your menu, prices, opening hours, special offers and frequently asked questions.",
  },
  {
    question: "Can FireVoice take food orders?",
    answer:
      "Yes. FireVoice can understand customer orders, handle changes or special requests, confirm details and send the completed order to your restaurant.",
  },
  {
    question: "What happens if a customer changes their order?",
    answer:
      "Customers can speak naturally. FireVoice understands changes during the conversation and updates the order before confirming it.",
  },
  {
    question: "How do I receive orders from FireVoice?",
    answer:
      "Orders are sent clearly to your restaurant dashboard and can be printed directly to your kitchen printer for your team to prepare.",
  },
  {
    question: "Do my customers need to download an app?",
    answer:
      "No. Customers simply call your restaurant like they normally do — FireVoice handles the conversation in the background.",
  },
  {
    question: "Do I need to change my phone number?",
    answer:
      "No. FireVoice can connect with your existing phone setup, allowing customers to continue calling the number they already know.",
  },
  {
    question: "Can I update my menu and prices?",
    answer:
      "Yes. You can update your menu, pricing, offers and business information whenever changes are needed.",
  },
  {
    question: "What happens during busy periods?",
    answer:
      "Unlike a traditional phone line, FireVoice can help handle multiple customer conversations, reducing waiting times during your busiest hours.",
  },
  {
    question: "Can FireVoice recommend extras to customers?",
    answer:
      "Yes. FireVoice can suggest relevant items such as drinks, sides and special offers to help improve the customer experience and increase order value.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Getting started is simple. Provide your restaurant details and menu, and FireVoice can be prepared for your business without complicated technical setup.",
  },

  {
    question: "Do I need to sign a long-term contract?",
    answer:
      "No. FireVoice is designed to be flexible for restaurants and takeaways. There are no long-term contracts—you can use FireVoice on a monthly basis and cancel with 30 days’ notice",
    details:
      "A one-time setup fee applies to cover AI assistant configuration, menu training, call setup, and system preparation. Once your assistant is live, your monthly subscription continues for as long as you choose to use FireVoice",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="relative bg-white dark:bg-gradient-to-b dark:from-neutral-950 dark:to-[#160606] py-20 px-6 overflow-hidden">
      <Container>
        <div className="flex flex-col items-center">
          <Header
            titleText="FAQ"
            subtitleText="Everything you need to know about FireVoice"
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="mt-8 w-full flex flex-col gap-2"
          >
            {faqs.map((faq, index) => (
              <FAQdropdown
                key={index}
                question={faq.question}
                answer={faq.answer}
                details={faq.details}
              />
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default FAQ;
