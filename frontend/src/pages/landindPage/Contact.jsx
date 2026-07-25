import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Container from "@/components/Container";
import InputField from "@/components/Inputfield";
import Dropdown from "@/components/Dropdown";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

const Contact = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    businessPostcode: "",
    businessType: "",
    phoneNumber: "",
    email: "",
    dailyOrders: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          fullName: formData.fullName,
          businessName: formData.businessName,
          businessPostcode: formData.businessPostcode,
          businessType: formData.businessType,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          dailyOrders: formData.dailyOrders,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      // Redirect to the success page
      navigate("/thank-you-contact");
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative bg-slate-50 dark:bg-gradient-to-b dark:from-[#160606] dark:to-neutral-950 font-inter">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-[2rem] shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row relative overflow-hidden justify-between"
        >
          {/* Left Dark Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/50 relative overflow-hidden rounded-[1.5rem] p-8 md:p-10 w-full lg:w-[40%] flex flex-col"
          >
            <div className="relative z-10">
              <h3 className="text-orange-500 tracking-wider text-sm uppercase font-bold mb-3 ">
                Contact Us
              </h3>
              <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                Get Started With FireVoice
              </h2>
              <p className="text-slate-600 dark:text-neutral-400 text-sm leading-relaxed mb-12">
                Tell us about your restaurant and our team will help you
                discover how FireVoice can improve customer service, save time and
                support your business.
              </p>

              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-4 text-slate-700 dark:text-neutral-300">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center shrink-0 border border-orange-500/30">
                    <FiPhone className="text-lg text-orange-500" />
                  </div>
                  <span className="text-sm font-medium">+447719436543</span>
                </div>
                <div className="flex items-center gap-4 text-slate-700 dark:text-neutral-300">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center shrink-0 border border-orange-500/30">
                    <FiMail className="text-lg text-orange-500" />
                  </div>
                  <span className="text-sm font-medium">
                    Enquiries@firevoice.info
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Background Circles */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-500/20 rounded-full pointer-events-none blur-2xl"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-500/20 rounded-full pointer-events-none blur-2xl"></div>
          </motion.div>

          {/* Right Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full lg:w-[60%] p-8 md:p-10 rounded-[1.5rem] bg-transparent relative z-10"
          >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 mb-6">
                <InputField
                  label="Full Name*"
                  type="text"
                  required
                  labelClass="!text-slate-700 dark:!text-neutral-300 !font-medium mb-1 text-sm"
inputClass="!bg-white dark:!bg-neutral-950 !text-slate-900 dark:!text-white !border-slate-200 dark:!border-neutral-800 !placeholder-slate-400 dark:!placeholder-neutral-600 focus:!border-orange-500 focus:!bg-slate-50 dark:focus:!bg-neutral-900 !py-3 !text-sm transition-colors shadow-sm"
                  className="sm:col-span-2"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />

                <InputField
                  label="Business Name*"
                  type="text"
                  required
                  className=""
                  labelClass="!text-slate-700 dark:!text-neutral-300 !font-medium mb-1 text-sm"
inputClass="!bg-white dark:!bg-neutral-950 !text-slate-900 dark:!text-white !border-slate-200 dark:!border-neutral-800 !placeholder-slate-400 dark:!placeholder-neutral-600 focus:!border-orange-500 focus:!bg-slate-50 dark:focus:!bg-neutral-900 !py-3 !text-sm transition-colors shadow-sm"
                  placeholder="Enter business name"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                />

                <Dropdown
                  label="Business Type*"
                  placeholder="Select type"
                  options={["Restaurant", "Takeaway", "Other"]}
                  labelClass="!text-slate-700 dark:!text-neutral-300 !font-medium mb-1 text-sm"
inputClass="!bg-white dark:!bg-neutral-950 !text-slate-900 dark:!text-white !border-slate-200 dark:!border-neutral-800 !placeholder-slate-400 dark:!placeholder-neutral-600 focus:!border-orange-500 focus:!bg-slate-50 dark:focus:!bg-neutral-900 !py-3 !text-sm transition-colors shadow-sm"
                  optionClass="!bg-white dark:!bg-neutral-900 !text-slate-900 dark:!text-white border border-slate-200 dark:border-neutral-800"
                  icon="!text-orange-500"
                  value={formData.businessType}
                  onSelect={(val) =>
                    setFormData({ ...formData, businessType: val })
                  }
                />
                <InputField
                  label="Business Postcode*"
                  type="text"
                  required
                  labelClass="!text-slate-700 dark:!text-neutral-300 !font-medium mb-1 text-sm"
inputClass="!bg-white dark:!bg-neutral-950 !text-slate-900 dark:!text-white !border-slate-200 dark:!border-neutral-800 !placeholder-slate-400 dark:!placeholder-neutral-600 focus:!border-orange-500 focus:!bg-slate-50 dark:focus:!bg-neutral-900 !py-3 !text-sm transition-colors shadow-sm"
                  placeholder="Enter business postcode"
                  value={formData.businessPostcode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessPostcode: e.target.value,
                    })
                  }
                />

                <InputField
                  label="Phone Number*"
                  type="tel"
                  required
                  labelClass="!text-slate-700 dark:!text-neutral-300 !font-medium mb-1 text-sm"
inputClass="!bg-white dark:!bg-neutral-950 !text-slate-900 dark:!text-white !border-slate-200 dark:!border-neutral-800 !placeholder-slate-400 dark:!placeholder-neutral-600 focus:!border-orange-500 focus:!bg-slate-50 dark:focus:!bg-neutral-900 !py-3 !text-sm transition-colors shadow-sm"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />

                <InputField
                  label="Email Address*"
                  type="email"
                  required
                  labelClass="!text-slate-700 dark:!text-neutral-300 !font-medium mb-1 text-sm"
inputClass="!bg-white dark:!bg-neutral-950 !text-slate-900 dark:!text-white !border-slate-200 dark:!border-neutral-800 !placeholder-slate-400 dark:!placeholder-neutral-600 focus:!border-orange-500 focus:!bg-slate-50 dark:focus:!bg-neutral-900 !py-3 !text-sm transition-colors shadow-sm"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                <Dropdown
                  label="Daily Phone Orders (optional)"
                  placeholder="Select call volume"
                  options={["Less than 20", "20–50", "50–100", "100+"]}
                  labelClass="!text-slate-700 dark:!text-neutral-300 !font-medium mb-1 text-sm"
inputClass="!bg-white dark:!bg-neutral-950 !text-slate-900 dark:!text-white !border-slate-200 dark:!border-neutral-800 !placeholder-slate-400 dark:!placeholder-neutral-600 focus:!border-orange-500 focus:!bg-slate-50 dark:focus:!bg-neutral-900 !py-3 !text-sm transition-colors shadow-sm"
                  optionClass="!bg-white dark:!bg-neutral-900 !text-slate-900 dark:!text-white border border-slate-200 dark:border-neutral-800"
                  icon="!text-orange-500"
                  value={formData.dailyOrders}
                  onSelect={(val) =>
                    setFormData({ ...formData, dailyOrders: val })
                  }
                />
              </div>

              <div className="flex flex-col gap-2 mb-8 flex-grow">
                <label className="font-medium text-slate-700 dark:text-neutral-300 text-sm">
                  Message
                </label>
                <textarea
                  className="w-full h-full border border-slate-200 dark:border-neutral-800 outline-none p-4 text-slate-900 dark:text-white bg-white dark:bg-neutral-950 placeholder-slate-400 dark:placeholder-neutral-600 rounded-xl min-h-[120px] focus:border-orange-500 focus:bg-slate-50 dark:focus:bg-neutral-900 transition-colors text-sm shadow-sm resize-none"
                  placeholder="Tell us about your specific needs or questions..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="flex justify-end mt-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 border border-transparent shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? "Sending..." : "Book My Free Demo"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Contact;
