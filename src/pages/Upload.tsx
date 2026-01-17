import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FileUpload from "@/components/upload/FileUpload";
import FilterSection from "@/components/upload/FilterSection";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import { getProvinces } from "@/components/service/provinceService";

interface Filters {
  location: string;
  jobLevel: string;
  category: string;
  salary: string;
  employmentType: string;
}

const Upload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filters, setFilters] = useState<Filters>({
    location: "all",
    jobLevel: "all",
    category: "all",
    salary: "all",
    employmentType: "all",
  });
  console.log("Filters state:", filters);
  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!selectedFile) return;

    // Navigate to results page (in real app, would pass file data)
    navigate("/results");
  };
  getProvinces();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        {/* Animated dark background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-accent animated-gradient-drift"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 animate-hero-bg-motion"></div>
          <div className="absolute left-1/4 top-1/3 w-96 h-96 bg-gradient-radial from-primary/3 via-accent/2 to-transparent rounded-full blur-3xl animate-hero-glow-pulse"></div>
          <div className="absolute right-1/3 bottom-1/4 w-80 h-80 bg-gradient-radial from-accent/2 via-primary/1 to-transparent rounded-full blur-2xl animate-hero-glow-pulse animation-delay-300"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface/5 via-transparent to-background/5 opacity-30 animated-noise"></div>
        </div>
        
        <div className="container max-w-3xl relative z-10">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <Icon icon={ArrowLeft} size={16} />
            Back to home
          </Link>

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Upload Your CV</h1>
            <p className="text-lg text-muted-foreground">
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
            <FilterSection
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Submit button */}
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile}
              size="xl"
              className="w-full sm:w-auto h-14 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Icon icon={Search} size={16} />
              Find Matching Jobs
            </Button>

            {/* Privacy reassurance */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon icon={Shield} size={16} className="text-success" />
              <span>
                Your CV is processed securely and deleted after matching.
              </span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Upload;
