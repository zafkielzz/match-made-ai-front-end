import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getHRDashboardStats } from "@/mock/api";
import { useNavigate } from "react-router-dom";

const HRDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({ jobs: 0, pending: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    getHRDashboardStats(user.id).then(setStats);
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-white">HR Dashboard</h1>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-slate-900 text-white rounded-xl shadow flex flex-col items-center">
          <div className="text-3xl font-bold text-primary">{stats.jobs}</div>
          <div className="text-slate-300">Open Jobs</div>
        </div>
        <div className="p-6 bg-slate-900 text-white rounded-xl shadow flex flex-col items-center">
          <div className="text-3xl font-bold text-primary">{stats.pending}</div>
          <div className="text-slate-300">Pending Applications</div>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary/90 transition"
          onClick={() => navigate("/hr/jobs/new")}
        >
          Post Job
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => navigate("/hr/jobs")}
        >
          Manage Jobs
        </button>
      </div>
    </div>
  );
};

export default HRDashboard;
