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
      <h2 className="text-xl font-semibold text-sky-950 mb-1">
        Connect email & number
      </h2>
      <p className="text-sm text-sky-700 mb-8">
        Manage your connected emails and phone numbers.
      </p>

      <div className="bg-sky-50 p-6 rounded-xl border border-sky-200 mb-8">
        <div className="flex flex-col gap-6 mb-8">
          <InputField
            label="Phone Number"
            type="text"
            placeholder="e.g. +1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            readOnly={!isEditing || isPending}
            labelClass="!text-sm !font-medium !text-sky-800"
            inputClass={`!bg-sky-50 !border-sky-200 !rounded-full !px-5 !py-3.5 !text-sm ${!isEditing || isPending ? "!text-sky-600 cursor-default" : "!text-sky-950"} placeholder:!text-sky-500 focus:!outline-none focus:!border-blue-500/50`}
          />
          <InputField
            label="Email Address"
            type="email"
            placeholder="e.g. example@email.com"
            value={email}
            readOnly={true}
            labelClass="!text-sm !font-medium !text-sky-800"
            inputClass="!bg-sky-50 !border-sky-200 !rounded-full !px-5 !py-3.5 !text-sm !text-sky-600 cursor-not-allowed placeholder:!text-sky-500 focus:!outline-none focus:!border-transparent"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-10 py-2.5 rounded-full border border-[#0F42FF] bg-sky-600 hover:bg-sky-700 text-sm text-sky-950 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all cursor-pointer"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="px-8 py-2.5 rounded-full border border-sky-200 text-sm font-medium text-sky-950 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="px-8 py-2.5 rounded-full border border-[#0F42FF] bg-sky-600 hover:bg-sky-700 text-sm text-sky-950 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
