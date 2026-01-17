import { Brain, Search, Sparkles } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-20">
      <div className="relative mb-12">
        {/* Outer ring */}
        <div className="h-32 w-32 rounded-full border-4 border-primary/20 animate-pulse-slow" />
        
        {/* Middle ring */}
        <div className="absolute inset-2 h-28 w-28 rounded-full border-4 border-accent/30 animate-pulse-slow animation-delay-200" />
        
        {/* Inner spinning icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin-slow">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <Brain className="h-12 w-12 shrink-0 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute -right-4 -top-4 animate-bounce-gentle">
          <div className="p-2 rounded-lg bg-accent/10">
            <Sparkles className="h-6 w-6 shrink-0 text-accent" strokeWidth={2.5} />
          </div>
        </div>
        <div className="absolute -bottom-2 -left-3 animate-bounce-gentle animation-delay-300">
          <div className="p-2 rounded-lg bg-primary/10">
            <Search className="h-5 w-5 shrink-0 text-primary" strokeWidth={2.5} />
          </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 animate-bounce-gentle animation-delay-100">
          <div className="p-1.5 rounded-lg bg-muted/50">
            <Sparkles className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="text-center space-y-4 max-w-lg">
        <h2 className="text-3xl font-bold text-foreground">
          Analyzing your CV
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Matching with thousands of job postings using semantic AI analysis...
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex flex-col gap-4 w-full max-w-md mt-8">
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
      className="flex items-center gap-4 rounded-xl bg-muted/30 border border-border/50 px-6 py-4 animate-fade-up"
      style={{ animationDelay: `${delay * 200}ms` }}
    >
      <div className="relative">
        <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
        <div className="absolute inset-0 h-3 w-3 rounded-full bg-primary/20 animate-ping" />
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
};

export default LoadingState;
