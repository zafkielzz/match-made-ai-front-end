// Job Data Normalizers
// Converts raw API data to clean, consistent NormalizedJob schema

import type {
  NormalizedJob,
  RawJob,
  JobLevel,
  EmploymentType,
  EducationLevel,
  WorkMode,
  JobStatus,
  LocationDetails,
  Requirements,
  TechnologyStack,
  TechnologyItem,
  LanguageRequirement,
  LanguageProficiency,
  Benefits,
  SalaryRange,
  WorkingTime,
  ApplicationMethod,
  ApplyMethod,
  JobMetadata,
} from "../types/job";

// ========================
// ENUM NORMALIZERS
// ========================

function normalizeJobLevel(level: any): JobLevel {
  if (!level) return "JUNIOR";
  
  const normalized = String(level).toUpperCase().trim();
  
  if (normalized.includes("INTERN")) return "INTERN";
  if (normalized.includes("JUNIOR") || normalized === "JUNIOR") return "JUNIOR";
  if (normalized.includes("MID") || normalized.includes("MIDDLE")) return "MID";
  if (normalized.includes("SENIOR")) return "SENIOR";
  if (normalized.includes("LEAD")) return "LEAD";
  if (normalized.includes("MANAGER") || normalized.includes("DIRECTOR") || normalized.includes("C-LEVEL")) return "MANAGER";
  
  return "JUNIOR";
}

function normalizeEmploymentType(type: any): EmploymentType {
  if (!type) return "FULL_TIME";
  
  const normalized = String(type).toUpperCase().replace(/[-_\s]/g, "_").trim();
  
  if (normalized.includes("FULL") || normalized === "FULLTIME") return "FULL_TIME";
  if (normalized.includes("PART") || normalized === "PARTTIME") return "PART_TIME";
  if (normalized.includes("CONTRACT")) return "CONTRACT";
  if (normalized.includes("TEMP") || normalized.includes("TEMPORARY")) return "TEMP";
  if (normalized.includes("FREELANCE")) return "FREELANCE";
  
  return "FULL_TIME";
}

export function normalizeEducationLevel(level: any): EducationLevel {
  if (!level) return "NONE";
  
  const normalized = String(level).toUpperCase().replace(/[-_\s]/g, "_").trim();
  
  if (normalized.includes("HIGH") || normalized.includes("SCHOOL")) return "HIGH_SCHOOL";
  if (normalized.includes("ASSOCIATE")) return "ASSOCIATE";
  if (normalized.includes("BACHELOR")) return "BACHELOR";
  if (normalized.includes("MASTER")) return "MASTER";
  if (normalized.includes("PHD") || normalized.includes("DOCTOR")) return "PHD";
  if (normalized === "NONE" || normalized === "NOT_REQUIRED") return "NONE";
  
  return "NONE";
}

function normalizeWorkMode(mode: any): WorkMode {
  if (!mode) return "ONSITE";
  
  const normalized = String(mode).toUpperCase().trim();
  
  if (normalized.includes("REMOTE")) return "REMOTE";
  if (normalized.includes("HYBRID")) return "HYBRID";
  if (normalized.includes("ONSITE") || normalized.includes("OFFICE")) return "ONSITE";
  
  return "ONSITE";
}

function normalizeStatus(status: any): JobStatus {
  if (!status) return "DRAFT";
  
  const normalized = String(status).toUpperCase().trim();
  
  if (normalized === "PUBLISHED" || normalized === "OPEN") return "PUBLISHED";
  if (normalized === "DRAFT") return "DRAFT";
  
  return "DRAFT";
}

// ========================
// FIELD NORMALIZERS
// ========================

function normalizeExperience(exp: any): number {
  if (typeof exp === "number") return exp;
  if (!exp) return 0;
  
  const str = String(exp).toLowerCase();
  const match = str.match(/(\d+)/);
  if (match) return parseInt(match[1], 10);
  
  const rangeMatch = str.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) return parseInt(rangeMatch[1], 10);
  
  return 0;
}

function normalizeLocation(job: any): LocationDetails {
  if (job.locationDetails && typeof job.locationDetails === "object") {
    return {
      city: job.locationDetails.city || "",
      country: job.locationDetails.country || "",
      code: job.locationDetails.code,
    };
  }
  
  if (job.location && typeof job.location === "string") {
    const parts = job.location.split(",").map((s: string) => s.trim());
    return {
      city: parts[0] || "",
      country: parts[1] || "",
    };
  }
  
  return { city: "", country: "" };
}

function normalizeRequirements(rawJob: any): Requirements {
  const requirements: Requirements = {
    required: [],
    preferred: [],
  };
  
  if (rawJob.requirements) {
    if (typeof rawJob.requirements === "object" && !Array.isArray(rawJob.requirements)) {
      requirements.required = Array.isArray(rawJob.requirements.required)
        ? rawJob.requirements.required
        : [];
      requirements.preferred = Array.isArray(rawJob.requirements.preferred)
        ? rawJob.requirements.preferred
        : [];
    } else if (typeof rawJob.requirements === "string") {
      requirements.required = rawJob.requirements
        .split("\n")
        .filter((s: string) => s.trim());
    }
  }
  
  return requirements;
}

function normalizeTechnologyStack(rawJob: any): TechnologyStack {
  const technologyStack: TechnologyStack = {
    programmingLanguages: [],
    frameworks: [],
    databases: [],
    toolsPlatforms: [],
  };
  
  if (rawJob.technologyStack && typeof rawJob.technologyStack === "object") {
    const normalizeTechArray = (arr: any[]): TechnologyItem[] => {
      if (!Array.isArray(arr)) return [];
      return arr.map((item) => {
        if (typeof item === "string") {
          return { name: item };
        }
        return item as TechnologyItem;
      });
    };

    technologyStack.programmingLanguages = normalizeTechArray(
      rawJob.technologyStack.programmingLanguages
    );
    technologyStack.frameworks = normalizeTechArray(
      rawJob.technologyStack.frameworks
    );
    technologyStack.databases = normalizeTechArray(
      rawJob.technologyStack.databases
    );
    technologyStack.toolsPlatforms = normalizeTechArray(
      rawJob.technologyStack.toolsPlatforms
    );
  }
  
  return technologyStack;
}

function normalizeLanguageRequirements(rawJob: any): LanguageRequirement[] {
  const languageRequirements: LanguageRequirement[] = [];
  
  if (Array.isArray(rawJob.languageRequirements)) {
    rawJob.languageRequirements.forEach((req: any) => {
      languageRequirements.push({
        languageCode: req.languageCode || req.language?.toLowerCase().substring(0, 2) || "en",
        language: req.language || "",
        proficiency: req.proficiency || "INTERMEDIATE",
        certificate: req.certificate,
      });
    });
  } else if (rawJob.languageRequirement && typeof rawJob.languageRequirement === "string") {
    const parts = rawJob.languageRequirement.split(",");
    parts.forEach((part: string) => {
      const trimmed = part.trim();
      if (trimmed) {
        const match = trimmed.match(/^(.+?)\s*[-–]\s*(.+)$/);
        if (match) {
          const language = match[1].trim();
          const proficiencyText = match[2].trim().toLowerCase();
          
          let proficiency: LanguageProficiency = "INTERMEDIATE";
          if (proficiencyText.includes("native")) proficiency = "NATIVE";
          else if (proficiencyText.includes("fluent")) proficiency = "FLUENT";
          else if (proficiencyText.includes("basic")) proficiency = "BASIC";
          
          const languageCodeMap: Record<string, string> = {
            "english": "en",
            "vietnamese": "vi",
            "japanese": "ja",
            "korean": "ko",
            "chinese": "zh",
            "french": "fr",
            "german": "de",
            "spanish": "es",
          };
          const languageCode = languageCodeMap[language.toLowerCase()] || "en";
          
          languageRequirements.push({ languageCode, language, proficiency });
        }
      }
    });
  }
  
  return languageRequirements;
}

function normalizeBenefits(rawJob: any): Benefits {
  const benefits: Benefits = {
    predefined: [],
    custom: [],
  };
  
  if (rawJob.benefits && typeof rawJob.benefits === "object") {
    benefits.predefined = Array.isArray(rawJob.benefits.predefined)
      ? rawJob.benefits.predefined
      : [];
    benefits.custom = Array.isArray(rawJob.benefits.custom)
      ? rawJob.benefits.custom
      : [];
  }
  
  return benefits;
}

function normalizeSalary(rawJob: any): SalaryRange | undefined {
  if (!rawJob.salary) return undefined;
  
  const min = typeof rawJob.salary.min === "string" ? parseFloat(rawJob.salary.min) || 0 : rawJob.salary.min || 0;
  const max = typeof rawJob.salary.max === "string" ? parseFloat(rawJob.salary.max) || 0 : rawJob.salary.max || 0;
  
  if (min > 0 || max > 0) {
    return {
      min,
      max,
      currency: rawJob.salary.currency || "USD",
      negotiable: rawJob.salary.negotiable ?? rawJob.salary.isNegotiable ?? false,
      type: rawJob.salary.type || (rawJob.salary.isGross ? "GROSS" : "NET") || "GROSS",
    };
  }
  
  return undefined;
}

function normalizeWorkingTime(rawJob: any): WorkingTime | undefined {
  if (!rawJob.workingTime) return undefined;
  
  if (typeof rawJob.workingTime === "object" && rawJob.workingTime.days) {
    return rawJob.workingTime as WorkingTime;
  }
  
  if (typeof rawJob.workingTime === "string" && rawJob.workingTime.trim()) {
    return {
      days: ["MON", "TUE", "WED", "THU", "FRI"],
      start: "09:00",
      end: "18:00",
      timezone: "Asia/Ho_Chi_Minh",
      note: rawJob.workingTime,
    };
  }
  
  return undefined;
}

function normalizeApplicationMethod(rawJob: any): ApplicationMethod {
  return {
    method: (rawJob.apply?.method || rawJob.applyMethod || "PLATFORM").toUpperCase() as ApplyMethod,
    email: rawJob.apply?.email || rawJob.applyEmail,
    link: rawJob.apply?.link || rawJob.applyLink,
  };
}

function normalizeMetadata(rawJob: any): JobMetadata {
  return {
    createdAt:
      rawJob.metadata?.createdAt ||
      rawJob.createdAt ||
      new Date().toISOString(),
    updatedAt:
      rawJob.metadata?.updatedAt ||
      rawJob.updatedAt ||
      new Date().toISOString(),
  };
}

// ========================
// MAIN NORMALIZER
// ========================

export function normalizeJob(rawJob: RawJob): NormalizedJob {
  const companyName = rawJob.companyName || rawJob.company || "";
  const employmentType = normalizeEmploymentType(
    rawJob.employmentType || rawJob.jobType || rawJob.type
  );
  const status = normalizeStatus(rawJob.status || rawJob.jobStatus);
  const locationDetails = normalizeLocation(rawJob);
  const jobOverview = rawJob.jobOverview || rawJob.description || "";
  const responsibilities = Array.isArray(rawJob.responsibilities)
    ? rawJob.responsibilities
    : [];
  
  return {
    id: rawJob.id,
    title: rawJob.title || "",
    companyName,
    jobLevel: normalizeJobLevel(rawJob.jobLevel || rawJob.level),
    employmentType,
    educationLevel: normalizeEducationLevel(rawJob.educationLevel),
    workMode: normalizeWorkMode(rawJob.workMode),
    minYearsExperience: normalizeExperience(
      rawJob.minYearsExperience || rawJob.requiredExperience
    ),
    languageRequirements: normalizeLanguageRequirements(rawJob),
    locationDetails,
    jobOverview,
    responsibilities,
    requirements: normalizeRequirements(rawJob),
    technologyStack: normalizeTechnologyStack(rawJob),
    benefits: normalizeBenefits(rawJob),
    salary: normalizeSalary(rawJob),
    workingTime: normalizeWorkingTime(rawJob),
    applicationDeadline: rawJob.applicationDeadline || "",
    numberOfHires: rawJob.numberOfHires || 1,
    apply: normalizeApplicationMethod(rawJob),
    jobRole: rawJob.jobRole,
    occupationMapping: rawJob.occupationMapping,
    occupation: rawJob.occupation,
    industries: rawJob.industries,
    channelsPlatforms: rawJob.channelsPlatforms,
    status,
    metadata: normalizeMetadata(rawJob),
    applicants: rawJob.applicants || 0,
    pending: rawJob.pending || 0,
  };
}
