import React, { useState, useEffect } from "react";
import InputField from "../../../components/Inputfield";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const ConnectEmail = () => {
  const axiosSecure = useAxiosSecure();
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const {
    data: contactResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ownerContactInfo"],
    queryFn: async () => {
      const response = await axiosSecure.get(
        "/business-owner/settings/contact-info",
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (contactResponse?.data && !isEditing) {
      setPhone(contactResponse.data.phone || "");
      setEmail(contactResponse.data.email || "");
    }
  }, [contactResponse, isEditing]);

  const updatePhoneMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosSecure.patch(
        "/business-owner/settings/update-phone",
        payload,
      );
      return response.data;
    },
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || "Phone number updated successfully");
        setIsEditing(false);
        refetch();
      } else {
        toast.error(res?.message || "Failed to update phone number");
      }
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err?.message || "An error occurred",
      );
    },
  });

  const handleSave = () => {
    updatePhoneMutation.mutate({ phone });
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (contactResponse?.data) {
      setPhone(contactResponse.data.phone || "");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#2563EB] w-10 h-10" />
      </div>
    );
  }

  const isPending = updatePhoneMutation.isPending;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-slate-800 mb-1">
        Connect email & number
      </h2>
      <p className="text-[14px] text-slate-500 mb-8">
        Manage your connected emails and phone numbers.
      </p>

      <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
        <div className="flex flex-col gap-6 mb-8">
          <InputField
            label="Phone Number"
            type="text"
            placeholder="e.g. +1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            readOnly={!isEditing || isPending}
            labelClass="!text-[14px] !font-medium !text-slate-700"
            inputClass={`!bg-slate-50 !border-slate-200 !rounded-[12px] !px-5 !py-3.5 !text-[14.5px] ${!isEditing || isPending ? "!text-slate-500 cursor-default opacity-80" : "!text-slate-800 !bg-white hover:!border-sky-300"} placeholder:!text-slate-400 focus:!outline-none focus:!border-sky-500 focus:!ring-1 focus:!ring-sky-500 !shadow-sm transition-all`}
          />
          <InputField
            label="Email Address"
            type="email"
            placeholder="e.g. example@email.com"
            value={email}
            readOnly={true}
            labelClass="!text-[14px] !font-medium !text-slate-700"
            inputClass="!bg-slate-50 !border-slate-200 !rounded-[12px] !px-5 !py-3.5 !text-[14.5px] !text-slate-500 cursor-not-allowed placeholder:!text-slate-400 focus:!outline-none !shadow-sm opacity-80"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-2.5 rounded-[10px] bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-[14px] font-semibold shadow-sm transition-all cursor-pointer"
            >
              Edit Details
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="px-8 py-2.5 rounded-[10px] bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[14px] font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="px-8 py-2.5 rounded-[10px] bg-sky-600 hover:bg-sky-700 text-white text-[14px] font-semibold shadow-sm hover:shadow-md hover:shadow-sky-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectEmail;
