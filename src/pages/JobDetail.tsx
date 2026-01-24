import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMatch } from "@/contexts/MatchContext";
import { useToast } from "@/components/ui/use-toast";
import { getJobById, applyToJob } from "@/mock/api";
import ScoreRing from "@/components/ScoreRing";
import StatusPill from "@/components/StatusPill";
import AuthModal from "@/components/AuthModal";

const JobDetail: React.FC = () => {
  const { jobId } = useParams();
  const { role, user } = useAuth();
  const { matchResults } = useMatch();
  const { toast } = useToast();
  const [job, setJob] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getJobById(jobId!).then(setJob);
  }, [jobId]);

  const matchScore = matchResults?.find((r) => r.jobId === jobId)?.score;

  const handleApply = async () => {
    if (role === "guest") {
      setShowAuth(true);
      return;
    }
    if (!job || job.status !== "open") return;
    setIsApplying(true);
    try {
      await applyToJob(jobId!, user?.id);
      setApplied(true);
      toast({
        title: "Application submitted",
        description: "Your application is pending review.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to apply.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  if (!job) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
      <div className="text-gray-600 mb-4">
        {job.company} • {job.location}
      </div>
      {matchScore !== undefined && (
        <div className="mb-4 flex items-center gap-4">
          <ScoreRing score={matchScore} />
          <span className="text-lg">Match Score</span>
        </div>
      )}
      <div className="mb-6">
        <h2 className="font-semibold mb-1">Description</h2>
        <p>{job.description}</p>
      </div>
      <StatusPill status={job.status} />
      <button
        className="mt-6 btn btn-primary"
        disabled={job.status !== "open" || isApplying || applied}
        onClick={handleApply}
      >
        {role === "guest" ? "Sign in to Apply" : applied ? "Applied" : "Apply"}
      </button>
      <AuthModal open={showAuth} onOpenChange={setShowAuth} />
    </div>
  );
};

export default JobDetail;
