import { ArrowRight, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-soft-sm animate-fade-up">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">AI-powered semantic matching</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animate-fade-up animation-delay-100">
            Find the Right Job for You —{" "}
            <span className="gradient-text">Instantly</span>
          </h1>

          {/* Subtext */}
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl animate-fade-up animation-delay-200">
            Upload your CV and get AI-matched job recommendations.{" "}
            <span className="font-medium text-foreground">No account required.</span>{" "}
            Your CV is not stored.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 animate-fade-up animation-delay-300">
            <Button asChild variant="hero" size="xl">
              <Link to="/upload">
                Upload CV & Find Jobs
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            {/* Privacy notice */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-success" />
              <span>We do not store your CV or personal data.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
