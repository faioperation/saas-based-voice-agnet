import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-white text-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">

        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />


        <main className="flex-1 overflow-y-auto hide-scrollbar bg-white text-sky-950 relative p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}