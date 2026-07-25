import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ThankYouContact = () => {
  return (
    <div className="bg-neutral-950 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-800 p-10 rounded-3xl max-w-2xl w-full text-center shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <div className="w-20 h-20 bg-orange-500/10 text-orange-500 border border-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Thank You!
          </h2>
          <p className="text-xl text-neutral-400 mb-8">
            Thank you for your interest, our team will be in touch shortly.
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border border-transparent text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]"
          >
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ThankYouContact;
