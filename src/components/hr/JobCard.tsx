import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Edit, 
  Trash2,
  Users,
  Clock
} from "lucide-react";
import { 
  NormalizedJob,
  formatJobLevel,
  formatEmploymentType,
  formatWorkMode,
  formatStatus,
  formatLocation
} from "@/services/jobService";

interface JobCardProps {
  job: NormalizedJob;
  onEdit: (job: NormalizedJob) => void;
  onDelete: (job: NormalizedJob) => void;
  isDeleting?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  return (
    <Card className="border-white/10 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-2 truncate">
                {job.title}
              </h3>
              
              <div className="flex items-center gap-2 text-slate-300 mb-2">
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{job.companyName}</span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{formatLocation(job.locationDetails)}</span>
              </div>
            </div>

            {/* Status Badge */}
            <Badge
              className={`
                ${job.status === "PUBLISHED"
                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                  : job.status === "ARCHIVED"
                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                  : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                }
              `}
            >
              {formatStatus(job.status)}
            </Badge>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <Briefcase className="w-3 h-3 mr-1" />
              {formatJobLevel(job.jobLevel)}
            </Badge>
            
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Clock className="w-3 h-3 mr-1" />
              {formatEmploymentType(job.employmentType)}
            </Badge>
            
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {formatWorkMode(job.workMode)}
            </Badge>
            
            {job.salary && (job.salary.min || job.salary.max) && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <DollarSign className="w-3 h-3 mr-1" />
                {job.salary.min && job.salary.max
                  ? `${job.salary.currency || "$"} ${job.salary.min}-${job.salary.max}`
                  : job.salary.min
                  ? `From ${job.salary.currency || "$"} ${job.salary.min}`
                  : `Up to ${job.salary.currency || "$"} ${job.salary.max}`}
              </Badge>
            )}
          </div>

          {/* Stats */}
          {(job.applicants !== undefined || job.pending !== undefined) && (
            <div className="flex items-center gap-4 text-sm text-slate-400 pt-2 border-t border-white/10">
              {job.applicants !== undefined && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{job.applicants} applicants</span>
                </div>
              )}
              {job.pending !== undefined && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{job.pending} pending</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => onEdit(job)}
              variant="outline"
              size="sm"
              className="flex-1 border-white/10 hover:bg-white/5"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            
            <Button
              onClick={() => onDelete(job)}
              variant="outline"
              size="sm"
              disabled={isDeleting}
              className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
