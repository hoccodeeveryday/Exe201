import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAF8F8]">
      <button
        type="button"
        aria-label="Mở menu"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 w-11 h-11 rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center text-darkbg text-xl cursor-pointer"
      >
        ☰
      </button>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-darkbg/40 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar variant="user" mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <main id="main-content" className="flex-1 p-8 md:p-10 pt-20 md:pt-10">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
