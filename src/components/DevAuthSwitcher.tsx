import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const DevAuthSwitcher: React.FC = () => {
  const { role, signin, signout, hydrated } = useAuth();

  if (!(import.meta.env && import.meta.env.DEV)) return null;
  if (!hydrated) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-black/70 border border-white/10 rounded-xl p-4 shadow-xl flex flex-col items-center min-w-[180px]">
      <div className="font-semibold mb-3 text-slate-200">Dev Auth Switcher</div>
      <div className="flex gap-2">
        <button
          onClick={signout}
          className={`px-3 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition font-medium ${role === "guest" ? "ring-2 ring-primary font-bold" : ""}`}
        >
          Guest
        </button>
        <button
          onClick={() => signin("user")}
          className={`px-3 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition font-medium ${role === "user" ? "ring-2 ring-primary font-bold" : ""}`}
        >
          User
        </button>
        <button
          onClick={() => signin("hr")}
          className={`px-3 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition font-medium ${role === "hr" ? "ring-2 ring-primary font-bold" : ""}`}
        >
          HR
        </button>
      </div>
    </div>
  );
};

export default DevAuthSwitcher;
