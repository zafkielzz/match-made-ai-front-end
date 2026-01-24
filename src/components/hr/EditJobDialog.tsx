import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { 
  NormalizedJob, 
  JobUpdatePayload,
  JobLevel,
  EmploymentType,
  WorkMode,
  JobStatus,
  formatJobLevel,
  formatEmploymentType,
  formatWorkMode,
  formatStatus,
  formatLocation
} from "@/services/jobService";

interface EditJobDialogProps {
  job: NormalizedJob | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string | number, payload: JobUpdatePayload) => Promise<void>;
  isSaving?: boolean;
}

export const EditJobDialog: React.FC<EditJobDialogProps> = ({
  job,
  open,
  onClose,
  onSave,
  isSaving = false,
}) => {
  const [formData, setFormData] = useState<JobUpdatePayload>({
    title: "",
    companyName: "",
    jobLevel: "JUNIOR",
    employmentType: "FULL_TIME",
    workMode: "ONSITE",
    minYearsExperience: 0,
    educationLevel: "",
    jobOverview: "",
    status: "DRAFT",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form when job changes
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        companyName: job.companyName || "",
        jobLevel: job.jobLevel || "JUNIOR",
        employmentType: job.employmentType || "FULL_TIME",
        workMode: job.workMode || "ONSITE",
        minYearsExperience: job.minYearsExperience || 0,
        educationLevel: job.educationLevel || "",
        jobOverview: job.jobOverview || "",
        status: job.status || "DRAFT",
      });
      setErrors({});
    }
  }, [job]);

  const handleChange = (field: keyof JobUpdatePayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.companyName?.trim()) {
      newErrors.companyName = "Company name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !job) return;

    try {
      await onSave(job.id, formData);
      onClose();
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Job</DialogTitle>
          <DialogDescription className="text-slate-400">
            Update job information. Required fields are marked with *
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Job Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Senior Backend Developer"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-xs text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="companyName">
              Company <span className="text-red-400">*</span>
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder="e.g. Tech Corp"
              className={errors.companyName ? "border-red-500" : ""}
            />
            {errors.companyName && (
              <p className="text-xs text-red-400">{errors.companyName}</p>
            )}
          </div>

          {/* Location (read-only display) */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={formatLocation(job.locationDetails)}
              disabled
              className="bg-slate-800/50"
            />
            <p className="text-xs text-slate-400">
              Location cannot be edited here. Use the full form to change location.
            </p>
          </div>

          {/* Job Level & Employment Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobLevel">Job Level</Label>
              <Select
                value={formData.jobLevel}
                onValueChange={(value) => handleChange("jobLevel", value as JobLevel)}
              >
                <SelectTrigger className="bg-background border-white/10">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 z-[200]">
                  <SelectItem value="INTERN">Intern</SelectItem>
                  <SelectItem value="JUNIOR">Junior</SelectItem>
                  <SelectItem value="MID">Mid-Level</SelectItem>
                  <SelectItem value="SENIOR">Senior</SelectItem>
                  <SelectItem value="LEAD">Lead/Manager</SelectItem>
                  <SelectItem value="DIRECTOR">Director/C-Level</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) => handleChange("employmentType", value as EmploymentType)}
              >
                <SelectTrigger className="bg-background border-white/10">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 z-[200]">
                  <SelectItem value="FULL_TIME">Full-time</SelectItem>
                  <SelectItem value="PART_TIME">Part-time</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                  <SelectItem value="INTERN">Internship</SelectItem>
                  <SelectItem value="FREELANCE">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Work Mode & Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workMode">Work Mode</Label>
              <Select
                value={formData.workMode}
                onValueChange={(value) => handleChange("workMode", value as WorkMode)}
              >
                <SelectTrigger className="bg-background border-white/10">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 z-[200]">
                  <SelectItem value="ONSITE">Onsite</SelectItem>
                  <SelectItem value="REMOTE">Remote</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minYearsExperience">Years of Experience</Label>
              <Input
                id="minYearsExperience"
                type="number"
                min="0"
                value={formData.minYearsExperience}
                onChange={(e) => handleChange("minYearsExperience", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Education Level */}
          <div className="space-y-2">
            <Label htmlFor="educationLevel">Education Level</Label>
            <Input
              id="educationLevel"
              value={formData.educationLevel}
              onChange={(e) => handleChange("educationLevel", e.target.value)}
              placeholder="e.g. Bachelor's Degree"
            />
          </div>

          {/* Job Overview */}
          <div className="space-y-2">
            <Label htmlFor="jobOverview">Job Overview</Label>
            <Textarea
              id="jobOverview"
              value={formData.jobOverview}
              onChange={(e) => handleChange("jobOverview", e.target.value)}
              placeholder="Brief job description..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value as JobStatus)}
            >
              <SelectTrigger className="bg-background border-white/10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10 z-[200]">
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="border-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
