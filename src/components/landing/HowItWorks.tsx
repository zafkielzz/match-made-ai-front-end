import { Upload, Brain, Target } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload your CV",
    description: "Simply drag and drop your CV in PDF or DOCX format. It takes just seconds.",
  },
  {
    icon: Brain,
    title: "AI analyzes your profile",
    description: "Our AI understands your skills, experience, and career trajectory using semantic analysis.",
  },
  {
    icon: Target,
    title: "Get matched jobs with explanations",
    description: "Receive a ranked list of jobs that truly match your profile, with clear reasoning for each match.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get matched with your ideal job in three simple steps
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-card border border-border shadow-soft-sm card-hover"
            >
              {/* Step number */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
