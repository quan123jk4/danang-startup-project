import React from "react";
import { useAuth } from "../../context/AuthContext";

const Header = ({ title, subtitle }) => {
  const { user } = useAuth();
  const adminName = user?.fullName || "Admin";

  return (
    <header className="h-20 bg-[#fcfdfe] border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
      <div className="flex flex-col">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 cursor-pointer border-l border-slate-200 pl-6 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-[#002045] text-white font-bold flex items-center justify-center shadow-md">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-bold text-slate-800">{adminName}</p>
            <p className="text-xs text-[#C4391D] font-semibold">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
