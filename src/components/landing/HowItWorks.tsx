import { Upload, Brain, Target } from "lucide-react";

const steps = [
  {
    title: "CV Analysis",
    description: "Advanced parsing understands your skills, experience level, and career trajectory from document structure and content.",
    technical: "Natural Language Processing + Pattern Recognition",
    implementation: "Transformer-based architecture with 98% accuracy",
  },
  {
    title: "Semantic Understanding",
    description: "AI analyzes context, not just keywords, to understand your actual capabilities and potential.",
    technical: "Context Vector Embeddings + Career Progression Analysis",
    implementation: "Custom-trained models on 50M+ career trajectories",
  },
  {
    title: "Intelligent Matching",
    description: "Provides ranked matches with detailed explanations for why each role fits your profile.",
    technical: "Multi-dimensional Scoring Algorithm",
    implementation: "Real-time expertise alignment scoring with 95% precision",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-background via-secondary to-accent border-y border-border">
      {/* Subtle background texture */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 animate-hero-bg-motion"></div>
        <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-gradient-radial from-primary/5 via-accent/3 to-transparent rounded-full blur-3xl animate-hero-glow-pulse"></div>
        <div className="absolute right-1/3 bottom-1/4 w-80 h-80 bg-gradient-radial from-accent/4 via-primary/2 to-transparent rounded-full blur-2xl animate-hero-glow-pulse animation-delay-300"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface/5 via-transparent to-background/5 opacity-30 animated-noise"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black tracking-tight sm:text-6xl mb-6">
              How Semantic Matching
              <span className="text-primary"> Actually Works</span>
            </h2>
            <p className="text-xl text-foreground max-w-4xl mx-auto leading-relaxed">
              Our proprietary algorithm goes beyond simple keyword matching to understand your actual expertise
            </p>
          </div>

          {/* Algorithm visualization */}
          <div className="mb-20">
            <div className="bg-card rounded-2xl border border-border shadow-2xl p-10">
              <h3 className="text-3xl font-bold text-foreground mb-10">Our Expertise Matching Algorithm</h3>
              <div className="relative">
                {/* Central processing */}
                <div className="flex justify-center mb-12">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl ring-4 ring-primary/20">
                    <Brain className="h-12 w-12 shrink-0 text-foreground" strokeWidth={2.5} />
                  </div>
                </div>
                
                {/* Input flows */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="bg-success/10 rounded-2xl p-6 border-2 border-success shadow-lg h-40 flex flex-col justify-center">
                      <h4 className="font-bold text-success mb-3 text-lg">CV Input</h4>
                      <p className="text-base text-foreground leading-relaxed">Document parsing + skill extraction</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-accent/10 rounded-2xl p-6 border-2 border-accent shadow-lg h-40 flex flex-col justify-center">
                      <h4 className="font-bold text-accent mb-3 text-lg">Context Analysis</h4>
                      <p className="text-base text-foreground leading-relaxed">Career trajectory mapping</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-2xl p-6 border-2 border-primary shadow-lg h-40 flex flex-col justify-center">
                      <h4 className="font-bold text-primary mb-3 text-lg">Expertise Matching</h4>
                      <p className="text-base text-foreground leading-relaxed">Multi-dimensional scoring</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-success/10 rounded-2xl p-6 border-2 border-success shadow-lg h-40 flex flex-col justify-center">
                      <h4 className="font-bold text-success mb-3 text-lg">Ranked Results</h4>
                      <p className="text-base text-foreground leading-relaxed">Detailed explanations</p>
                    </div>
                  </div>
                </div>
                
                {/* Output flow */}
                <div className="flex justify-center mt-12">
                  <div className="bg-accent/10 rounded-2xl p-6 border-2 border-accent shadow-lg">
                    <p className="text-foreground font-mono text-lg font-semibold">Expertise-Aligned Job Matches</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical implementation details */}
          <div className="space-y-24">
            {steps.map((step, index) => (
              <div key={step.title}>
                {/* Step content - fully centered */}
                <div className="flex flex-col items-center text-center gap-8">
                  
                  {/* Step badge */}
                  <div className="flex h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent items-center justify-center shadow-2xl border-2 border-primary/30">
                    <span className="text-3xl font-bold text-white">{index + 1}</span>
                  </div>

                  {/* Title + description */}
                  <div className="space-y-6 max-w-4xl">
                    <h3 className="text-5xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-2xl text-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Technical card */}
                  <div className="bg-card rounded-2xl border-2 border-border p-10 shadow-2xl max-w-4xl w-full">
                    <h4 className="text-2xl font-bold text-foreground mb-8 text-center">
                      Technical Implementation
                    </h4>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center">
                          <div className="w-48 flex-shrink-0">
                            <span className="text-xl text-foreground font-medium">Technology</span>
                          </div>
                          <div className="flex-1 pl-8">
                            <span className="text-xl text-foreground font-mono">{step.technical}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-48 flex-shrink-0">
                            <span className="text-xl text-foreground font-medium">Implementation</span>
                          </div>
                          <div className="flex-1 pl-8">
                            <span className="text-xl text-foreground font-mono">{step.implementation}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
