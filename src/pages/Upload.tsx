import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FileUpload from "@/components/upload/FileUpload";
import FilterSection from "@/components/upload/FilterSection";
import { Link } from "react-router-dom";

interface Filters {
  location: string;
  jobLevel: string;
  category: string;
}

const Upload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filters, setFilters] = useState<Filters>({
    location: "all",
    jobLevel: "all",
    category: "all",
  });

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    
    // Navigate to results page (in real app, would pass file data)
    navigate("/results");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Upload Your CV</h1>
            <p className="text-muted-foreground">
              We'll match your profile with thousands of job opportunities
            </p>
          </div>

          {/* File upload */}
          <div className="mb-8">
            <FileUpload
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
            />
          </div>

          {/* Filters */}
          <div className="mb-8">
            <FilterSection filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Submit button */}
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile}
              variant="hero"
              size="xl"
              className="w-full sm:w-auto"
            >
              <Search className="h-5 w-5" />
              Find Matching Jobs
            </Button>

            {/* Privacy reassurance */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-success" />
              <span>Your CV is processed securely and deleted after matching.</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Upload;
