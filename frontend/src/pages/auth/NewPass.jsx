import React, { useState } from "react";
import Password from "../../components/Password";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";

const NewPass = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetMutation = useMutation({
    mutationFn: async (resetData) => {
      const response = await axiosPublic.post(
        "/auth/reset-password",
        resetData,
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data?.message || "Password reset successfully!");
        navigate("/auth/success");
      } else {
        toast.error(data?.message || "Failed to reset password");
      }
    },
    onError: (error) => {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred during password reset";
      toast.error(errorMsg);
    },
  });

  const handleReset = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    resetMutation.mutate({
      email,
      otp,
      newPassword,
      confirmPassword,
    });
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-[32px] text-sky-950 font-semibold mb-2">
        Create New Password
      </h1>
      <p className="text-sky-700 text-[13px] mb-8 text-center">
        Your new password must be different from previously used password
      </p>

      <form onSubmit={handleReset} className="w-full space-y-6">
        <Password
          label="Password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          labelClass="!text-[13px] !text-sky-800 !font-medium !ml-1"
          leftIcon={<Icon icon="lucide:lock" width="18" />}
          inputClass="!bg-sky-50 !text-sky-950 !placeholder-sky-400 !rounded-full !py-3.5 !border-sky-200 focus:!border-[#2563EB]/50 !transition-colors !text-sm"
        />
        <Password
          label="Confirm Password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          labelClass="!text-[13px] !text-sky-800 !font-medium !ml-1"
          leftIcon={<Icon icon="lucide:lock" width="18" />}
          inputClass="!bg-sky-50 !text-sky-950 !placeholder-sky-400 !rounded-full !py-3.5 !border-sky-200 focus:!border-[#2563EB]/50 !transition-colors !text-sm"
        />

        <button
          type="submit"
          disabled={resetMutation.isPending}
          className="w-full mt-8 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-sm font-semibold py-3.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resetMutation.isPending ? (
            <>
              <Icon
                icon="lucide:loader-2"
                className="animate-spin"
                width="18"
              />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default NewPass;
