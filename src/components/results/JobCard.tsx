import { MapPin, Building2, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: "high" | "medium" | "low";
  matchReason: string;
  jobUrl: string;
  postedDate?: string;
}

interface JobCardProps {
  job: Job;
}

const matchLabels = {
  high: "High Match",
  medium: "Good Match",
  low: "Potential Match",
};

const JobCard = ({ job }: JobCardProps) => {
  return (
    <div className="group rounded-2xl border border-border bg-card p-6 shadow-soft-sm card-hover">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          {/* Match badge */}
          <div className="mb-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                job.matchScore === "high" && "bg-success/10 text-success",
                job.matchScore === "medium" && "bg-warning/10 text-warning",
                job.matchScore === "low" && "bg-muted text-muted-foreground"
              )}
            >
              <Sparkles className="h-3 w-3" />
              {matchLabels[job.matchScore]}
            </span>
          </div>

          {/* Job title */}
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {job.title}
          </h3>

          {/* Company and location */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
          </div>

          {/* Match reason */}
          <div className="rounded-lg bg-muted/50 px-4 py-3">
            <p className="text-sm">
              <span className="font-medium text-foreground">Why this matches: </span>
              <span className="text-muted-foreground">{job.matchReason}</span>
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="sm:ml-4 shrink-0">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">
              View Job
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
