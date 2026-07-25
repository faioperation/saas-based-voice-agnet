import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const Settings = () => {
  const location = useLocation();

  const tabs = [
    { name: "Profile Settings", path: "/owner/settings/profile" },
    { name: "Connect email & number", path: "/owner/settings/connect" },
    { name: "Business Info", path: "/owner/settings/business" },
    { name: "Subscription", path: "/owner/settings/subscription" },
    { name: "Privacy Setting", path: "/owner/settings/privacy" },
    { name: "Help & Support", path: "/owner/settings/help" },
  ];

  const isActivePath = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="flex flex-col h-full min-h-[80vh] animate-in fade-in duration-500">
      <div className="w-full mb-8 bg-white rounded-[20px] shadow-sm px-2 md:px-6 sticky top-0 z-10 border-b border-slate-200">
        <div className="flex flex-nowrap overflow-x-auto gap-x-6 md:gap-x-8 pt-4 hide-scrollbar">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={`whitespace-nowrap flex items-center pb-1 text-[13.5px] md:text-sm font-semibold transition-all border-b-[3px] ${
                isActivePath(tab.path)
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
              }`}
            >
              {tab.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-6 ">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
