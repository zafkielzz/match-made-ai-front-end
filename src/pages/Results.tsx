import { useState, useEffect } from "react";
import { ArrowLeft, ArrowUpDown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingState from "@/components/results/LoadingState";
import JobCard, { Job } from "@/components/results/JobCard";
import EmptyState from "@/components/results/EmptyState";

// Mock data for demonstration
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    matchScore: "high",
    matchReason: "Strong match based on your React, TypeScript, and 5+ years of frontend experience.",
    jobUrl: "#",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "San Francisco, CA",
    matchScore: "high",
    matchReason: "Your Node.js and React skills align perfectly with this role's tech stack.",
    jobUrl: "#",
  },
  {
    id: "3",
    title: "React Developer",
    company: "Digital Agency Co.",
    location: "New York, NY",
    matchScore: "medium",
    matchReason: "Good fit for your frontend skills, though requires more design collaboration experience.",
    jobUrl: "#",
  },
  {
    id: "4",
    title: "JavaScript Engineer",
    company: "FinTech Solutions",
    location: "Boston, MA",
    matchScore: "medium",
    matchReason: "Your JavaScript expertise matches, with opportunity to grow in financial domain.",
    jobUrl: "#",
  },
  {
    id: "5",
    title: "Frontend Team Lead",
    company: "Enterprise Corp",
    location: "Chicago, IL",
    matchScore: "low",
    matchReason: "Technical skills match, but role requires more team management experience.",
    jobUrl: "#",
  },
];

const Results = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [sortBy, setSortBy] = useState("match");

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setJobs(mockJobs);
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === "match") {
      const scoreOrder = { high: 0, medium: 1, low: 2 };
      return scoreOrder[a.matchScore] - scoreOrder[b.matchScore];
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container">
            <LoadingState />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container">
            <EmptyState type="no-results" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          {/* Back link */}
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Upload different CV
          </Link>

          {/* Results header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Top Jobs That Match Your Profile</h1>
              <p className="text-muted-foreground">
                Found {jobs.length} matching opportunities
              </p>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Semantic matching note */}
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-primary/5 px-4 py-3 text-sm">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <span className="text-muted-foreground">
              Results are based on semantic AI matching, not exact keywords.
            </span>
          </div>

          {/* Job list */}
          <div className="space-y-4">
            {sortedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Load more / end message */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Showing all {jobs.length} matched jobs
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
