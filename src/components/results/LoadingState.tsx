import { Brain, Search, Sparkles } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-20">
      <div className="relative mb-8">
        {/* Outer ring */}
        <div className="h-24 w-24 rounded-full border-4 border-muted animate-pulse-slow" />
        
        {/* Inner spinning icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin-slow">
            <Brain className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute -right-2 -top-2 animate-bounce-gentle">
          <Sparkles className="h-6 w-6 text-accent" />
        </div>
        <div className="absolute -bottom-1 -left-2 animate-bounce-gentle animation-delay-200">
          <Search className="h-5 w-5 text-primary" />
        </div>
      </div>

      <h2 className="mb-3 text-2xl font-semibold text-center">
        Analyzing your CV
      </h2>
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        Matching with thousands of job postings using semantic AI analysis...
      </p>

      {/* Progress steps */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <LoadingStep label="Extracting skills and experience" delay={0} />
        <LoadingStep label="Understanding career trajectory" delay={1} />
        <LoadingStep label="Finding best job matches" delay={2} />
      </div>
    </div>
  );
};

const LoadingStep = ({ label, delay }: { label: string; delay: number }) => {
  return (
    <div 
      className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3 animate-fade-up"
      style={{ animationDelay: `${delay * 200}ms` }}
    >
      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
};

export default LoadingState;
