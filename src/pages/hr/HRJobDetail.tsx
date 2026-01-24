import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getJobById,
  getApplicantsForJob,
  updateApplicationStatus,
  rejectAllPendingApplicants,
} from "@/mock/api";
import ScoreRing from "@/components/ScoreRing";
import StatusPill from "@/components/StatusPill";
import ConfirmDialog from "@/components/ConfirmDialog";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const HRJobDetail: React.FC = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState<any>(null);
  const [tab, setTab] = useState("all");
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmBulk, setConfirmBulk] = useState(false);

  useEffect(() => {
    getJobById(jobId!).then(setJob);
    getApplicantsForJob(jobId!).then((data) => {
      setApps(data);
      setLoading(false);
    });
  }, [jobId]);

  const handleStatus = async (id: string, status: string) => {
    await updateApplicationStatus(id, status);
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const handleBulkReject = async () => {
    await rejectAllPendingApplicants(jobId!);
    setApps((prev) =>
      prev.map((a) =>
        a.status === "pending" ? { ...a, status: "rejected" } : a,
      ),
    );
    setConfirmBulk(false);
  };

  const filtered = tab === "all" ? apps : apps.filter((a) => a.status === tab);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">{job?.title}</h1>
      <div className="mb-6 text-gray-600">
        {job?.company} • {job?.location}
      </div>
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
      {loading ? (
        <div>Loading...</div>
      ) : filtered.length === 0 ? (
        <div>No applicants found.</div>
      ) : (
        <div className="space-y-4">
          {filtered
            .sort((a, b) => b.score - a.score)
            .map((app) => (
              <div
                key={app.id}
                className="p-4 border rounded flex items-center gap-4"
              >
                <div className="flex-1">
                  <div className="font-semibold">
                    {app.name} ({app.email})
                  </div>
                  <div className="text-gray-500 text-sm mb-1">
                    Score: <ScoreRing score={app.score} />
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    Why this matches: {app.why}
                  </div>
                  <StatusPill status={app.status} />
                </div>
                <div className="flex flex-col gap-2">
                  {app.status === "pending" && (
                    <>
                      <button
                        className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg font-semibold shadow hover:bg-emerald-700 transition"
                        onClick={() => handleStatus(app.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-rose-600 text-white px-4 py-1.5 rounded-lg font-semibold shadow hover:bg-rose-700 transition"
                        onClick={() => handleStatus(app.id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
      <button
        className="mt-8 btn btn-destructive"
        onClick={() => setConfirmBulk(true)}
        disabled={apps.filter((a) => a.status === "pending").length === 0}
      >
        Reject All Pending
      </button>
      <ConfirmDialog
        open={confirmBulk}
        title="Reject All Pending?"
        description="Are you sure you want to reject all pending applicants? This cannot be undone."
        onConfirm={handleBulkReject}
        onCancel={() => setConfirmBulk(false)}
      />
    </div>
  );
};

export default HRJobDetail;
