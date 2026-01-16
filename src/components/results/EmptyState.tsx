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
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
          <SearchX className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="mb-3 text-2xl font-semibold">Something went wrong</h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          We couldn't process your CV. This might be a temporary issue. Please try again.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button asChild>
            <Link to="/upload">
              <Upload className="h-4 w-4" />
              Upload Different CV
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="mb-3 text-2xl font-semibold">No strong matches found</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        We couldn't find jobs that closely match your profile with the current filters. 
        Try adjusting your preferences or upload a more detailed CV.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Adjust Filters
        </Button>
        <Button asChild>
          <Link to="/upload">
            <Upload className="h-4 w-4" />
            Upload Different CV
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
