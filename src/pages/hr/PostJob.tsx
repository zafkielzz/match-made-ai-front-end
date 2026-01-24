import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createJob,
  JobLevel,
  EmploymentType,
  WorkMode,
  JobStatus,
} from "@/services/jobService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  Building2,
  FileText,
  Code,
  Gift,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Loader2,
  MapPin,
  Calendar,
  Users,
  Send,
  Target,
  Award,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { OccupationSearch } from "@/components/hr/OccupationSearch";
import { IndustryMultiSelect } from "@/components/hr/IndustryMultiSelect";
import { BulletListInput } from "@/components/hr/BulletListInput";
import { LocationSearch } from "@/components/hr/LocationSearch";
import {
  SalaryRangeInput,
  SalaryRange,
} from "@/components/hr/SalaryRangeInput";
import {
  BenefitsMultiSelect,
  PREDEFINED_BENEFITS,
} from "@/components/hr/BenefitsMultiSelect";
import {
  LanguageRequirements,
  LanguageRequirement,
} from "@/components/hr/LanguageRequirements";
import {
  TechnologyStackInput,
  TechnologyItem,
} from "@/components/hr/TechnologyStackInput";
import { ExperienceInput } from "@/components/hr/ExperienceInput";
import { QualityScoreCard } from "@/components/hr/QualityScoreCard";
import { QualityCheckDialog } from "@/components/hr/QualityCheckDialog";
import { normalizeJobFormData } from "@/utils/jobNormalization";
import { countLetters } from "@/utils/jobValidation";

interface Location {
  city: string;
  country: string;
  code?: string;
}

interface JobFormData {
  // General Information
  title: string;
  company: string;
  occupation: { code: string; label: string } | null;
  industries: Array<{ code: string; label: string; version: string }>;
  jobLevel: JobLevel | "";
  employmentType: EmploymentType | "";
  requiredExperience: number;
  educationLevel: string;
  languageRequirements: LanguageRequirement[];
  workMode: WorkMode | "";
  location: Location | null;
  salary: SalaryRange;

  // Job Overview
  jobOverview: string;

  // Job Responsibilities
  responsibilities: string[];

  // Candidate Requirements
  requiredQualifications: string[];
  preferredQualifications: string[];

  // Technology Stack
  programmingLanguages: TechnologyItem[];
  frameworks: TechnologyItem[];
  databases: TechnologyItem[];
  toolsPlatforms: TechnologyItem[];

  // Benefits & Perks
  benefits: string[]; // IDs of predefined benefits
  customBenefits: string[]; // Custom benefit text

  // Working Information
  workingTime: string;

  // Application Information
  applicationDeadline: string;
  numberOfHires: string;
  applyMethod: string;
  applyEmail: string;
  applyLink: string;
  jobStatus: JobStatus;
}

const TECH_SUGGESTIONS = {
  languages: [
    "Python",
    "JavaScript",
    "TypeScript",
    "Java",
    "Go",
    "Rust",
    "C++",
    "C#",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
  ],
  frameworks: [
    "React",
    "Vue",
    "Angular",
    "Django",
    "FastAPI",
    "Spring Boot",
    "Express",
    "Next.js",
    "Laravel",
    "Rails",
  ],
  databases: [
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Elasticsearch",
    "Cassandra",
    "DynamoDB",
    "Oracle",
  ],
  tools: [
    "Docker",
    "Kubernetes",
    "AWS",
    "GCP",
    "Azure",
    "Jenkins",
    "GitLab CI",
    "Terraform",
    "Ansible",
  ],
};

const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showQualityCheck, setShowQualityCheck] = useState(false);

  const [form, setForm] = useState<JobFormData>({
    title: "",
    company: "",
    occupation: null,
    industries: [],
    jobLevel: "",
    employmentType: "",
    requiredExperience: 0,
    educationLevel: "",
    languageRequirements: [],
    workMode: "",
    location: null,
    salary: {
      min: 0,
      max: 0,
      currency: "USD",
      negotiable: false,
      type: "GROSS",
    },
    jobOverview: "",
    responsibilities: [],
    requiredQualifications: [],
    preferredQualifications: [],
    programmingLanguages: [],
    frameworks: [],
    databases: [],
    toolsPlatforms: [],
    benefits: [],
    customBenefits: [],
    workingTime: "",
    applicationDeadline: "",
    numberOfHires: "1",
    applyMethod: "platform",
    applyEmail: "",
    applyLink: "",
    jobStatus: "DRAFT",
  });

  const updateForm = <K extends keyof JobFormData>(
    field: K,
    value: JobFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // General Information
        if (!form.title.trim()) {
          toast({ title: "Job title is required", variant: "destructive" });
          return false;
        }
        if (!form.company.trim()) {
          toast({ title: "Company name is required", variant: "destructive" });
          return false;
        }
        if (!form.occupation) {
          toast({
            title: "Job role/occupation is required",
            variant: "destructive",
          });
          return false;
        }
        if (!form.jobLevel) {
          toast({ title: "Job level is required", variant: "destructive" });
          return false;
        }
        if (!form.workMode) {
          toast({ title: "Work mode is required", variant: "destructive" });
          return false;
        }
        if (!form.location) {
          toast({ title: "Job location is required", variant: "destructive" });
          return false;
        }
        if (form.languageRequirements.length === 0) {
          toast({
            title: "At least one language requirement is needed",
            variant: "destructive",
          });
          return false;
        }
        // Validate language requirements have language selected
        const invalidLang = form.languageRequirements.find(
          (lang) => !lang.language.trim(),
        );
        if (invalidLang) {
          toast({
            title: "Please select a language for all language requirements",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 2: // Job Description & Responsibilities
        if (!form.jobOverview.trim()) {
          toast({ title: "Job overview is required", variant: "destructive" });
          return false;
        }
        if (form.responsibilities.length < 3) {
          toast({
            title: "At least 3 responsibilities are required",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 3: // Candidate Requirements
        if (form.requiredQualifications.length < 3) {
          toast({
            title: "At least 3 required qualifications are needed",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 4: // Tech Stack - Optional
        return true;

      case 5: // Benefits - Required
        if (form.benefits.length === 0 && form.customBenefits.length === 0) {
          toast({
            title: "At least one benefit is required",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 6: // Application Info
        if (!form.applicationDeadline) {
          toast({
            title: "Application deadline is required",
            variant: "destructive",
          });
          return false;
        }
        if (form.applyMethod === "email" && !form.applyEmail) {
          toast({
            title: "Email is required for email application method",
            variant: "destructive",
          });
          return false;
        }
        if (form.applyMethod === "link" && !form.applyLink) {
          toast({
            title: "Link is required for external link application method",
            variant: "destructive",
          });
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    // Show quality check dialog instead of submitting directly
    setShowQualityCheck(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);

    // Normalize form data before submission
    const normalizedForm = normalizeJobFormData(form);

    // Build normalized payload
    const payload = {
      // Taxonomy data (for search & filter)
      occupation: normalizedForm.occupation
        ? {
            taxonomy: "ESCO_OCCUPATION",
            code: normalizedForm.occupation.code,
            label: normalizedForm.occupation.label,
          }
        : undefined,
      industries: normalizedForm.industries.map((ind: any) => ({
        taxonomy: "VSIC_INDUSTRY",
        version: ind.version,
        code: ind.code,
        label: ind.label,
      })),

      // General info (NORMALIZED - no duplicates)
      title: normalizedForm.title,
      companyName: normalizedForm.company,
      jobLevel: normalizedForm.jobLevel,
      employmentType: normalizedForm.employmentType,
      workMode: normalizedForm.workMode,
      minYearsExperience: normalizedForm.requiredExperience,
      educationLevel: normalizedForm.educationLevel,
      languageRequirements: normalizedForm.languageRequirements,

      // Location (NORMALIZED - locationDetails only)
      locationDetails: normalizedForm.location,

      // Salary
      salary:
        normalizedForm.salary.min || normalizedForm.salary.max
          ? normalizedForm.salary
          : undefined,

      // Job description
      jobOverview: normalizedForm.jobOverview,

      // Responsibilities (structured array for AI)
      responsibilities: normalizedForm.responsibilities,

      // Requirements (structured arrays for AI skill extraction)
      requirements: {
        required: normalizedForm.requiredQualifications,
        preferred: normalizedForm.preferredQualifications,
      },

      // Tech stack (for AI matching)
      technologyStack: {
        programmingLanguages: normalizedForm.programmingLanguages,
        frameworks: normalizedForm.frameworks,
        databases: normalizedForm.databases,
        toolsPlatforms: normalizedForm.toolsPlatforms,
      },

      // Benefits (structured for chips display)
      benefits: {
        predefined: normalizedForm.benefits.map((id: string) => {
          const benefit = PREDEFINED_BENEFITS.find((b) => b.id === id);
          return {
            id,
            label: benefit?.label || "",
            icon: benefit?.icon || "",
          };
        }),
        custom: normalizedForm.customBenefits,
      },

      // Working info
      workingTime: normalizedForm.workingTime,

      // Application info
      applicationDeadline: normalizedForm.applicationDeadline,
      numberOfHires: parseInt(normalizedForm.numberOfHires) || 1,
      applyMethod: normalizedForm.applyMethod,
      applyEmail: normalizedForm.applyEmail,
      applyLink: normalizedForm.applyLink,

      // Job status (NORMALIZED - status only)
      status: normalizedForm.jobStatus,

      // Metadata
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    try {
      // Send normalized payload to API
      await createJob(payload);

      toast({
        title: "Success!",
        description: `Job ${normalizedForm.jobStatus === "PUBLISHED" ? "published" : "saved as draft"} successfully`,
      });

      navigate("/hr/jobs");
    } catch (error) {
      console.error("Error posting job:", error);
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowQualityCheck(false);
    }
  };

  const steps = [
    { id: 1, name: "General", icon: Briefcase },
    { id: 2, name: "Responsibilities", icon: Target },
    { id: 3, name: "Requirements", icon: Award },
    { id: 4, name: "Tech Stack", icon: Code },
    { id: 5, name: "Benefits", icon: Gift },
    { id: 6, name: "Application", icon: Send },
    { id: 7, name: "Review", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/hr/jobs")}
                className="mb-4 text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Button>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Briefcase className="w-10 h-10 text-primary" />
                Post a New Job
              </h1>
              <p className="text-slate-400">
                Create a complete job posting with quality validation for better
                AI matching
              </p>
            </div>

            {/* Progress Steps */}
            <Card className="mb-6 border-white/10 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between overflow-x-auto">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                      <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center gap-2 min-w-[80px]">
                          <div
                            className={`
                          w-12 h-12 rounded-full flex items-center justify-center transition-all
                          ${isActive ? "bg-primary text-white scale-110 shadow-lg shadow-primary/50" : ""}
                          ${isCompleted ? "bg-green-500 text-white" : ""}
                          ${!isActive && !isCompleted ? "bg-slate-700 text-slate-400" : ""}
                        `}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <span
                            className={`text-xs font-medium text-center ${isActive ? "text-primary" : "text-slate-400"}`}
                          >
                            {step.name}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 min-w-[20px] ${isCompleted ? "bg-green-500" : "bg-slate-700"}`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit}>
              {/* Step 1: General Information */}
              {currentStep === 1 && (
                <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-primary" />
                      1. General Information
                    </CardTitle>
                    <CardDescription>
                      Basic job details with taxonomy integration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Job Title & Company */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">
                          Job Title <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="title"
                          placeholder="e.g. Senior Backend Developer"
                          value={form.title}
                          onChange={(e) => updateForm("title", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">
                          Company Name <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="company"
                          placeholder="e.g. Tech Corp"
                          value={form.company}
                          onChange={(e) =>
                            updateForm("company", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* ESCO Occupation Search */}
                    <OccupationSearch
                      value={form.occupation}
                      onChange={(value) => updateForm("occupation", value)}
                      required
                    />

                    <Separator className="bg-white/10" />

                    {/* VSIC Industry Multi-Select */}
                    <IndustryMultiSelect
                      value={form.industries}
                      onChange={(value) => updateForm("industries", value)}
                      required
                    />

                    <Separator className="bg-white/10" />

                    {/* Job Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="jobLevel">
                          Job Level <span className="text-red-400">*</span>
                        </Label>
                        <Select
                          value={form.jobLevel}
                          onValueChange={(v) =>
                            updateForm("jobLevel", v as JobLevel)
                          }
                        >
                          <SelectTrigger className="bg-background border-white/10">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-white/10 z-[200]">
                            <SelectItem value="INTERN">Intern</SelectItem>
                            <SelectItem value="JUNIOR">
                              Junior (0-2 years)
                            </SelectItem>
                            <SelectItem value="MID">
                              Mid-Level (2-5 years)
                            </SelectItem>
                            <SelectItem value="SENIOR">
                              Senior (5+ years)
                            </SelectItem>
                            <SelectItem value="LEAD">Lead</SelectItem>
                            <SelectItem value="MANAGER">Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employmentType">Employment Type</Label>
                        <Select
                          value={form.employmentType}
                          onValueChange={(v) =>
                            updateForm("employmentType", v as EmploymentType)
                          }
                        >
                          <SelectTrigger className="bg-background border-white/10">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-white/10 z-[200]">
                            <SelectItem value="FULL_TIME">Full-time</SelectItem>
                            <SelectItem value="PART_TIME">Part-time</SelectItem>
                            <SelectItem value="CONTRACT">Contract</SelectItem>
                            <SelectItem value="TEMP">Temporary</SelectItem>
                            <SelectItem value="FREELANCE">Freelance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <ExperienceInput
                        value={form.requiredExperience}
                        onChange={(value) =>
                          updateForm("requiredExperience", value)
                        }
                      />

                      <div className="space-y-2">
                        <Label htmlFor="educationLevel">Education Level</Label>
                        <Select
                          value={form.educationLevel}
                          onValueChange={(v) => updateForm("educationLevel", v)}
                        >
                          <SelectTrigger className="bg-background border-white/10">
                            <SelectValue placeholder="Select education" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-white/10 z-[200]">
                            <SelectItem value="HIGH_SCHOOL">
                              High School
                            </SelectItem>
                            <SelectItem value="ASSOCIATE">
                              Associate Degree
                            </SelectItem>
                            <SelectItem value="BACHELOR">
                              Bachelor's Degree
                            </SelectItem>
                            <SelectItem value="MASTER">
                              Master's Degree
                            </SelectItem>
                            <SelectItem value="PHD">PhD</SelectItem>
                            <SelectItem value="NONE">Not Required</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Language Requirements */}
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                      <p className="text-sm text-purple-300 flex items-start gap-2 mb-4">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Language Requirements:</strong> Specify
                          required languages with proficiency levels. Optionally
                          add language certificates (IELTS, TOEIC, etc.) for
                          verification.
                        </span>
                      </p>
                    </div>

                    <LanguageRequirements
                      value={form.languageRequirements}
                      onChange={(value) =>
                        updateForm("languageRequirements", value)
                      }
                      required
                    />

                    <Separator className="bg-white/10" />

                    {/* Work Mode & Location */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-sm text-blue-300 flex items-start gap-2 mb-4">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Work Arrangement:</strong> These fields will
                          be displayed as chips in job detail
                        </span>
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="workMode">
                            Work Mode <span className="text-red-400">*</span>
                          </Label>
                          <Select
                            value={form.workMode}
                            onValueChange={(v) =>
                              updateForm("workMode", v as WorkMode)
                            }
                          >
                            <SelectTrigger className="bg-background border-white/10">
                              <SelectValue placeholder="Select work mode" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-white/10 z-[200]">
                              <SelectItem value="ONSITE">Onsite</SelectItem>
                              <SelectItem value="HYBRID">Hybrid</SelectItem>
                              <SelectItem value="REMOTE">Remote</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="workingTime">Working Time</Label>
                          <Input
                            id="workingTime"
                            placeholder="e.g. Monday-Friday, 9AM-6PM"
                            value={form.workingTime}
                            onChange={(e) =>
                              updateForm("workingTime", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <LocationSearch
                      value={form.location}
                      onChange={(value) => updateForm("location", value)}
                      required
                    />

                    <Separator className="bg-white/10" />

                    {/* Salary Range */}
                    <SalaryRangeInput
                      value={form.salary}
                      onChange={(value) => updateForm("salary", value)}
                    />

                    <div className="flex justify-end pt-4">
                      <Button type="button" onClick={handleNext}>
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Job Responsibilities */}
              {currentStep === 2 && (
                <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-6 h-6 text-primary" />
                      2. Job Responsibilities
                    </CardTitle>
                    <CardDescription>
                      Describe the role overview and main responsibilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="jobOverview">
                        Job Overview <span className="text-red-400">*</span>
                      </Label>
                      <Textarea
                        id="jobOverview"
                        placeholder="Write 2-4 sentences describing the team, main responsibility, and business impact..."
                        value={form.jobOverview}
                        onChange={(e) =>
                          updateForm("jobOverview", e.target.value)
                        }
                        rows={4}
                        className="resize-none"
                        required
                      />
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-slate-400">
                          Example: "Join our backend team to build scalable
                          microservices. You'll design APIs and optimize
                          database performance, directly impacting 1M+ users."
                        </p>
                        <p
                          className={`text-xs ${
                            form.jobOverview.length >= 80
                              ? "text-green-400"
                              : form.jobOverview.length >= 40
                                ? "text-yellow-400"
                                : "text-slate-500"
                          }`}
                        >
                          {form.jobOverview.length}/80 chars
                        </p>
                      </div>
                      {form.jobOverview.length > 0 &&
                        form.jobOverview.length < 80 && (
                          <p className="text-xs text-yellow-400 flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            Job overview should be at least 80 characters for
                            quality AI matching
                          </p>
                        )}
                      {form.jobOverview.length >= 20 &&
                        countLetters(form.jobOverview) < 20 && (
                          <p className="text-xs text-red-400 flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            Please provide meaningful text, not just numbers or
                            symbols
                          </p>
                        )}
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                      <p className="text-sm text-orange-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Responsibilities:</strong> List specific tasks
                          and duties. This will be displayed as bullet points in
                          job detail. Minimum 3 items required.
                        </span>
                      </p>
                    </div>

                    <BulletListInput
                      label="Job Responsibilities"
                      value={form.responsibilities}
                      onChange={(value) =>
                        updateForm("responsibilities", value)
                      }
                      placeholder="e.g. Design and implement RESTful APIs for mobile applications"
                      required
                      minItems={3}
                      helperText="List key responsibilities (minimum 3 items, each 20+ characters)"
                      showExamples={true}
                      exampleItems={[
                        "Design and implement RESTful APIs for mobile applications using Python and Django",
                        "Collaborate with frontend team to integrate backend services with React applications",
                      ]}
                    />

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <Button type="button" onClick={handleNext}>
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Candidate Requirements */}
              {currentStep === 3 && (
                <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-6 h-6 text-primary" />
                      3. Candidate Requirements
                    </CardTitle>
                    <CardDescription>
                      Define required and preferred qualifications for AI skill
                      extraction
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <p className="text-sm text-red-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Required Qualifications:</strong> List only
                          must-have qualifications. These will be used for AI
                          skill extraction and matching. Minimum 3 items needed.
                        </span>
                      </p>
                    </div>

                    <BulletListInput
                      label="Required Qualifications"
                      value={form.requiredQualifications}
                      onChange={(value) =>
                        updateForm("requiredQualifications", value)
                      }
                      placeholder="e.g. 3+ years of Python development experience"
                      required
                      minItems={3}
                      helperText="Core qualifications that candidates must have (minimum 3 items, each 20+ characters)"
                      showExamples={true}
                      exampleItems={[
                        "3+ years of professional experience in Python backend development",
                        "Strong understanding of RESTful API design principles and microservices architecture",
                      ]}
                    />

                    <Separator className="bg-white/10" />

                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <p className="text-sm text-green-300 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Preferred Qualifications:</strong>{" "}
                          Nice-to-have qualifications that give candidates an
                          advantage. These help AI rank candidates better.
                        </span>
                      </p>
                    </div>

                    <BulletListInput
                      label="Preferred Qualifications"
                      value={form.preferredQualifications}
                      onChange={(value) =>
                        updateForm("preferredQualifications", value)
                      }
                      placeholder="e.g. Experience with GraphQL and microservices architecture"
                      helperText="Additional qualifications that are beneficial but not required (each 20+ characters)"
                      showExamples={true}
                      exampleItems={[
                        "Experience with GraphQL and microservices architecture patterns",
                        "Familiarity with cloud platforms like AWS or Google Cloud Platform",
                      ]}
                    />

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <Button type="button" onClick={handleNext}>
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Technology Stack */}
              {currentStep === 4 && (
                <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-6 h-6 text-primary" />
                      4. Technology Stack
                    </CardTitle>
                    <CardDescription>
                      Specify technologies for AI matching (Optional but
                      recommended)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-sm text-blue-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Important:</strong> List only technologies
                          that will be actually used in this role. Optionally
                          add proficiency levels and certifications for better
                          candidate matching.
                        </span>
                      </p>
                    </div>

                    <TechnologyStackInput
                      label="Programming Languages"
                      value={form.programmingLanguages}
                      onChange={(value) =>
                        updateForm("programmingLanguages", value)
                      }
                      placeholder="e.g. Python, JavaScript"
                      suggestions={TECH_SUGGESTIONS.languages}
                      helperText="Type and press Enter, or use comma/semicolon to separate"
                    />

                    <TechnologyStackInput
                      label="Frameworks / Libraries"
                      value={form.frameworks}
                      onChange={(value) => updateForm("frameworks", value)}
                      placeholder="e.g. Django, React"
                      suggestions={TECH_SUGGESTIONS.frameworks}
                      helperText="Frameworks and libraries used in the project"
                    />

                    <TechnologyStackInput
                      label="Databases"
                      value={form.databases}
                      onChange={(value) => updateForm("databases", value)}
                      placeholder="e.g. PostgreSQL, Redis"
                      suggestions={TECH_SUGGESTIONS.databases}
                      helperText="Database systems and data stores"
                    />

                    <TechnologyStackInput
                      label="Tools / Platforms"
                      value={form.toolsPlatforms}
                      onChange={(value) => updateForm("toolsPlatforms", value)}
                      placeholder="e.g. Docker, AWS"
                      suggestions={TECH_SUGGESTIONS.tools}
                      helperText="Development tools, cloud platforms, and DevOps tools"
                    />

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <Button type="button" onClick={handleNext}>
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 5: Benefits & Perks */}
              {currentStep === 5 && (
                <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-6 h-6 text-primary" />
                      5. Benefits & Perks
                    </CardTitle>
                    <CardDescription>
                      Select benefits to display as chips in job detail
                      (Required)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <p className="text-sm text-green-300 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Tip:</strong> Jobs with detailed benefits
                          receive 40% more applications. Select predefined
                          benefits or add custom ones. These will be displayed
                          as chips in job detail.
                        </span>
                      </p>
                    </div>

                    <BenefitsMultiSelect
                      value={form.benefits}
                      customBenefits={form.customBenefits}
                      onChange={(value) => updateForm("benefits", value)}
                      onCustomChange={(value) =>
                        updateForm("customBenefits", value)
                      }
                      required
                    />

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <Button type="button" onClick={handleNext}>
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 6: Application Information */}
              {currentStep === 6 && (
                <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-6 h-6 text-primary" />
                      6. Application Information
                    </CardTitle>
                    <CardDescription>
                      Configure how candidates can apply
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="applicationDeadline">
                          Application Deadline{" "}
                          <span className="text-red-400">*</span>
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="applicationDeadline"
                            type="date"
                            value={form.applicationDeadline}
                            onChange={(e) =>
                              updateForm("applicationDeadline", e.target.value)
                            }
                            className="pl-10"
                            required
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="numberOfHires">Number of Hires</Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="numberOfHires"
                            type="number"
                            min="1"
                            value={form.numberOfHires}
                            onChange={(e) =>
                              updateForm("numberOfHires", e.target.value)
                            }
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="space-y-4">
                      <Label>
                        Application Method{" "}
                        <span className="text-red-400">*</span>
                      </Label>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => updateForm("applyMethod", "platform")}
                          className={`
                        p-4 rounded-lg border-2 transition-all text-left
                        ${
                          form.applyMethod === "platform"
                            ? "border-primary bg-primary/10"
                            : "border-white/10 hover:border-white/20"
                        }
                      `}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-white">
                              Platform
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            Candidates apply through our platform
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateForm("applyMethod", "email")}
                          className={`
                        p-4 rounded-lg border-2 transition-all text-left
                        ${
                          form.applyMethod === "email"
                            ? "border-primary bg-primary/10"
                            : "border-white/10 hover:border-white/20"
                        }
                      `}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Send className="w-5 h-5 text-blue-400" />
                            <span className="font-semibold text-white">
                              Email
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            Candidates send CV via email
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateForm("applyMethod", "link")}
                          className={`
                        p-4 rounded-lg border-2 transition-all text-left
                        ${
                          form.applyMethod === "link"
                            ? "border-primary bg-primary/10"
                            : "border-white/10 hover:border-white/20"
                        }
                      `}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <ArrowRight className="w-5 h-5 text-green-400" />
                            <span className="font-semibold text-white">
                              External Link
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            Redirect to external application page
                          </p>
                        </button>
                      </div>

                      {form.applyMethod === "email" && (
                        <div className="space-y-2">
                          <Label htmlFor="applyEmail">
                            Application Email{" "}
                            <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="applyEmail"
                            type="email"
                            placeholder="hr@company.com"
                            value={form.applyEmail}
                            onChange={(e) =>
                              updateForm("applyEmail", e.target.value)
                            }
                            required
                          />
                        </div>
                      )}

                      {form.applyMethod === "link" && (
                        <div className="space-y-2">
                          <Label htmlFor="applyLink">
                            Application Link{" "}
                            <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="applyLink"
                            type="url"
                            placeholder="https://company.com/careers/apply"
                            value={form.applyLink}
                            onChange={(e) =>
                              updateForm("applyLink", e.target.value)
                            }
                            required
                          />
                        </div>
                      )}
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="space-y-2">
                      <Label>
                        Job Status <span className="text-red-400">*</span>
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            updateForm("jobStatus", "DRAFT" as JobStatus)
                          }
                          className={`
                        p-4 rounded-lg border-2 transition-all text-left
                        ${
                          form.jobStatus === "DRAFT"
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-white/10 hover:border-white/20"
                        }
                      `}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-5 h-5 text-yellow-400" />
                            <span className="font-semibold text-white">
                              Save as Draft
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            Save for later, not visible to candidates
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateForm("jobStatus", "PUBLISHED" as JobStatus)
                          }
                          className={`
                        p-4 rounded-lg border-2 transition-all text-left
                        ${
                          form.jobStatus === "PUBLISHED"
                            ? "border-green-500 bg-green-500/10"
                            : "border-white/10 hover:border-white/20"
                        }
                      `}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span className="font-semibold text-white">
                              Publish Now
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            Make visible to candidates immediately
                          </p>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <Button type="button" onClick={handleNext}>
                        Review & Submit
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 7: Review & Submit */}
              {currentStep === 7 && (
                <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-primary" />
                      7. Review & Submit
                    </CardTitle>
                    <CardDescription>
                      Preview your job posting as it will appear to candidates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Job Header Preview */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        Job Header
                      </h3>
                      <div className="bg-black/30 rounded-lg p-6 border border-white/10 space-y-4">
                        <h4 className="text-3xl font-bold text-white">
                          {form.title || "Job Title"}
                        </h4>
                        <p className="text-xl text-slate-300">
                          {form.company || "Company Name"}
                        </p>

                        {/* Summary Chips */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {form.jobLevel && (
                            <span className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-full font-medium">
                              {form.jobLevel}
                            </span>
                          )}
                          {form.employmentType && (
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full font-medium">
                              {form.employmentType}
                            </span>
                          )}
                          {form.workMode && (
                            <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1.5 rounded-full font-medium">
                              {form.workMode}
                            </span>
                          )}
                          {form.requiredExperience > 0 && (
                            <span className="text-xs bg-orange-500/20 text-orange-300 px-3 py-1.5 rounded-full font-medium">
                              {form.requiredExperience} years exp
                            </span>
                          )}
                          {form.educationLevel &&
                            form.educationLevel !== "NONE" && (
                              <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded-full font-medium">
                                {form.educationLevel}
                              </span>
                            )}
                        </div>

                        {form.location && (
                          <div className="flex items-center gap-2 text-slate-300">
                            <MapPin className="w-4 h-4" />
                            {form.location.city}, {form.location.country}
                          </div>
                        )}

                        {(form.salary.min > 0 || form.salary.max > 0) && (
                          <div className="flex items-center gap-2 text-green-300 font-semibold">
                            <DollarSign className="w-4 h-4" />
                            {form.salary.min > 0 && form.salary.max > 0
                              ? `${form.salary.currency} ${form.salary.min.toLocaleString()} - ${form.salary.max.toLocaleString()}`
                              : form.salary.min > 0
                                ? `From ${form.salary.currency} ${form.salary.min.toLocaleString()}`
                                : `Up to ${form.salary.currency} ${form.salary.max.toLocaleString()}`}
                            {form.salary.negotiable && " (Negotiable)"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Language Requirements Preview */}
                    {form.languageRequirements.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Award className="w-5 h-5 text-primary" />
                          Language Requirements (
                          {form.languageRequirements.length})
                        </h3>
                        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                          <div className="space-y-2">
                            {form.languageRequirements.map((lang, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between text-sm bg-slate-800/50 rounded p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-white font-medium">
                                    {lang.language}
                                  </span>
                                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                                    {lang.proficiency}
                                  </span>
                                </div>
                                {lang.certificate && (
                                  <div className="flex items-center gap-2 text-xs text-blue-300">
                                    <Award className="w-3 h-3" />
                                    <span>
                                      {lang.certificate.type}
                                      {lang.certificate.score &&
                                        `: ${lang.certificate.score}`}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Job Description Preview */}
                    {form.jobOverview && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          Job Description
                        </h3>
                        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {form.jobOverview}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Responsibilities Preview */}
                    {form.responsibilities.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          Responsibilities ({form.responsibilities.length})
                        </h3>
                        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                          <ul className="space-y-2">
                            {form.responsibilities.map((item, i) => (
                              <li
                                key={i}
                                className="text-sm text-white flex items-start gap-2"
                              >
                                <span className="text-primary mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Requirements Preview */}
                    {form.requiredQualifications.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Award className="w-5 h-5 text-primary" />
                          Requirements
                        </h3>
                        <div className="bg-black/30 rounded-lg p-4 border border-white/10 space-y-4">
                          <div>
                            <p className="text-sm text-red-300 font-semibold mb-2">
                              Required ({form.requiredQualifications.length}):
                            </p>
                            <ul className="space-y-1">
                              {form.requiredQualifications.map((item, i) => (
                                <li
                                  key={i}
                                  className="text-sm text-white flex items-start gap-2"
                                >
                                  <span className="text-red-400 mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {form.preferredQualifications.length > 0 && (
                            <div>
                              <p className="text-sm text-green-300 font-semibold mb-2">
                                Preferred ({form.preferredQualifications.length}
                                ):
                              </p>
                              <ul className="space-y-1">
                                {form.preferredQualifications.map((item, i) => (
                                  <li
                                    key={i}
                                    className="text-sm text-white flex items-start gap-2"
                                  >
                                    <span className="text-green-400 mt-1">
                                      •
                                    </span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tech Stack Preview */}
                    {(form.programmingLanguages.length > 0 ||
                      form.frameworks.length > 0) && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Code className="w-5 h-5 text-primary" />
                          Technology Stack
                        </h3>
                        <div className="bg-black/30 rounded-lg p-4 border border-white/10 space-y-3">
                          {form.programmingLanguages.length > 0 && (
                            <div>
                              <p className="text-xs text-slate-400 mb-2">
                                Languages:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {form.programmingLanguages.map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full flex items-center gap-1"
                                  >
                                    {tech.name}
                                    {tech.proficiency && (
                                      <span className="text-blue-400/70">
                                        • {tech.proficiency}
                                      </span>
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {form.frameworks.length > 0 && (
                            <div>
                              <p className="text-xs text-slate-400 mb-2">
                                Frameworks:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {form.frameworks.map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full flex items-center gap-1"
                                  >
                                    {tech.name}
                                    {tech.proficiency && (
                                      <span className="text-purple-400/70">
                                        • {tech.proficiency}
                                      </span>
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {form.databases.length > 0 && (
                            <div>
                              <p className="text-xs text-slate-400 mb-2">
                                Databases:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {form.databases.map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full flex items-center gap-1"
                                  >
                                    {tech.name}
                                    {tech.proficiency && (
                                      <span className="text-green-400/70">
                                        • {tech.proficiency}
                                      </span>
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Benefits Preview */}
                    {(form.benefits.length > 0 ||
                      form.customBenefits.length > 0) && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Gift className="w-5 h-5 text-primary" />
                          Benefits & Perks (
                          {form.benefits.length + form.customBenefits.length})
                        </h3>
                        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                          <div className="flex flex-wrap gap-2">
                            {form.benefits.map((benefitId) => {
                              const benefit = PREDEFINED_BENEFITS.find(
                                (b) => b.id === benefitId,
                              );
                              return benefit ? (
                                <span
                                  key={benefitId}
                                  className="text-sm bg-green-500/20 text-green-300 px-3 py-1.5 rounded-full"
                                >
                                  {benefit.icon} {benefit.label}
                                </span>
                              ) : null;
                            })}
                            {form.customBenefits.map((benefit, i) => (
                              <span
                                key={i}
                                className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full"
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Application Info Preview */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Send className="w-5 h-5 text-primary" />
                        Application Information
                      </h3>
                      <div className="bg-black/30 rounded-lg p-4 border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400">Deadline:</span>
                          <span className="text-white">
                            {form.applicationDeadline || "Not set"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400">Hiring:</span>
                          <span className="text-white">
                            {form.numberOfHires}{" "}
                            {parseInt(form.numberOfHires) === 1
                              ? "person"
                              : "people"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Send className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400">Apply via:</span>
                          <span className="text-white capitalize">
                            {form.applyMethod}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400">Status:</span>
                          <span
                            className={`font-medium ${form.jobStatus === "PUBLISHED" ? "text-green-400" : "text-yellow-400"}`}
                          >
                            {form.jobStatus === "PUBLISHED"
                              ? "Will be published"
                              : "Will be saved as draft"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <p className="text-sm text-green-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          Your job posting is ready! This structured format
                          matches TopCV-style job details and enables:
                          <br />• AI skill extraction from requirements
                          <br />• Advanced search & filtering
                          <br />• Chip-based display for key attributes
                          <br />• Better candidate matching
                        </span>
                      </p>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {form.jobStatus === "PUBLISHED"
                              ? "Publishing..."
                              : "Saving..."}
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {form.jobStatus === "PUBLISHED"
                              ? "Publish Job"
                              : "Save as Draft"}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>

          {/* Sidebar - Quality Score */}
          <div className="lg:col-span-1">
            <QualityScoreCard formData={form} />
          </div>
        </div>
      </div>

      {/* Quality Check Dialog */}
      <QualityCheckDialog
        open={showQualityCheck}
        onOpenChange={setShowQualityCheck}
        formData={form}
        onConfirm={handleConfirmSubmit}
        loading={loading}
      />
    </div>
  );
};

export default PostJob;
