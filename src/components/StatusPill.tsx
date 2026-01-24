import React from "react";

interface StatusPillProps {
  status: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-emerald-500/20 text-emerald-300" },
  closed: { label: "Closed", color: "bg-slate-700 text-slate-300" },
  pending: { label: "Pending", color: "bg-yellow-500/20 text-yellow-300" },
  approved: { label: "Approved", color: "bg-emerald-500/20 text-emerald-300" },
  rejected: { label: "Rejected", color: "bg-rose-500/20 text-rose-300" },
};

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const s = statusMap[status] || {
    label: status,
    color: "bg-slate-700 text-slate-300",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.color}`}>
      {s.label}
    </span>
  );
};

export default StatusPill;
