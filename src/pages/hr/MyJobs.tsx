import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJobs, deleteJob, NormalizedJob } from "@/services/jobService";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Briefcase } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { JobCard } from "@/components/hr/JobCard";
import { EditJobDialog } from "@/components/hr/EditJobDialog";

const MyJobs: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<NormalizedJob | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error("Error loading jobs:", err);
      setError("Failed to load jobs. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (job: NormalizedJob) => {
    try {
      await deleteJob(job.id);
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting job:", err);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (job: NormalizedJob) => {
    setEditingJob(job);
  };

  const handleEditClose = () => {
    setEditingJob(null);
  };

  const handleEditSave = async (id: string | number, payload: any) => {
    try {
      // The EditJobDialog handles the actual update
      // Just reload jobs after save
      await loadJobs();
      setEditingJob(null);
      toast({
        title: "Success",
        description: "Job updated successfully",
      });
    } catch (err) {
      console.error("Error updating job:", err);
      toast({
        title: "Error",
        description: "Failed to update job",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-400">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-4">
            <p className="text-red-300">{error}</p>
          </div>
          <Button onClick={loadJobs}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Briefcase className="w-10 h-10 text-primary" />
              My Jobs
            </h1>
            <p className="text-slate-400">
              Manage your job postings
            </p>
          </div>
          <Button
            onClick={() => navigate("/hr/jobs/new")}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-slate-800/30 rounded-lg p-12 border border-white/10 max-w-md mx-auto">
              <Briefcase className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No jobs posted yet
              </h3>
              <p className="text-slate-400 mb-6">
                Start by creating your first job posting
              </p>
              <Button
                onClick={() => navigate("/hr/jobs/new")}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post Your First Job
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        {jobs.length > 0 && (
          <div className="mt-8 text-center text-sm text-slate-400">
            Showing {jobs.length} job{jobs.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {editingJob && (
        <EditJobDialog
          job={editingJob}
          open={!!editingJob}
          onClose={handleEditClose}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default MyJobs;
