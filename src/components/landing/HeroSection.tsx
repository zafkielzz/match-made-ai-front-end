import {
  ArrowRight,
  Shield,
  Sparkles,
  Upload,
  Brain,
  Target,
  CheckCircle2,
  AlertCircle,
  Zap,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const ProductPreview = () => {
  return (
    // Xóa max-w, để w-full để nó tự điền đầy khung cha
    <div className="bg-card rounded-3xl border border-border shadow-2xl p-6 w-full">
      <h3 className="text-2xl font-bold text-foreground mb-8">
        Live Product Preview
      </h3>

      <div className="space-y-6">
        {/* Upload stage */}
        <div className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border shadow-lg transition-all hover:border-primary/50">
          {/* Icon giữ nguyên size to, thêm shrink-0 để không bị bóp méo */}
          <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/50">
            <Upload className="w-7 h-7 shrink-0 text-primary" strokeWidth={2} />
          </div>

          {/* Text Container: Xóa truncate, cho phép xuống dòng */}
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-bold text-primary mb-1 leading-tight break-words">
              CV Upload
            </h4>
            <p className="text-sm text-foreground/80 leading-snug break-words">
              Drag & drop or browse resume
            </p>
          </div>

          {/* Badge status: Luôn giữ nguyên kích thước */}
          <div className="shrink-0 pl-1">
            <div className="h-9 px-3 rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-200 text-xs font-semibold flex items-center justify-center shadow-sm whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
              Done
            </div>
          </div>
        </div>

        {/* Analysis stage */}
        <div className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border shadow-lg transition-all hover:border-accent/50">
          <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/50">
            <Brain className="w-7 h-7 shrink-0 text-accent" strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-bold text-accent mb-1 leading-tight break-words">
              AI Analysis
            </h4>
            <p className="text-sm text-foreground/80 leading-snug break-words">
              Extracting skills, experience, and expertise
            </p>
          </div>

          <div className="shrink-0 pl-1">
            <div className="h-9 px-3 rounded-full border border-primary/30 bg-primary/10 text-primary-200 text-xs font-semibold flex items-center justify-center shadow-sm whitespace-nowrap">
              Analyzing
              <span className="ml-1.5 flex items-center gap-0.5">
                <span className="w-1 h-1 rounded-full bg-current animate-bounce"></span>
                <span className="w-1 h-1 rounded-full bg-current animate-bounce delay-75"></span>
                <span className="w-1 h-1 rounded-full bg-current animate-bounce delay-150"></span>
              </span>
            </div>
          </div>
        </div>

        {/* Matching stage */}
        <div className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border shadow-lg transition-all hover:border-primary/50">
          <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/50">
            <Target className="w-7 h-7 shrink-0 text-primary" strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Vẫn giữ font to, nhưng cho phép xuống dòng nếu cần */}
            <h4 className="text-lg font-bold text-primary mb-1 leading-tight break-words">
              Expertise Matching
            </h4>
            <p className="text-sm text-foreground/80 leading-snug break-words">
              Finding roles that match your actual capabilities
            </p>
          </div>

          <div className="shrink-0 pl-1">
            <div className="h-9 px-3 rounded-full border border-white/10 bg-white/5 text-white/90 text-xs font-semibold flex items-center justify-center shadow-sm whitespace-nowrap">
              <Sparkles
                className="w-4 h-4 mr-1.5 text-primary"
                strokeWidth={2.5}
              />
              <span className="text-primary">Match</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Enhanced multi-layer premium dark background */}
      <div className="absolute inset-0 -z-10">
        {/* Base layer: Deep AI gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-accent animated-gradient-drift"></div>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 animate-hero-bg-motion"></div>

        {/* Soft radial glow layer */}
        <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-gradient-radial from-primary/15 via-accent/10 to-transparent rounded-full blur-3xl animate-hero-glow-pulse"></div>
        <div className="absolute right-1/3 bottom-1/4 w-80 h-80 bg-gradient-radial from-accent/12 via-primary/8 to-transparent rounded-full blur-2xl animate-hero-glow-pulse animation-delay-300"></div>

        {/* Animated noise texture layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface/5 via-transparent to-background/5 opacity-30 animated-noise"></div>
        <div
          className="absolute inset-0 animated-radial-light"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), 
                       radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 50%), 
                       radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.06) 0%, transparent 50%)`,
          }}
        ></div>
      </div>

      {/* Enhanced content buffer for text readability */}
      <div className="absolute inset-0 -z-5">
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-secondary/40 to-accent/80 rounded-2xl"></div>
      </div>

      {/* Enhanced soft transition to light section below */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-surface/80 via-background/40 to-transparent -z-5"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card/60 to-transparent -z-5"></div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            {/* Left Column - Content Layer */}
            <div className="lg:col-span-2 space-y-10">
              {/* Market differentiator */}
              <div className="inline-flex items-center gap-4 rounded-2xl border-border/50 bg-card/90 backdrop-blur-sm px-8 py-4 shadow-xl">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles
                    className="h-5 w-5 shrink-0 text-foreground"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-black text-foreground">
                    Other AI matches keywords. We match expertise.
                  </h3>
                  <p className="text-muted-foreground font-medium">
                    Advanced semantic analysis understands career progression,
                    not just resume text.
                  </p>
                </div>
              </div>

              {/* Bold headline with enhanced gradient emphasis */}
              <h1 className="text-7xl font-black tracking-tight sm:text-8xl lg:text-9xl leading-none mb-8">
                <span className="text-foreground">The AI That Understands</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Your Actual Expertise
                </span>
              </h1>

              {/* Technical proof points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-foreground">
                    Technical Superiority
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="font-mono text-sm text-foreground">
                        Context-Aware Analysis
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="font-mono text-sm text-foreground">
                        Career Trajectory Mapping
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="font-mono text-sm text-foreground">
                        Domain Expertise Recognition
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-foreground">
                    Competitive Advantage
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-accent"></div>
                      <span className="font-mono text-sm text-foreground">
                        95% Match Accuracy
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-accent"></div>
                      <span className="font-mono text-sm text-foreground">
                        10x Faster Processing
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-accent"></div>
                      <span className="font-mono text-sm text-foreground">
                        Zero False Positives
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk reversal + Authority CTA */}
              <div className="bg-card rounded-2xl p-10 shadow-2xl border border-border">
                <div className="text-center">
                  <p className="text-xl text-foreground mb-8 font-medium">
                    Worried about AI matching that misses the mark?
                  </p>
                  <h3 className="text-3xl font-bold text-foreground mb-6">
                    See how our expertise matching actually works.
                  </h3>
                  <Button
                    asChild
                    size="xl"
                    className="w-full h-20 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-foreground font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <Link
                      to="/upload"
                      className="flex items-center justify-center gap-4"
                    >
                      Upload CV & Get Expert Matches
                      <ArrowRight
                        className="h-8 w-8 shrink-0"
                        strokeWidth={2.5}
                      />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Dominant Product Preview */}
            <div className="lg:col-span-1">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl backdrop-blur-sm animate-hero-glow-pulse"></div>
                <ProductPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
