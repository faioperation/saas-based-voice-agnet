import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import axios from "axios";

const Settings = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [logoPreview, setLogoPreview] = useState(null);

  const { data: logoData, isLoading } = useQuery({
    queryKey: ["platform-logo"],
    queryFn: async () => {
      const res = await axiosSecure.get("/system-owner/settings/logo");
      return res.data;
    },
  });

  const updateLogoMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("logo", file); // Assumption: field name is 'logo'
      const res = await axiosSecure.patch(
        "/system-owner/settings/logo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-logo"] });
      toast.success("Logo updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update logo");
      setLogoPreview(null); // Revert preview on failure
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLogoPreview(imageUrl); // Optimistic UI update
      updateLogoMutation.mutate(file);
    }
  };

  // Determine logo URL structure from API response
  const logoPath = logoData?.data?.logoUrl;
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "") || "";
  const currentLogoUrl = logoPath ? `${baseUrl}${logoPath}` : null;

  const { data: logoBlobUrl } = useQuery({
    queryKey: ["platform-logo-image", currentLogoUrl],
    enabled: !!currentLogoUrl,
    queryFn: async () => {
      const res = await axios.get(currentLogoUrl, {
        responseType: "blob",
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      return URL.createObjectURL(res.data);
    },
  });

  const displayLogo = logoPreview || logoBlobUrl;

  return (
    <div>
      <div className="bg-white shadow-[0_4px_20px_rgba(14,165,233,0.08)] rounded-2xl p-8 border border-sky-100">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] flex items-center justify-center">
            <Icon icon="lucide:palette" className="text-[#A855F7] text-xl" />
          </div>
          <h2 className="text-sky-950 text-[17px] font-medium">
            Platform Branding
          </h2>
        </div>

        {/* Logo Upload Section */}
        <div>
          <label className="block text-sm font-medium text-sky-800 mb-3">
            Platform Logo
          </label>

          <label
            className={`w-28 h-28 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50 flex items-center justify-center cursor-pointer hover:bg-sky-100 hover:border-sky-400 transition-colors overflow-hidden relative group ${updateLogoMutation.isPending ? "opacity-50 pointer-events-none" : ""}`}
          >
            {isLoading ? (
              <Icon
                icon="lucide:loader-2"
                className="text-sky-950 text-xl animate-spin"
              />
            ) : displayLogo ? (
              <>
                <img
                  src={displayLogo}
                  alt="Platform Logo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-white/50 hidden group-hover:flex items-center justify-center">
                  <Icon icon="lucide:pencil" className="text-sky-950 text-lg" />
                </div>
              </>
            ) : (
              <span className="text-[13px] text-sky-600 font-medium">
                Logo
              </span>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
