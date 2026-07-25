import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Image from "../Image";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  

  const isActivePath = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  

  
  const role = Cookies.get("role") || "BUSINESS_OWNER"; 

  const ownerNavLinks = [
    { name: "Dashboard", path: "/owner/dashboard", icon: "lucide:layout-dashboard" },
    { name: "AI Training", path: "/owner/ai-training", icon: "lucide:bot" },
    { name: "Test Call Window", path: "/owner/test-voice", icon: "lucide:phone-call" },
    { name: "Call Summary", path: "/owner/call-summary", icon: "lucide:file-text" },
    { name: "Order list", path: "/owner/order-list", icon: "lucide:list-checks" },
    { name: "Item Management", path: "/owner/item-management", icon: "lucide:monitor-cog" },
    { name: "Printer Management", path: "/owner/printer", icon: "lucide:printer" },
    { name: "Settings", path: "/owner/settings", icon: "lucide:settings" },
  ];

  const adminNavLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "lucide:layout-grid" },
    { name: "Tenant Management", path: "/admin/tenant-management", icon: "lucide:users" },
    { name: "Telephony", path: "/admin/telephony-integration", icon: "lucide:phone" },
    { name: "Subscriptions & Billing", path: "/admin/subscriptions-billing", icon: "lucide:credit-card" },
    // { name: "API Keys", path: "/admin/api-keys", icon: "lucide:key" },
    { name: "Settings", path: "/admin/settings", icon: "lucide:settings" },
  ];

  const navLinks = role === "SYSTEM_OWNER" ? adminNavLinks : ownerNavLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-white/50 2xl:hidden"
          onClick={onClose}
        />
      )}
      

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[100] w-64 bg-sky-50 text-sky-950
        shadow-[4px_0_24px_rgba(14,165,233,0.05)] border-r border-sky-100
        transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        2xl:static 2xl:translate-x-0`}
      >
        {/* Mobile Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] p-2 rounded-md bg-white text-sky-950 hover:bg-sky-100 2xl:hidden cursor-pointer shadow-sm border border-sky-100"
        >
          <FiX size={20} />
        </button>

        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="px-6 py-6 flex  items-center gap-4">
            <Link to="/">
              <Image src="/logo.png" alt="Company Logo" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1536 && onClose()}
                className={`flex items-center gap-4 px-3 py-3.5 rounded-xl transition-all duration-300
                  ${
                    isActivePath(item.path)
                      ? "bg-white shadow-[0_4px_10px_rgba(14,165,233,0.08)] border border-sky-100 text-sky-700 tracking-wide"
                      : "border border-transparent text-gray-600 hover:bg-sky-100/50 hover:text-sky-800 font-medium"
                  }`}
              >
                <Icon icon={item.icon} width="24" className="text-current" />
                <span className="text-sm ">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          {/* <div className="p-4 ">
            <button
              // onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-[#E7000B] hover:bg-[#F6A62D] hover:text-sky-950 transition cursor-pointer"
            >
              <Icon icon="material-symbols:logout" width="20" />
              Log Out
            </button>
          </div> */}
        </div>
      </aside>
    </>
  );
}
