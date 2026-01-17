import { Building2, MapPin, Sparkles, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/Icon";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: "high" | "medium" | "low";
  matchReason: string;
  jobUrl: string;
  postedDate?: string;
  salary?: string;
}

interface JobCardProps {
  job: Job;
  index?: number;
}

const getMatchPercentage = (score: string) => {
  switch (score) {
    case 'high': return '95%';
    case 'medium': return '75%';
    case 'low': return '45%';
    default: return '50%';
  }
};

const getMatchColor = (score: string) => {
  switch (score) {
    case 'high': return 'text-success';
    case 'medium': return 'text-accent';
    case 'low': return 'text-amber-500';
    default: return 'text-muted-foreground';
  }
};

const getMatchBgColor = (score: string) => {
  switch (score) {
    case 'high': return 'bg-success';
    case 'medium': return 'bg-accent';
    case 'low': return 'bg-amber-500';
    default: return 'bg-muted';
  }
};

const JobCard = ({ job, index = 0 }: JobCardProps) => {
  const matchPercentage = getMatchPercentage(job.matchScore);
  const matchColor = getMatchColor(job.matchScore);
  
  return (
    <div 
      className="group rounded-2xl border border-border bg-card p-0 shadow-lg hover:shadow-xl hover:border-primary transition-all duration-300 hover:-translate-y-1 card-hover animate-fade-up overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Match Score Sidebar */}
        <div className="bg-gradient-to-b from-primary/10 to-accent/10 border-r border-border p-6 lg:w-32 flex flex-col items-center justify-center text-center">
          <div className="relative mb-3">
            <div className="h-16 w-16 rounded-full border-4 border-border bg-card"></div>
            <div className={`absolute inset-0 h-16 w-16 rounded-full border-4 ${job.matchScore === 'low' ? 'border-amber-500' : matchColor.replace('text-', 'border-')} border-opacity-30 bg-gradient-radial from-primary/20 to-transparent`}></div>
            <div className="absolute inset-2 flex items-center justify-center">
              <span className={`text-2xl font-bold ${matchColor}`}>{matchPercentage}</span>
            </div>
          </div>
          <div className="text-sm font-semibold text-foreground">
            {job.matchScore === 'high' ? 'High Match' : job.matchScore === 'medium' ? 'Good Match' : 'Potential Match'}
          </div>
          <div className="text-xs text-foreground mt-1">Score</div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <div className="flex-1 min-w-0 space-y-4">
              {/* Job title and company */}
              <div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-200 leading-tight">
                  {job.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-foreground">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="p-1.5 rounded-lg bg-muted">
                      <Icon icon={Building2} size={16} className="text-foreground" />
                    </div>
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="p-1.5 rounded-lg bg-muted">
                      <Icon icon={MapPin} size={16} className="text-foreground" />
                    </div>
                    <span>{job.location}</span>
                  </div>
                  {job.postedDate && (
                    <span className="text-xs text-foreground font-medium">
                      {job.postedDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Match reason */}
              <div className="rounded-2xl bg-card border border-border p-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 mt-1 shrink-0">
                    <Icon icon={Sparkles} size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-foreground mb-3">
                      Why this matches:
                    </p>
                    <p className="text-base text-foreground leading-relaxed">
                      {job.matchReason}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions sidebar */}
            <div className="lg:w-56 flex flex-col gap-4">
              {job.salary && (
                <div className="rounded-2xl bg-card border border-border p-6 text-center shadow-lg">
                  <div className="text-sm text-foreground mb-2 font-medium">Salary Range</div>
                  <div className="text-xl font-bold text-foreground">{job.salary}</div>
                </div>
              )}
              
              <div className="space-y-3">
                <Button 
                  asChild 
                  size="lg"
                  className="w-full h-14 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 group shadow-lg"
                >
                  <a 
                    href={job.jobUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 overflow-visible"
                  >
                    View Job
                    <Icon icon={ExternalLink} size={20} className="transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full h-12 rounded-2xl border-2"
                >
                  Save Job
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
