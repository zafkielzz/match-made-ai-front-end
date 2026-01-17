import { useState, useEffect } from "react";
import { ArrowLeft, ArrowUpDown, Filter, TrendingUp } from "lucide-react";
import Icon from "@/components/ui/Icon";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import FiltersSheet from "@/components/FiltersSheet";
import SelectedFiltersChips from "@/components/SelectedFiltersChips";

// Mock data for demonstration
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    matchScore: "high",
    matchReason:
      "Strong match based on your React, TypeScript, and 5+ years of frontend experience.",
    jobUrl: "#",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "San Francisco, CA",
    matchScore: "high",
    matchReason:
      "Your Node.js and React skills align perfectly with this role's tech stack.",
    jobUrl: "#",
  },
  {
    id: "3",
    title: "React Developer",
    company: "Digital Agency Co.",
    location: "New York, NY",
    matchScore: "medium",
    matchReason:
      "Good fit for your frontend skills, though requires more design collaboration experience.",
    jobUrl: "#",
  },
  {
    id: "4",
    title: "JavaScript Engineer",
    company: "FinTech Solutions",
    location: "Boston, MA",
    matchScore: "medium",
    matchReason:
      "Your JavaScript expertise matches, with opportunity to grow in financial domain.",
    jobUrl: "#",
  },
  {
    id: "5",
    title: "Frontend Team Lead",
    company: "Enterprise Corp",
    location: "Chicago, IL",
    matchScore: "low",
    matchReason:
      "Technical skills match, but role requires more team management experience.",
    jobUrl: "#",
  },
];

const Results = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [sortBy, setSortBy] = useState("match");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

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

  const filteredJobs = sortedJobs.filter(
    (job) =>
      selectedFilters.length === 0 || selectedFilters.includes(job.matchScore)
  );

  const matchStats = {
    high: jobs.filter((j) => j.matchScore === "high").length,
    medium: jobs.filter((j) => j.matchScore === "medium").length,
    low: jobs.filter((j) => j.matchScore === "low").length,
  };

  const filterOptions = [
    { id: "high", label: "High Match", count: matchStats.high },
    { id: "medium", label: "Good Match", count: matchStats.medium },
    { id: "low", label: "Potential Match", count: matchStats.low },
  ];

  const handleFilterChange = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    );
  };

  const clearAllFilters = () => setSelectedFilters([]);

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
      <main className="flex-1 py-16">
        {/* Animated dark background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-accent animated-gradient-drift"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 animate-hero-bg-motion"></div>
          <div className="absolute left-1/4 top-1/3 w-96 h-96 bg-gradient-radial from-primary/5 via-accent/3 to-transparent rounded-full blur-3xl animate-hero-glow-pulse"></div>
          <div className="absolute right-1/3 bottom-1/4 w-80 h-80 bg-gradient-radial from-accent/4 via-primary/2 to-transparent rounded-full blur-2xl animate-hero-glow-pulse animation-delay-300"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface/5 via-transparent to-background/5 opacity-30 animated-noise"></div>
        </div>

        <div className="container max-w-6xl relative z-10">
          {/* Back link */}
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:gap-3 mb-12 group"
          >
            <Icon icon={ArrowLeft} size={16} className="transition-transform group-hover:-translate-x-1" />
            Upload different CV
          </Link>

          {/* Results header with gradient */}
          <div className="bg-card/80 rounded-2xl p-8 mb-8 border border-border/50 shadow-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  Top Jobs That Match Your Profile
                </h1>
                <p className="text-lg text-muted-foreground">
                  Found {jobs.length} matching opportunities
                </p>
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center gap-3 bg-background/60 rounded-xl p-1 border border-border/50">
                <Icon icon={ArrowUpDown} size={16} className="text-muted-foreground ml-3" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border-0 bg-transparent shadow-none focus:ring-0">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Best Match</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-6 pt-6 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-2 bg-card rounded-lg border border-border shadow-sm">
              <div className="h-3 w-3 rounded-full bg-success"></div>
              <span className="font-semibold text-foreground">
                {matchStats.high}
              </span>
              <span className="text-sm text-foreground">High Match</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-card rounded-lg border border-border shadow-sm">
              <div className="h-3 w-3 rounded-full bg-accent"></div>
              <span className="font-semibold text-foreground">
                {matchStats.medium}
              </span>
              <span className="text-sm text-foreground">Good Match</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-card rounded-lg border border-amber-500/30 shadow-sm">
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <span className="font-semibold text-foreground">
                {matchStats.low}
              </span>
              <span className="text-sm text-foreground">Potential Match</span>
            </div>
            <div className="ml-auto">
              <Button
                variant="outline"
                onClick={() => setIsFiltersOpen(true)}
                className="inline-flex items-center gap-2 h-12 px-4 rounded-xl overflow-visible"
              >
                <Icon icon={Filter} size={16} className="text-foreground" />
                <span>Filter</span>
                {selectedFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedFilters.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Selected filters chips */}
          <SelectedFiltersChips
            filters={selectedFilters
              .map((id) => filterOptions.find((opt) => opt.id === id))
              .filter(Boolean)}
            onRemove={handleFilterChange}
            onClearAll={clearAllFilters}
          />

          {/* Job list */}
          <div className="space-y-6">
            {filteredJobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>

          {/* End message */}
          {filteredJobs.length > 0 && (
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border shadow-sm">
                <Icon icon={TrendingUp} size={16} className="text-success" />
                <p className="text-sm text-foreground font-medium">
                  Showing {filteredJobs.length} of {jobs.length} matched jobs
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Filters sheet */}
      <FiltersSheet
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filterOptions}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default Results;
