import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Mail, Lock, Camera, Loader2, User } from "lucide-react";
import InputField from "../../../components/Inputfield";
import Password from "../../../components/Password";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";

const ProfileSettings = () => {
  const axiosSecure = useAxiosSecure();
  const { setUser } = useAuth();

  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fileInputRef = useRef(null);

  // Fetch Profile data
  const {
    data: profileResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ownerProfile"],
    queryFn: async () => {
      const response = await axiosSecure.get(
        "/business-owner/settings/my-profile",
      );
      return response.data;
    },
  });

  // Helper to get full avatar URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith("http") || avatarPath.startsWith("blob:"))
      return avatarPath;
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const baseUrl = apiBaseUrl.replace(/\/api\/?$/, "");
    return `${baseUrl}/${avatarPath.replace(/^\//, "")}`;
  };

  // Sync profile data to state
  useEffect(() => {
    if (profileResponse?.data && !isProfileEditing) {
      setFirstName(profileResponse.data.firstName || "");
      setLastName(profileResponse.data.lastName || "");
      setEmail(profileResponse.data.email || "");
      setProfileImage(getAvatarUrl(profileResponse.data.avatar));
      setSelectedFile(null);
    }
  }, [profileResponse, isProfileEditing]);

  const currentAvatarUrl = profileResponse?.data?.avatar
    ? getAvatarUrl(profileResponse.data.avatar)
    : null;
  const { data: avatarBlobUrl } = useQuery({
    queryKey: ["owner-avatar-image", currentAvatarUrl],
    enabled: !!currentAvatarUrl && !currentAvatarUrl.startsWith("blob:"),
    queryFn: async () => {
      const res = await axios.get(currentAvatarUrl, {
        responseType: "blob",
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      return URL.createObjectURL(res.data);
    },
  });

  const displayImage = selectedFile
    ? profileImage
    : avatarBlobUrl || profileImage;

  const handleImageClick = () => {
    if (isProfileEditing && !updateMutation.isPending) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setProfileImage(url);
    }
  };

  // Mutation for updating profile
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      let payload;
      let headers = {};
      if (selectedFile) {
        payload = new FormData();
        payload.append("first_name", data.firstName);
        payload.append("last_name", data.lastName);
        payload.append("avatar", selectedFile);
      } else {
        payload = {
          first_name: data.firstName,
          last_name: data.lastName,
        };
      }
      const response = await axiosSecure.patch(
        "/business-owner/settings/update-profile",
        payload,
        { headers },
      );
      return response.data;
    },
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || "Profile updated successfully");
        if (res?.data) {
          localStorage.setItem("user", JSON.stringify(res.data));
          setUser(res.data);
        }
        setIsProfileEditing(false);
        refetch();
      } else {
        toast.error(res?.message || "Failed to update profile");
      }
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "An error occurred during update",
      );
    },
  });

  const handleSaveProfile = () => {
    if (!firstName || !lastName) {
      toast.error("First Name and Last Name are required");
      return;
    }
    updateMutation.mutate({ firstName, lastName });
  };

  // Mutation for changing password
  const changePasswordMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosSecure.post("/auth/change-password", payload);
      return response.data;
    },
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || "Password changed successfully");
        handleCancelPassword();
      } else {
        toast.error(res?.message || "Failed to change password");
      }
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err?.message || "An error occurred",
      );
    },
  });

  const handleCancelPassword = () => {
    setIsPasswordEditing(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
      confirmPassword,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#2563EB] w-10 h-10" />
      </div>
    );
  }

  const isProfilePending = updateMutation.isPending;
  const isPasswordPending = changePasswordMutation.isPending;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-slate-800 mb-1">
        Profile Settings
      </h2>
      <p className="text-[14px] text-slate-500 mb-8">
        Update your personal information
      </p>

      <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
        {/* Profile Image */}
        <div className="relative w-24 h-24 mb-8 group">
          {displayImage ? (
            <img
              src={displayImage}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-transform group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center border-4 border-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-transform group-hover:scale-[1.02]">
              <User className="text-slate-400 w-10 h-10" />
            </div>
          )}
          {isProfileEditing && (
            <button
              onClick={handleImageClick}
              disabled={isProfilePending}
              className="absolute bottom-0 right-0 bg-white p-2 rounded-full border border-slate-100 shadow-md hover:shadow-lg hover:border-sky-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sky-600 hover:text-sky-700 z-10"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <InputField
            label="First Name"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            readOnly={!isProfileEditing || isProfilePending}
            labelClass="!text-[14px] !font-medium !text-slate-700"
            inputClass={`!bg-slate-50 !border-slate-200 !rounded-[12px] !px-5 !py-3.5 !text-[14.5px] ${!isProfileEditing || isProfilePending ? "!text-slate-500 cursor-default opacity-80" : "!text-slate-800 !bg-white hover:!border-sky-300"} placeholder:!text-slate-400 focus:!outline-none focus:!border-sky-500 focus:!ring-1 focus:!ring-sky-500 !shadow-sm transition-all`}
          />
          <InputField
            label="Last Name"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            readOnly={!isProfileEditing || isProfilePending}
            labelClass="!text-[14px] !font-medium !text-slate-700"
            inputClass={`!bg-slate-50 !border-slate-200 !rounded-[12px] !px-5 !py-3.5 !text-[14.5px] ${!isProfileEditing || isProfilePending ? "!text-slate-500 cursor-default opacity-80" : "!text-slate-800 !bg-white hover:!border-sky-300"} placeholder:!text-slate-400 focus:!outline-none focus:!border-sky-500 focus:!ring-1 focus:!ring-sky-500 !shadow-sm transition-all`}
          />
        </div>

        <div className="mb-8">
          <InputField
            label="Email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={true}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            labelClass="!text-[14px] !font-medium !text-slate-700"
            inputClass="!bg-slate-50 !border-slate-200 !rounded-[12px] !pl-11 !pr-5 !py-3.5 !text-[14.5px] !text-slate-500 cursor-not-allowed placeholder:!text-slate-400 focus:!outline-none !shadow-sm opacity-80"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
          {!isProfileEditing ? (
            <button
              onClick={() => setIsProfileEditing(true)}
              className="px-8 py-2.5 rounded-[10px] bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-[14px] font-semibold shadow-sm transition-all cursor-pointer"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsProfileEditing(false)}
                disabled={isProfilePending}
                className="px-8 py-2.5 rounded-[10px] bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[14px] font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isProfilePending}
                className="px-8 py-2.5 rounded-[10px] bg-sky-600 hover:bg-sky-700 text-white text-[14px] font-semibold shadow-sm hover:shadow-md hover:shadow-sky-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isProfilePending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Change Password */}
      <h2 className="text-xl font-bold text-slate-800 mb-1">Change Password</h2>
      <p className="text-[14px] text-slate-500 mb-8">
        Update your password regularly to keep your account secure
      </p>

      <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
        <div className="mb-6">
          <Password
            label="Current Password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            readOnly={!isPasswordEditing || isPasswordPending}
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            labelClass="!text-[14px] !font-medium !text-slate-700"
            inputClass={`!bg-slate-50 !border-slate-200 !rounded-[12px] !pl-11 !pr-5 !py-3.5 !text-[14.5px] ${!isPasswordEditing || isPasswordPending ? "!text-slate-500 cursor-default opacity-80" : "!text-slate-800 !bg-white hover:!border-sky-300"} placeholder:!text-slate-400 focus:!outline-none focus:!border-sky-500 focus:!ring-1 focus:!ring-sky-500 !shadow-sm transition-all`}
            icon="!text-slate-400 hover:!text-slate-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Password
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            readOnly={!isPasswordEditing || isPasswordPending}
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            labelClass="!text-[14px] !font-medium !text-slate-700"
            inputClass={`!bg-slate-50 !border-slate-200 !rounded-[12px] !pl-11 !pr-5 !py-3.5 !text-[14.5px] ${!isPasswordEditing || isPasswordPending ? "!text-slate-500 cursor-default opacity-80" : "!text-slate-800 !bg-white hover:!border-sky-300"} placeholder:!text-slate-400 focus:!outline-none focus:!border-sky-500 focus:!ring-1 focus:!ring-sky-500 !shadow-sm transition-all`}
            icon="!text-slate-400 hover:!text-slate-600"
          />
          <Password
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            readOnly={!isPasswordEditing || isPasswordPending}
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            labelClass="!text-[14px] !font-medium !text-slate-700"
            inputClass={`!bg-slate-50 !border-slate-200 !rounded-[12px] !pl-11 !pr-5 !py-3.5 !text-[14.5px] ${!isPasswordEditing || isPasswordPending ? "!text-slate-500 cursor-default opacity-80" : "!text-slate-800 !bg-white hover:!border-sky-300"} placeholder:!text-slate-400 focus:!outline-none focus:!border-sky-500 focus:!ring-1 focus:!ring-sky-500 !shadow-sm transition-all`}
            icon="!text-slate-400 hover:!text-slate-600"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
          {!isPasswordEditing ? (
            <button
              onClick={() => setIsPasswordEditing(true)}
              className="px-8 py-2.5 rounded-[10px] bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-[14px] font-semibold shadow-sm transition-all cursor-pointer"
            >
              Edit Password
            </button>
          ) : (
            <>
              <button
                onClick={handleCancelPassword}
                disabled={isPasswordPending}
                className="px-8 py-2.5 rounded-[10px] bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[14px] font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePassword}
                disabled={isPasswordPending}
                className="px-8 py-2.5 rounded-[10px] bg-sky-600 hover:bg-sky-700 text-white text-[14px] font-semibold shadow-sm hover:shadow-md hover:shadow-sky-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPasswordPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Save new password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
