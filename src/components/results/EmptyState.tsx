import { SearchX, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  type: "no-results" | "error";
  onRetry?: () => void;
}

const EmptyState = ({ type, onRetry }: EmptyStateProps) => {
  if (type === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20">
          <SearchX className="h-12 w-12 shrink-0 text-destructive" strokeWidth={2.5} />
        </div>
        <div className="space-y-4 max-w-md">
          <h2 className="text-3xl font-bold text-foreground">Something went wrong</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We couldn't process your CV. This might be a temporary issue. Please try again.
          </p>
        </div>
        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={onRetry} className="h-12 px-6 rounded-xl">
            <RefreshCw className="h-4 w-4 shrink-0 mr-2" strokeWidth={2.5} />
            Try Again
          </Button>
          <Button asChild className="h-12 px-6 rounded-xl">
            <Link to="/upload">
              <Upload className="h-4 w-4 shrink-0 mr-2" strokeWidth={2.5} />
              Upload Different CV
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-muted border border-border">
        <SearchX className="h-12 w-12 shrink-0 text-muted-foreground" strokeWidth={2.5} />
      </div>
      <div className="space-y-4 max-w-md">
        <h2 className="text-3xl font-bold text-foreground">No strong matches found</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We couldn't find jobs that closely match your profile with the current filters. 
          Try adjusting your preferences or upload a more detailed CV.
        </p>
      </div>
      <div className="flex gap-4 mt-8">
        <Button variant="outline" onClick={onRetry} className="h-12 px-6 rounded-xl">
          <RefreshCw className="h-4 w-4 mr-2" />
          Adjust Filters
        </Button>
        <Button asChild className="h-12 px-6 rounded-xl">
          <Link to="/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Different CV
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
