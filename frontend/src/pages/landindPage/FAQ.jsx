"use client";
import React from "react";

import { motion } from "framer-motion";
import Container from "@/components/Container";
import FAQdropdown from "@/components/FAQdropdown";
import Header from "@/components/Header";

const faqs = [
  {
    question: "What is Calai?",
    answer:
      "Calai is an AI phone assistant built for restaurants and takeaways. It answers customer calls, takes orders, answers questions and helps your team deliver a faster service.",
  },
  {
    question: "Will customers know they are speaking to AI?",
    answer:
      "Yes. Calai is designed to be transparent while still providing a natural and helpful customer experience. Your AI assistant will introduce itself clearly, for example:",
    details:
      "Hi, you're through to [Business Name]. I'm the virtual assistant. Would you like to place an order?",
  },
  {
    question: "Does Calai replace my staff?",
    answer:
      "No. Calai works alongside your team by handling phone calls and repetitive questions, giving your staff more time to focus on preparing food and serving customers.",
  },
  {
    question: "How does Calai learn about my restaurant?",
    answer:
      "Calai is trained using your restaurant information including your menu, prices, opening hours, special offers and frequently asked questions.",
  },
  {
    question: "Can Calai take food orders?",
    answer:
      "Yes. Calai can understand customer orders, handle changes or special requests, confirm details and send the completed order to your restaurant.",
  },
  {
    question: "What happens if a customer changes their order?",
    answer:
      "Customers can speak naturally. Calai understands changes during the conversation and updates the order before confirming it.",
  },
  {
    question: "How do I receive orders from Calai?",
    answer:
      "Orders are sent clearly to your restaurant dashboard and can be printed directly to your kitchen printer for your team to prepare.",
  },
  {
    question: "Do my customers need to download an app?",
    answer:
      "No. Customers simply call your restaurant like they normally do — Calai handles the conversation in the background.",
  },
  {
    question: "Do I need to change my phone number?",
    answer:
      "No. Calai can connect with your existing phone setup, allowing customers to continue calling the number they already know.",
  },
  {
    question: "Can I update my menu and prices?",
    answer:
      "Yes. You can update your menu, pricing, offers and business information whenever changes are needed.",
  },
  {
    question: "What happens during busy periods?",
    answer:
      "Unlike a traditional phone line, Calai can help handle multiple customer conversations, reducing waiting times during your busiest hours.",
  },
  {
    question: "Can Calai recommend extras to customers?",
    answer:
      "Yes. Calai can suggest relevant items such as drinks, sides and special offers to help improve the customer experience and increase order value.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Getting started is simple. Provide your restaurant details and menu, and Calai can be prepared for your business without complicated technical setup.",
  },

  {
    question: "Do I need to sign a long-term contract?",
    answer:
      "No. Calai is designed to be flexible for restaurants and takeaways. There are no long-term contracts—you can use Calai on a monthly basis and cancel with 30 days’ notice",
    details:
      "A one-time setup fee applies to cover AI assistant configuration, menu training, call setup, and system preparation. Once your assistant is live, your monthly subscription continues for as long as you choose to use Calai",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-10 bg-white">
      <Container>
        <div className="flex flex-col items-center">
          <Header
            titleText="FAQ"
            subtitleText="Everything you need to know about Calai"
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
