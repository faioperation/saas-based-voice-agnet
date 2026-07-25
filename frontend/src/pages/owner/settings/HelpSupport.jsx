import React from "react";
import { Mail, Phone } from "lucide-react";

const HelpSupport = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-slate-800 mb-1">Help & Support</h2>
      <p className="text-[14px] text-slate-500 mb-8">Get assistance and contact our support team</p>

      <div className="bg-white border border-slate-100 rounded-[24px] p-6 md:p-8 max-w-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Contact</h3>

        <div className="flex flex-col gap-6">
          {/* Phone Number */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-slate-500 text-[13px] font-medium mb-1">
                Business Number
              </p>
              <p className="text-slate-800 text-[15px] font-semibold">
                +447719436543
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100" />

          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-slate-500 text-[13px] font-medium mb-1">
                Business Email
              </p>
              <a
                href="mailto:hello@firevoice.info"
                className="text-sky-600 font-medium hover:underline"
              >
                hello@firevoice.info
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
