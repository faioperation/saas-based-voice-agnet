import React, { useState, useEffect } from "react";
import InputField from "../../../components/Inputfield";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const BusinessInfo = () => {
  const axiosSecure = useAxiosSecure();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [offDays, setOffDays] = useState([]);

  const {
    data: businessInfoResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ownerBusinessInfo"],
    queryFn: async () => {
      const response = await axiosSecure.get(
        "/business-owner/settings/business-info",
      );
      return response.data;
    },
  });

  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return "";
    const parts = timeStr.trim().split(" ");
    if (parts.length < 2) return timeStr;
    let [hours, minutes] = parts[0].split(":");
    const modifier = parts[1].toUpperCase();
    if (hours === "12") hours = "00";
    if (modifier === "PM") hours = String(parseInt(hours, 10) + 12);
    return `${hours.padStart(2, "0")}:${minutes}`;
  };

  const convertTo12Hour = (timeStr) => {
    if (!timeStr) return "";
    const parts = timeStr.split(":");
    if (parts.length < 2) return timeStr;
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const modifier = hours >= 12 ? "PM" : "AM";
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${String(hours).padStart(2, "0")}:${minutes} ${modifier}`;
  };

  useEffect(() => {
    if (businessInfoResponse?.data && !isEditing) {
      setName(businessInfoResponse.data.name || "");
      setAddress(businessInfoResponse.data.address || "");
      setOpeningTime(
        convertTo24Hour(
          businessInfoResponse.data.openingTime ||
            businessInfoResponse.data.opening_time ||
            "",
        ),
      );
      setClosingTime(
        convertTo24Hour(
          businessInfoResponse.data.closingTime ||
            businessInfoResponse.data.closing_time ||
            "",
        ),
      );

      let offDaysData =
        businessInfoResponse.data.offDays || businessInfoResponse.data.off_days;
      if (typeof offDaysData === "string") {
        try {
          offDaysData = JSON.parse(offDaysData);
        } catch (e) {
          offDaysData = offDaysData.split(",").map((d) => d.trim());
        }
      }
      setOffDays(Array.isArray(offDaysData) ? offDaysData : []);
    }
  }, [businessInfoResponse, isEditing]);

  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosSecure.patch(
        "/business-owner/settings/update-business-info",
        payload,
      );
      return response.data;
    },
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || "Business info updated successfully");
        setIsEditing(false);
        refetch();
      } else {
        toast.error(res?.message || "Failed to update business info");
      }
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err?.message || "An error occurred",
      );
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      name,
      address,
      openingTime: convertTo12Hour(openingTime),
      closingTime: convertTo12Hour(closingTime),
      opening_time: convertTo12Hour(openingTime),
      closing_time: convertTo12Hour(closingTime),
      offDays: offDays,
      off_days: offDays,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (businessInfoResponse?.data) {
      setName(businessInfoResponse.data.name || "");
      setAddress(businessInfoResponse.data.address || "");
      setOpeningTime(
        convertTo24Hour(
          businessInfoResponse.data.openingTime ||
            businessInfoResponse.data.opening_time ||
            "",
        ),
      );
      setClosingTime(
        convertTo24Hour(
          businessInfoResponse.data.closingTime ||
            businessInfoResponse.data.closing_time ||
            "",
        ),
      );

      let offDaysData =
        businessInfoResponse.data.offDays || businessInfoResponse.data.off_days;
      if (typeof offDaysData === "string") {
        try {
          offDaysData = JSON.parse(offDaysData);
        } catch (e) {
          offDaysData = offDaysData.split(",").map((d) => d.trim());
        }
      }
      setOffDays(Array.isArray(offDaysData) ? offDaysData : []);
    }
  };

  const toggleOffDay = (day) => {
    if (!isEditing) return;
    setOffDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#2563EB] w-10 h-10" />
      </div>
    );
  }

  const isPending = updateMutation.isPending;
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-slate-800 mb-1">Business Info</h2>
      <p className="text-[14px] text-slate-500 mb-8">
        Update your business details and company information.
      </p>

      <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
        <div className="flex flex-col gap-6 mb-8">
          <InputField
            label="Business Name"
            placeholder="e.g. AI Support"
            value={name}
            onChange={(e) => setName(e.target.value)}
            readOnly={!isEditing || isPending}
            labelClass="!text-[14px] !font-medium !text-slate-700"
            inputClass={`!bg-slate-50 !border-slate-200 !rounded-[12px] !px-5 !py-3.5 !text-[14.5px] ${!isEditing || isPending ? "!text-slate-500 cursor-default opacity-80" : "!text-slate-800 !bg-white hover:!border-sky-300"} placeholder:!text-slate-400 focus:!outline-none focus:!border-sky-500 focus:!ring-1 focus:!ring-sky-500 !shadow-sm transition-all`}
          />
          <InputField
            label="Business Address"
            type="text"
            placeholder="Enter business address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            readOnly={!isEditing || isPending}
            labelClass="!text-[14px] !font-medium !text-slate-700"
            inputClass={`!bg-slate-50 !border-slate-200 !rounded-[12px] !px-5 !py-3.5 !text-[14.5px] ${!isEditing || isPending ? "!text-slate-500 cursor-default opacity-80" : "!text-slate-800 !bg-white hover:!border-sky-300"} placeholder:!text-slate-400 focus:!outline-none focus:!border-sky-500 focus:!ring-1 focus:!ring-sky-500 !shadow-sm transition-all`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              label="Opening Time"
              type="time"
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
              readOnly={!isEditing || isPending}
              labelClass="!text-[14px] !font-medium !text-slate-700"
              inputClass={`!bg-slate-50 !border-slate-200 !rounded-[12px] !px-5 !py-3.5 !text-[14.5px] ${!isEditing || isPending ? "!text-slate-500 cursor-default opacity-80" : "!text-slate-800 !bg-white hover:!border-sky-300"} focus:!outline-none focus:!border-sky-500 focus:!ring-1 focus:!ring-sky-500 !shadow-sm transition-all [color-scheme:light]`}
            />
            <InputField
              label="Closing Time"
              type="time"
              value={closingTime}
              onChange={(e) => setClosingTime(e.target.value)}
              readOnly={!isEditing || isPending}
              labelClass="!text-[14px] !font-medium !text-slate-700"
              inputClass={`!bg-slate-50 !border-slate-200 !rounded-[12px] !px-5 !py-3.5 !text-[14.5px] ${!isEditing || isPending ? "!text-slate-500 cursor-default opacity-80" : "!text-slate-800 !bg-white hover:!border-sky-300"} focus:!outline-none focus:!border-sky-500 focus:!ring-1 focus:!ring-sky-500 !shadow-sm transition-all [color-scheme:light]`}
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[14px] font-medium text-slate-700 mb-1">
              Off Days (Select closed days)
            </label>
            <div className="flex flex-wrap gap-3">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleOffDay(day)}
                  disabled={!isEditing || isPending}
                  className={`px-4 py-2 rounded-xl text-[13.5px] transition-all font-medium border
                      ${
                        offDays.includes(day)
                          ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-sky-300 hover:bg-white"
                      }
                      ${!isEditing || isPending ? "cursor-default opacity-80 hover:border-slate-200 hover:bg-slate-50" : "cursor-pointer"}
                    `}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-2.5 rounded-[10px] bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-[14px] font-semibold shadow-sm transition-all cursor-pointer"
            >
              Edit Info
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

export default BusinessInfo;
