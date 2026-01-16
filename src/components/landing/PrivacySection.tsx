import { Shield, Lock, Trash2, Eye } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Secure Processing",
    description: "Your CV is encrypted during transmission and processing.",
  },
  {
    icon: Trash2,
    title: "Instant Deletion",
    description: "Your CV is deleted immediately after matching is complete.",
  },
  {
    icon: Eye,
    title: "No Tracking",
    description: "We don't create profiles or track your activity.",
  },
];

const PrivacySection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-success/5 to-primary/5 p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <h2 className="text-2xl font-bold sm:text-3xl">Your Privacy Matters</h2>
            </div>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              We built JobMatch AI with privacy at its core. Unlike other platforms, we never store or sell your data.
            </p>

            <div className="grid gap-6 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card border border-border">
                    <feature.icon className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
