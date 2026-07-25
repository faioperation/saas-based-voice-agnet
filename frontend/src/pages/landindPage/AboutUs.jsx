import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone } from "lucide-react";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-white font-inter">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-neutral-800 px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 shrink-0 rounded-full border border-slate-300 dark:border-neutral-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="text-slate-600 dark:text-neutral-300">Hello!! Welcome to FireVoice</div>
        </div>

        <div className="flex  sm:flex-row items-center gap-3 sm:gap-6 text-slate-600 dark:text-neutral-300 w-full md:w-auto justify-end sm:justify-end">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 shrink-0" />
            <span className="text-xs sm:text-sm">Enquiries@firevoice.info</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 shrink-0" />
            <span className="text-xs sm:text-sm">+447719436543</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className=" mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">About Us</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Overview</h2>
            <p className="text-slate-600 dark:text-neutral-400 leading-relaxed mb-4">
              FireVoice is a next-generation AI Voice Agent SaaS platform that enables businesses to deploy intelligent, human-like AI employees in minutes. Our mission is to help organizations automate customer communication through conversational AI that sounds natural, understands context, and performs real business tasks.
            </p>
            <p className="text-slate-600 dark:text-neutral-400 leading-relaxed mb-4">
              Rather than offering a generic voice bot, FireVoice provides industry-specific AI voice employees that can be customized for each business. Every AI agent is trained with the company's unique knowledge, business rules, workflows, and communication style, allowing it to interact with customers as if it were a real team member.
            </p>
            <p className="text-slate-600 dark:text-neutral-400 leading-relaxed mb-4">
              Businesses can create an account, choose a subscription plan, configure their AI employee, connect their phone number, website, CRM, scheduling system, or other business tools, and launch a fully functional AI voice assistant without building any AI infrastructure.
            </p>
            <p className="text-slate-600 dark:text-neutral-400 leading-relaxed">
              FireVoice is designed to become the digital front desk for modern businesses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">What FireVoice Does</h2>
            <p className="text-slate-600 dark:text-neutral-400 leading-relaxed mb-4">
              FireVoice allows businesses to automate customer conversations over phone calls using highly intelligent AI voice agents.
            </p>
            <p className="text-slate-600 dark:text-neutral-400 mb-4">Our AI employees can:</p>
            <ul className="list-disc list-inside text-slate-600 dark:text-neutral-400 space-y-2 mb-4 ml-4">
              <li>Answer incoming customer calls</li>
              <li>Handle business inquiries naturally</li>
              <li>Book appointments</li>
              <li>Confirm orders</li>
              <li>Collect customer information</li>
              <li>Qualify leads</li>
              <li>Transfer calls to human staff when necessary</li>
              <li>Answer frequently asked questions</li>
              <li>Check business availability</li>
              <li>Follow business-specific workflows</li>
              <li>Integrate with existing business systems</li>
            </ul>
            <p className="text-slate-600 dark:text-neutral-400 leading-relaxed">
              Unlike traditional IVR systems, FireVoice understands natural language, maintains conversational context, and delivers human-like interactions with minimal latency.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Why FireVoice</h2>
            <p className="text-slate-600 dark:text-neutral-400 leading-relaxed mb-4">
              Traditional call centers are expensive, difficult to scale, and limited by working hours.
            </p>
            <p className="text-slate-600 dark:text-neutral-400 leading-relaxed mb-4">
              FireVoice offers a smarter alternative by providing AI employees that are always available, highly consistent, and capable of handling thousands of conversations simultaneously.
            </p>
            <p className="text-slate-600 dark:text-neutral-400 leading-relaxed mb-4">
              Our platform is designed to reduce operational costs, improve customer experience, increase response speed, and help businesses grow without increasing staffing requirements.
            </p>
            <p className="text-slate-600 dark:text-neutral-400 leading-relaxed">
              Every FireVoice AI employee behaves like a trained team member—not just a chatbot or voice bot.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Vision</h2>
            <p className="text-slate-600 dark:text-neutral-400 leading-relaxed">
              To become the world's most trusted AI employee platform, enabling every business to deploy intelligent, human-like AI workers that communicate naturally, automate repetitive tasks, and enhance customer experiences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Mission</h2>
            <p className="text-slate-600 dark:text-neutral-400 leading-relaxed">
              To empower businesses of every size with AI voice employees that are simple to deploy, deeply integrated with existing systems, and capable of delivering professional, human-like customer interactions around the clock.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;
