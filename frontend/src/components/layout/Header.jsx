import { FiMenu } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import Image from "../Image";
import { FaAngleDown, FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { IoIosNotificationsOutline } from "react-icons/io";
import useAuth from "../../hooks/useAuth";
import Cookies from "js-cookie";
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import axios from 'axios';

export default function Header({ onMenuClick }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { logOutUser } = useAuth();
  const role = Cookies.get("role") || "BUSINESS_OWNER";
  const axiosSecure = useAxiosSecure();

  const { data: logoData } = useQuery({
    queryKey: ['platform-logo'],
    enabled: role === "SYSTEM_OWNER",
    queryFn: async () => {
      const res = await axiosSecure.get('/system-owner/settings/logo');
      return res.data;
    }
  });

  const { data: profileData } = useQuery({
    queryKey: ['business-owner-profile'],
    enabled: role === "BUSINESS_OWNER",
    queryFn: async () => {
      const res = await axiosSecure.get('/business-owner/settings/my-profile');
      return res.data;
    }
  });

  const logoPath = logoData?.data?.logoUrl;
  const ownerAvatarPath = profileData?.data?.avatar;
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, '') || '';
  
  const { data: businessInfoResponse } = useQuery({
    queryKey: ['ownerBusinessInfo'],
    enabled: role === "BUSINESS_OWNER",
    queryFn: async () => {
      const response = await axiosSecure.get('/business-owner/settings/business-info');
      return response.data;
    }
  });

  const businessName = businessInfoResponse?.data?.name;
  
  const currentLogoUrl = role === "SYSTEM_OWNER" 
    ? (logoPath ? `${baseUrl}${logoPath}` : null)
    : (ownerAvatarPath ? `${baseUrl}${ownerAvatarPath}` : null);
  
  const { data: logoBlobUrl } = useQuery({
    queryKey: ['platform-logo-image', currentLogoUrl],
    enabled: !!currentLogoUrl,
    queryFn: async () => {
      const res = await axios.get(currentLogoUrl, {
        responseType: 'blob',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      return URL.createObjectURL(res.data);
    }
  });

  const displayLogo = logoBlobUrl || null;

  const [agentStatus, setAgentStatus] = useState('Offline');

  useEffect(() => {
    if (role !== "BUSINESS_OWNER") return;

    const convertTo24Hour = (timeStr) => {
      if (!timeStr) return null;
      const parts = timeStr.trim().split(' ');
      if (parts.length < 2) return timeStr;
      let [hours, minutes] = parts[0].split(':');
      const modifier = parts[1].toUpperCase();
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
      return `${hours.padStart(2, '0')}:${minutes}`;
    };

    const checkStatus = () => {
      const rawOpen = businessInfoResponse?.data?.openingTime || businessInfoResponse?.data?.opening_time;
      const rawClose = businessInfoResponse?.data?.closingTime || businessInfoResponse?.data?.closing_time;
      
      const open = convertTo24Hour(rawOpen);
      const close = convertTo24Hour(rawClose);
      
      if (!open || !close) {
        setAgentStatus('Offline');
        return;
      }
      
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (open < close) {
        setAgentStatus((currentTime >= open && currentTime <= close) ? 'Online' : 'Offline');
      } else {
        setAgentStatus((currentTime >= open || currentTime <= close) ? 'Online' : 'Offline');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, [businessInfoResponse, role]);

  return (
    <header className="bg-gray-200 flex items-center px-4 md:px-6 py-3.5 relative gap-2 sm:gap-4  border-b border-white/10 z-40 backdrop-blur-lg">
      <button
        onClick={onMenuClick}
        className="2xl:hidden p-2 rounded bg-white text-sky-950 hover:bg-gray-100 cursor-pointer shrink-0 shadow-sm border border-gray-300"
      >
        <FiMenu className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
      </button>

      <div className="flex items-center justify-between w-full">

        {/* <div className="  hidden md:block relative ">

          <input
            type="text"
            placeholder="Search..."
            className="px-10 py-2.5 rounded-full border border-[#E2E8F0] outline-none  focus:ring-[#2563EB] w-[450px] text-[#64748B] placeholder:text-[#64748B]"
          />

          <FaSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-[#64748B]"/>
        </div> */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <h3 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-sky-950 truncate">
            {role === "BUSINESS_OWNER" ? (businessName || "Welcome") : "Welcome to "}
          </h3>

          {/* <Image
            src="/Hand.png"
            alt="hand"
            className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full object-cover shrink-0"
          /> */}
        </div>



        <div className="flex items-center ml-auto gap-2 sm:gap-4 shrink-0">
          {role === "BUSINESS_OWNER" && (
            <div className="hidden sm:flex items-center gap-2 bg-white/50 backdrop-blur-md px-5 py-2 rounded-full border border-gray-300 shadow-sm">
              <span className="text-sm text-sky-950 font-medium">Agent:</span>
              <div className={`flex items-center gap-2 ${agentStatus === 'Online' ? 'text-green-600' : 'text-gray-500'}`}>
                <div className={`w-2 h-2 rounded-full ${agentStatus === 'Online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium">{agentStatus}</span>
              </div>
            </div>
          )}

          {/* Notification Button */}
          {/* <button className="flex items-center justify-center w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-sky-100 hover:bg-sky-200 transition-colors shrink-0">
            <IoIosNotificationsOutline className="w-6 h-6 sm:w-6 sm:h-6 text-sky-950" />
          </button> */}

          {/* Language Selector */}
          {/* <button className="flex items-center gap-2 px-3 h-10 rounded-full bg-sky-100 hover:bg-sky-200 transition-colors text-sky-950">
            <Icon icon="circle-flags:uk" className="w-6 h-6 rounded-full" />
            <span className="text-sm font-medium font-montserrat">Eng</span>
            <FaAngleDown className="w-3.5 h-3.5" />
          </button> */}

          {/* Profile Section */}
          <div className="relative ml-1 sm:ml-2 shrink-0">
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              {displayLogo ? (
                <Image
                  src={displayLogo}
                  alt="User Avatar"
                  className="w-10 h-10 sm:w-10 sm:h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-sky-100 flex items-center justify-center border border-gray-600">
                  <Icon icon="lucide:user" className="text-sky-600 text-xl" />
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#4ADE80] border-2 border-[#141416] rounded-full"></span>
            </div>

            {/* Dropdown */}
            {openDropdown && (
              <div className="absolute w-48 right-0 mt-3 p-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <Link to={role === "SYSTEM_OWNER" ? "/admin/settings" : "/owner/settings"} onClick={() => setOpenDropdown(false)}>
                  <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-[#0A0A0A] hover:bg-sky-600 hover:bg-sky-700 text-sky-950 transition cursor-pointer">
                    <Icon icon="material-symbols:settings" width="20" />
                    <span className="font-montserrat text-sm font-medium">Settings</span>
                  </button>
                </Link>

                <Link
                  to={"/auth/login"}
                  onClick={() => {
                    logOutUser();
                    setOpenDropdown(false);
                  }}  >


                  <button

                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-[#E7000B] hover:bg-sky-600 hover:bg-sky-700  hover:text-sky-950 transition cursor-pointer"
                  >
                    <Icon icon="material-symbols:logout" width="20" />
                    <span className="font-montserrat text-sm font-medium">Log Out</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
