import { Shield, Lock, Trash2, Eye } from "lucide-react";

const features = [
  {
    title: "Zero-Data Architecture",
    description: "No accounts, no profiles, no tracking. Your data exists only for the matching process.",
    technical: "Stateless processing with immediate deletion",
    compliance: "GDPR Article 17 compliant by design",
  },
  {
    title: "Enterprise-Grade Security",
    description: "AES-256 encryption for data in transit and processing. SOC 2 Type II certified infrastructure.",
    technical: "End-to-end encryption + secure enclaves",
    compliance: "ISO 27001 certified",
  },
  {
    title: "Radical Transparency",
    description: "Every matching decision is explained. No black-box algorithms or hidden criteria.",
    technical: "Open matching logic with detailed reasoning",
    compliance: "Third-party audited algorithms",
  },
];

const PrivacySection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-background via-secondary to-accent border-y border-border/50">
      {/* Subtle background texture */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/8 via-transparent to-accent/8 animate-hero-bg-motion"></div>
        <div className="absolute left-1/3 top-1/4 w-96 h-96 bg-gradient-radial from-primary/4 via-accent/2 to-transparent rounded-full blur-3xl animate-hero-glow-pulse"></div>
        <div className="absolute right-1/4 bottom-1/3 w-80 h-80 bg-gradient-radial from-accent/3 via-primary/2 to-transparent rounded-full blur-2xl animate-hero-glow-pulse animation-delay-300"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface/5 via-transparent to-background/5 opacity-30 animated-noise"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-7xl">
          {/* Compliance header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-6 mb-8">
              <div className="flex h-16 w-16 rounded-2xl bg-gradient-to-br from-secondary to-accent shadow-2xl flex items-center justify-center">
                <Shield className="h-8 w-8 shrink-0 text-foreground" strokeWidth={2.5} />
              </div>
              <h2 className="text-5xl font-black tracking-tight sm:text-6xl">
                Privacy is Our
                <span className="text-primary">Foundation</span>
              </h2>
            </div>
            <p className="text-xl text-foreground max-w-5xl mx-auto leading-relaxed">
              We engineered privacy as a core product feature with enterprise-grade compliance and legal guarantees.
            </p>

          {/* Compliance badges */}
          <div className="flex justify-center gap-8 mb-16">
            <div className="bg-card rounded-2xl border border-border shadow-lg p-6 text-center">
              <div className="text-success text-3xl font-bold mb-2">GDPR</div>
              <p className="text-sm text-foreground">Article 17 Compliant</p>
            </div>
            <div className="bg-card rounded-2xl border border-border shadow-lg p-6 text-center">
              <div className="text-accent text-3xl font-bold mb-2">SOC 2</div>
              <p className="text-sm text-foreground">Type II Certified</p>
            </div>
            <div className="bg-card rounded-2xl border border-border shadow-lg p-6 text-center">
              <div className="text-primary text-3xl font-bold mb-2">ISO 27001</div>
              <p className="text-sm text-foreground">Information Security</p>
            </div>
          </div>

          {/* Feature comparison */}
          <div className="grid gap-8 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="group">
                <div className="rounded-2xl border border-border bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary">
                  {/* Feature header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                        <Shield className="h-4 w-4 shrink-0 text-foreground" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
                    </div>
                    <p className="text-lg text-foreground leading-relaxed">{feature.description}</p>
                  </div>
                   
                  {/* Technical specifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card rounded-xl p-4 border border-border">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Technical Implementation</h4>
                      <p className="font-mono text-sm text-foreground">{feature.technical}</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Compliance</h4>
                      <p className="font-mono text-sm text-foreground">{feature.compliance}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legal guarantees */}
          <div className="mt-20">
            <div className="bg-card rounded-2xl p-12 shadow-2xl border border-border max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Shield className="h-16 w-16 shrink-0 text-foreground" strokeWidth={2.5} />
                <h3 className="text-4xl font-bold text-foreground mb-6">Our Legal Privacy Guarantee</h3>
                <p className="text-xl text-foreground leading-relaxed max-w-3xl mx-auto mb-8">
                  If your data is ever stored, processed, or transmitted without explicit consent, 
                  <span className="text-primary font-bold text-2xl">we pay $10,000 per incident.</span>
                </p>
              </div>
              <div className="bg-card rounded-2xl p-8 border border-border">
                <p className="text-base text-foreground font-mono leading-relaxed text-center">
                  <span className="block mb-2">Guarantee ID: PRIV-2024-001</span>
                  <span className="block mb-2">Legal Jurisdiction: EU General Data Protection Regulation</span>
                  <span className="block">Enforcement: Third-party auditor verification</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
