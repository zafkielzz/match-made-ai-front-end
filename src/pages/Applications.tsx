import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getMyApplications } from "@/mock/api";
import ScoreRing from "@/components/ScoreRing";
import StatusPill from "@/components/StatusPill";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const Applications: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState("all");
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getMyApplications(user.id).then((data) => {
      setApps(data);
      setLoading(false);
    });
  }, [user]);

  const filtered = tab === "all" ? apps : apps.filter((a) => a.status === tab);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${tab === t.key ? "bg-primary text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {loading && <div>Loading...</div>}
      {!loading && filtered.length === 0 && <div>No applications found.</div>}
      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="p-4 border rounded flex items-center gap-4"
            >
              <div className="flex-1">
                <div className="font-semibold">{app.jobTitle}</div>
                <div className="text-gray-500 text-sm">
                  {app.company} • {app.location}
                </div>
                <div className="text-xs text-gray-400">
                  Applied: {new Date(app.appliedAt).toLocaleDateString()}
                </div>
              </div>
              <ScoreRing score={app.score} />
              <StatusPill status={app.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
