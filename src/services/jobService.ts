// Job Service - API calls for job management
// Connects to http://localhost:3000/jobs

// ========================
// NORMALIZED JOB SCHEMA
// ========================

// ========================
// NORMALIZED ENUMS (UPPER_SNAKE_CASE)
// ========================
export type JobLevel = "INTERN" | "JUNIOR" | "MID" | "SENIOR" | "LEAD" | "MANAGER";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMP" | "FREELANCE";
export type EducationLevel = "HIGH_SCHOOL" | "ASSOCIATE" | "BACHELOR" | "MASTER" | "PHD" | "NONE";
export type WorkMode = "ONSITE" | "REMOTE" | "HYBRID";
export type JobStatus = "DRAFT" | "PUBLISHED";
export type LanguageProficiency = "BASIC" | "INTERMEDIATE" | "FLUENT" | "NATIVE";
export type TechProficiency = "BASIC" | "INTERMEDIATE" | "ADVANCED";
export type ApplyMethod = "LINK" | "EMAIL" | "PLATFORM";

export interface LocationDetails {
  city: string;
  country: string;
  code?: string;
}

export interface Occupation {
  taxonomy: string;
  code: string;
  label: string;
}

export interface JobRole {
  taxonomy: "INTERNAL";
  roleId: number;
  code: string;
  label: string;
}

export interface OccupationMapping {
  taxonomy: "ESCO";
  code: string;
  label: string;
}

export interface Requirements {
  required: string[];
  preferred: string[];
}

export interface LanguageCertificate {
  type: string;  // "IELTS", "TOEFL", "JLPT", etc.
  scoreOrLevel: string;  // Renamed from score for clarity
  customName?: string;  // For "Other" certificate type
}

export interface LanguageRequirement {
  languageCode: string;  // ISO 639-1 code (e.g., "en", "de", "ja")
  language: string;  // Display name (e.g., "English", "German", "Japanese")
  proficiency: LanguageProficiency;
  certificate?: LanguageCertificate;
}

export interface TechCertificate {
  name: string;
  level?: string;
}

export interface TechnologyItem {
  name: string;
  proficiency?: TechProficiency;
  certificate?: TechCertificate;
}

export interface TechnologyStack {
  programmingLanguages: TechnologyItem[];
  frameworks: TechnologyItem[];
  databases: TechnologyItem[];
  toolsPlatforms: TechnologyItem[];
}

export interface Benefits {
  predefined: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
  custom: string[];
}

export interface SalaryRange {
  min: number;  // Changed from string to number
  max: number;  // Changed from string to number
  currency: string;
  negotiable: boolean;  // Renamed from isNegotiable
  type: "GROSS" | "NET";  // Renamed from isGross
}

export interface WorkingTime {
  days: string[];  // ["MON", "TUE", "WED", "THU", "FRI"]
  start: string;   // "08:00" (HH:MM format)
  end: string;     // "17:00" (HH:MM format)
  timezone: string; // "Asia/Ho_Chi_Minh" (IANA timezone)
  note?: string;   // Optional free text
}

export interface ApplicationMethod {
  method: ApplyMethod;  // "LINK" | "EMAIL" | "PLATFORM"
  email?: string;       // Required if method = EMAIL
  link?: string;        // Required if method = LINK
}

export interface JobMetadata {
  createdAt: string;
  updatedAt: string;
}

/**
 * Normalized Job Interface
 * This is the clean, consistent schema used throughout the app
 */
export interface NormalizedJob {
  id: string | number;
  title: string;
  companyName: string;
  jobLevel: JobLevel;
  employmentType: EmploymentType;
  educationLevel: EducationLevel;
  workMode: WorkMode;
  minYearsExperience: number;
  languageRequirements: LanguageRequirement[];
  locationDetails: LocationDetails;
  jobOverview: string;
  responsibilities: string[];
  requirements: Requirements;
  technologyStack: TechnologyStack;
  benefits: Benefits;
  salary?: SalaryRange;
  workingTime?: WorkingTime;  // Changed to structured object
  applicationDeadline: string;  // ISO format YYYY-MM-DD
  numberOfHires: number;
  apply: ApplicationMethod;  // Changed from separate fields
  jobRole?: JobRole;  // Internal taxonomy (primary)
  occupationMapping?: OccupationMapping;  // ESCO mapping (optional)
  occupation?: Occupation;  // Legacy support
  industries?: Array<{
    taxonomy: string;
    version: string;
    code: string;
    label: string;
  }>;
  channelsPlatforms?: string[];  // Marketing/social channels (separate from tech tools)
  status: JobStatus;
  metadata: JobMetadata;
  // Legacy fields for backward compatibility (optional)
  applicants?: number;
  pending?: number;
}

/**
 * Raw Job from API (may have inconsistent fields)
 */
export interface RawJob {
  id: string | number;
  [key: string]: any;
}

/**
 * Job Update Payload (normalized fields only)
 */
export interface JobUpdatePayload {
  title?: string;
  companyName?: string;
  jobLevel?: JobLevel;
  employmentType?: EmploymentType;
  workMode?: WorkMode;
  minYearsExperience?: number;
  educationLevel?: string;
  languageRequirements?: LanguageRequirement[];
  locationDetails?: LocationDetails;
  jobOverview?: string;
  responsibilities?: string[];
  requirements?: Requirements;
  technologyStack?: TechnologyStack;
  benefits?: Benefits;
  salary?: SalaryRange;
  workingTime?: string;
  applicationDeadline?: string;
  numberOfHires?: number;
  applyMethod?: string;
  applyEmail?: string;
  applyLink?: string;
  occupation?: Occupation;
  status?: JobStatus;
}

const API_BASE_URL = "http://localhost:3000";

// ========================
// NORMALIZATION HELPERS
// ========================

/**
 * Normalize job level to standard enum
 */
function normalizeJobLevel(level: any): JobLevel {
  if (!level) return "JUNIOR";
  
  const normalized = String(level).toUpperCase().trim();
  
  if (normalized.includes("INTERN")) return "INTERN";
  if (normalized.includes("JUNIOR") || normalized === "JUNIOR") return "JUNIOR";
  if (normalized.includes("MID") || normalized.includes("MIDDLE")) return "MID";
  if (normalized.includes("SENIOR")) return "SENIOR";
  if (normalized.includes("LEAD")) return "LEAD";
  if (normalized.includes("MANAGER") || normalized.includes("DIRECTOR") || normalized.includes("C-LEVEL")) return "MANAGER";
  
  return "JUNIOR"; // Default
}

/**
 * Normalize employment type to standard enum
 */
function normalizeEmploymentType(type: any): EmploymentType {
  if (!type) return "FULL_TIME";
  
  const normalized = String(type).toUpperCase().replace(/[-_\s]/g, "_").trim();
  
  if (normalized.includes("FULL") || normalized === "FULLTIME") return "FULL_TIME";
  if (normalized.includes("PART") || normalized === "PARTTIME") return "PART_TIME";
  if (normalized.includes("CONTRACT")) return "CONTRACT";
  if (normalized.includes("TEMP") || normalized.includes("TEMPORARY")) return "TEMP";
  if (normalized.includes("FREELANCE")) return "FREELANCE";
  
  return "FULL_TIME"; // Default
}

/**
 * Normalize work mode to standard enum
 */
function normalizeWorkMode(mode: any): WorkMode {
  if (!mode) return "ONSITE";
  
  const normalized = String(mode).toUpperCase().trim();
  
  if (normalized.includes("REMOTE")) return "REMOTE";
  if (normalized.includes("HYBRID")) return "HYBRID";
  if (normalized.includes("ONSITE") || normalized.includes("OFFICE")) return "ONSITE";
  
  return "ONSITE"; // Default
}

/**
 * Normalize job status to standard enum
 */
function normalizeStatus(status: any): JobStatus {
  if (!status) return "DRAFT";
  
  const normalized = String(status).toUpperCase().trim();
  
  if (normalized === "PUBLISHED" || normalized === "OPEN") return "PUBLISHED";
  if (normalized === "DRAFT") return "DRAFT";
  
  return "DRAFT"; // Default (removed ARCHIVED)
}

/**
 * Extract years of experience from various formats
 */
function normalizeExperience(exp: any): number {
  if (typeof exp === "number") return exp;
  if (!exp) return 0;
  
  const str = String(exp).toLowerCase();
  
  // Extract first number found
  const match = str.match(/(\d+)/);
  if (match) return parseInt(match[1], 10);
  
  // Handle ranges like "2-5"
  const rangeMatch = str.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) return parseInt(rangeMatch[1], 10); // Use minimum
  
  return 0; // Default
}

/**
 * Normalize location to LocationDetails object
 */
function normalizeLocation(job: any): LocationDetails {
  // If locationDetails exists, use it
  if (job.locationDetails && typeof job.locationDetails === "object") {
    return {
      city: job.locationDetails.city || "",
      country: job.locationDetails.country || "",
      code: job.locationDetails.code,
    };
  }
  
  // Parse flat location string
  if (job.location && typeof job.location === "string") {
    const parts = job.location.split(",").map((s: string) => s.trim());
    return {
      city: parts[0] || "",
      country: parts[1] || "",
    };
  }
  
  return { city: "", country: "" };
}

/**
 * Main normalization function
 * Converts raw API data to clean NormalizedJob schema
 */
export function normalizeJob(rawJob: RawJob): NormalizedJob {
  // Extract company name (remove duplicates)
  const companyName = rawJob.companyName || rawJob.company || "";
  
  // Extract employment type (remove duplicates)
  const employmentType = normalizeEmploymentType(
    rawJob.employmentType || rawJob.jobType || rawJob.type
  );
  
  // Extract status (remove duplicates)
  const status = normalizeStatus(rawJob.status || rawJob.jobStatus);
  
  // Extract location
  const locationDetails = normalizeLocation(rawJob);
  
  // Extract job overview (avoid duplication with description)
  const jobOverview = rawJob.jobOverview || rawJob.description || "";
  
  // Extract responsibilities
  const responsibilities = Array.isArray(rawJob.responsibilities)
    ? rawJob.responsibilities
    : [];
  
  // Extract requirements
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
      // Legacy: split string into array
      requirements.required = rawJob.requirements
        .split("\n")
        .filter((s: string) => s.trim());
    }
  }
  
  // Extract tech stack
  const technologyStack: TechnologyStack = {
    programmingLanguages: [],
    frameworks: [],
    databases: [],
    toolsPlatforms: [],
  };
  
  if (rawJob.technologyStack && typeof rawJob.technologyStack === "object") {
    // Handle both old (string[]) and new (TechnologyItem[]) formats
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
  
  // Extract language requirements
  const languageRequirements: LanguageRequirement[] = [];
  
  if (Array.isArray(rawJob.languageRequirements)) {
    // Ensure each requirement has languageCode
    rawJob.languageRequirements.forEach((req: any) => {
      languageRequirements.push({
        languageCode: req.languageCode || req.language?.toLowerCase().substring(0, 2) || "en",
        language: req.language || "",
        proficiency: req.proficiency || "INTERMEDIATE",
        certificate: req.certificate,
      });
    });
  } else if (rawJob.languageRequirement && typeof rawJob.languageRequirement === "string") {
    // Legacy: parse free-text language requirement
    // e.g., "English - fluent, Vietnamese - native"
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
          
          // Map language name to ISO code (basic mapping)
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
  
  // Extract benefits
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
  
  // Normalize salary (convert strings to numbers)
  let normalizedSalary: SalaryRange | undefined;
  if (rawJob.salary) {
    const min = typeof rawJob.salary.min === "string" ? parseFloat(rawJob.salary.min) || 0 : rawJob.salary.min || 0;
    const max = typeof rawJob.salary.max === "string" ? parseFloat(rawJob.salary.max) || 0 : rawJob.salary.max || 0;
    
    if (min > 0 || max > 0) {
      normalizedSalary = {
        min,
        max,
        currency: rawJob.salary.currency || "USD",
        negotiable: rawJob.salary.negotiable ?? rawJob.salary.isNegotiable ?? false,
        type: rawJob.salary.type || (rawJob.salary.isGross ? "GROSS" : "NET") || "GROSS",
      };
    }
  }

  // Normalize working time
  let normalizedWorkingTime: WorkingTime | undefined;
  if (rawJob.workingTime) {
    if (typeof rawJob.workingTime === "object" && rawJob.workingTime.days) {
      // Already structured
      normalizedWorkingTime = rawJob.workingTime as WorkingTime;
    } else if (typeof rawJob.workingTime === "string" && rawJob.workingTime.trim()) {
      // Legacy: free text - keep as note
      normalizedWorkingTime = {
        days: ["MON", "TUE", "WED", "THU", "FRI"],
        start: "09:00",
        end: "18:00",
        timezone: "Asia/Ho_Chi_Minh",
        note: rawJob.workingTime,
      };
    }
  }

  // Normalize application method
  const normalizedApply: ApplicationMethod = {
    method: (rawJob.apply?.method || rawJob.applyMethod || "PLATFORM").toUpperCase() as ApplyMethod,
    email: rawJob.apply?.email || rawJob.applyEmail,
    link: rawJob.apply?.link || rawJob.applyLink,
  };

  // Extract metadata
  const metadata: JobMetadata = {
    createdAt:
      rawJob.metadata?.createdAt ||
      rawJob.createdAt ||
      new Date().toISOString(),
    updatedAt:
      rawJob.metadata?.updatedAt ||
      rawJob.updatedAt ||
      new Date().toISOString(),
  };
  
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
    languageRequirements,
    locationDetails,
    jobOverview,
    responsibilities,
    requirements,
    technologyStack,
    benefits,
    salary: normalizedSalary,
    workingTime: normalizedWorkingTime,
    applicationDeadline: rawJob.applicationDeadline || "",
    numberOfHires: rawJob.numberOfHires || 1,
    apply: normalizedApply,
    jobRole: rawJob.jobRole,
    occupationMapping: rawJob.occupationMapping,
    occupation: rawJob.occupation,  // Legacy support
    industries: rawJob.industries,
    channelsPlatforms: rawJob.channelsPlatforms,
    status,
    metadata,
    // Legacy fields
    applicants: rawJob.applicants || 0,
    pending: rawJob.pending || 0,
  };
}

/**
 * Fetch all jobs from the API
 */
export async function getJobs(): Promise<NormalizedJob[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Ensure data is an array
    const jobsArray = Array.isArray(data) ? data : [];
    
    // Normalize all jobs
    return jobsArray.map(normalizeJob);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
}

/**
 * Update a job by ID
 * Uses PATCH for partial updates
 */
export async function updateJob(
  id: string | number,
  payload: JobUpdatePayload
): Promise<NormalizedJob> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return normalizeJob(data);
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
}

/**
 * Delete a job by ID
 */
export async function deleteJob(id: string | number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // DELETE may return 204 No Content or 200 with body
    if (response.status !== 204) {
      await response.json();
    }
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
}

/**
 * Get a single job by ID
 */
export async function getJobById(id: string | number): Promise<NormalizedJob> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return normalizeJob(data);
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
}

/**
 * Create a new job
 * Uses POST to create a new job posting
 */
export async function createJob(payload: any): Promise<NormalizedJob> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return normalizeJob(data);
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
}

// ========================
// DISPLAY HELPERS
// ========================

/**
 * Format job level for display
 */
export function formatJobLevel(level: JobLevel): string {
  const map: Record<JobLevel, string> = {
    INTERN: "Intern",
    JUNIOR: "Junior",
    MID: "Mid-Level",
    SENIOR: "Senior",
    LEAD: "Lead",
    MANAGER: "Manager",
  };
  return map[level] || level;
}

/**
 * Format employment type for display
 */
export function formatEmploymentType(type: EmploymentType): string {
  const map: Record<EmploymentType, string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    TEMP: "Temporary",
    FREELANCE: "Freelance",
  };
  return map[type] || type;
}

/**
 * Format education level for display
 */
export function formatEducationLevel(level: EducationLevel): string {
  const map: Record<EducationLevel, string> = {
    HIGH_SCHOOL: "High School",
    ASSOCIATE: "Associate Degree",
    BACHELOR: "Bachelor's Degree",
    MASTER: "Master's Degree",
    PHD: "PhD",
    NONE: "Not Required",
  };
  return map[level] || level;
}

/**
 * Format work mode for display
 */
export function formatWorkMode(mode: WorkMode): string {
  const map: Record<WorkMode, string> = {
    ONSITE: "Onsite",
    REMOTE: "Remote",
    HYBRID: "Hybrid",
  };
  return map[mode] || mode;
}

/**
 * Format status for display
 */
export function formatStatus(status: JobStatus): string {
  const map: Record<JobStatus, string> = {
    DRAFT: "Draft",
    PUBLISHED: "Published",
  };
  return map[status] || status;
}

/**
 * Format experience for display
 */
export function formatExperience(years: number): string {
  if (years === 0) return "No experience required";
  if (years >= 7) return `${years}+ years`;
  return `${years} years`;
}

/**
 * Format location for display
 */
export function formatLocation(location: LocationDetails): string {
  if (!location.city && !location.country) return "Remote";
  if (!location.country) return location.city;
  return `${location.city}, ${location.country}`;
}



// ========================
// VALIDATION UTILITIES
// ========================

/**
 * Validate salary range
 */
export function validateSalary(salary: Partial<SalaryRange>): { valid: boolean; error?: string } {
  if (!salary.min && !salary.max) {
    return { valid: true }; // Optional field
  }

  if (salary.min !== undefined && salary.min < 0) {
    return { valid: false, error: "Minimum salary cannot be negative" };
  }

  if (salary.max !== undefined && salary.max < 0) {
    return { valid: false, error: "Maximum salary cannot be negative" };
  }

  if (salary.min !== undefined && salary.max !== undefined && salary.min > salary.max) {
    return { valid: false, error: "Minimum salary cannot be greater than maximum" };
  }

  const validCurrencies = ["USD", "VND", "EUR", "GBP", "SGD", "THB", "JPY", "CNY"];
  if (salary.currency && !validCurrencies.includes(salary.currency)) {
    return { valid: false, error: "Invalid currency code" };
  }

  return { valid: true };
}

/**
 * Validate ISO date format (YYYY-MM-DD)
 */
export function validateISODate(dateString: string): { valid: boolean; error?: string } {
  if (!dateString) {
    return { valid: false, error: "Date is required" };
  }

  // Check format YYYY-MM-DD
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateString)) {
    return { valid: false, error: "Date must be in YYYY-MM-DD format" };
  }

  // Check if valid date
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { valid: false, error: "Invalid date" };
  }

  return { valid: true };
}

/**
 * Validate application deadline
 */
export function validateDeadline(
  deadline: string,
  status: JobStatus
): { valid: boolean; error?: string } {
  const dateValidation = validateISODate(deadline);
  if (!dateValidation.valid) {
    return dateValidation;
  }

  // If publishing, deadline must be in the future
  if (status === "PUBLISHED") {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (deadlineDate < today) {
      return { valid: false, error: "Deadline must be in the future for published jobs" };
    }
  }

  return { valid: true };
}

/**
 * Validate application method
 */
export function validateApplicationMethod(
  apply: Partial<ApplicationMethod>
): { valid: boolean; error?: string } {
  if (!apply.method) {
    return { valid: false, error: "Application method is required" };
  }

  if (apply.method === "EMAIL") {
    if (!apply.email) {
      return { valid: false, error: "Email is required for email application method" };
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(apply.email)) {
      return { valid: false, error: "Invalid email format" };
    }
  }

  if (apply.method === "LINK") {
    if (!apply.link) {
      return { valid: false, error: "Link is required for link application method" };
    }
    // Basic URL validation
    try {
      new URL(apply.link);
      if (!apply.link.startsWith("http://") && !apply.link.startsWith("https://")) {
        return { valid: false, error: "Link must start with http:// or https://" };
      }
    } catch {
      return { valid: false, error: "Invalid URL format" };
    }
  }

  return { valid: true };
}

/**
 * Validate working time
 */
export function validateWorkingTime(
  workingTime: Partial<WorkingTime>
): { valid: boolean; error?: string } {
  if (!workingTime.days || workingTime.days.length === 0) {
    return { valid: false, error: "At least one working day is required" };
  }

  const validDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const invalidDays = workingTime.days.filter((day) => !validDays.includes(day));
  if (invalidDays.length > 0) {
    return { valid: false, error: `Invalid day codes: ${invalidDays.join(", ")}` };
  }

  // Validate time format HH:MM
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (workingTime.start && !timeRegex.test(workingTime.start)) {
    return { valid: false, error: "Start time must be in HH:MM format (24-hour)" };
  }

  if (workingTime.end && !timeRegex.test(workingTime.end)) {
    return { valid: false, error: "End time must be in HH:MM format (24-hour)" };
  }

  // Validate start < end
  if (workingTime.start && workingTime.end) {
    const [startHour, startMin] = workingTime.start.split(":").map(Number);
    const [endHour, endMin] = workingTime.end.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes >= endMinutes) {
      return { valid: false, error: "Start time must be before end time" };
    }
  }

  return { valid: true };
}

/**
 * Validate experience years
 */
export function validateExperience(years: number): { valid: boolean; error?: string } {
  if (years < 0) {
    return { valid: false, error: "Experience cannot be negative" };
  }

  if (years > 30) {
    return { valid: false, error: "Experience cannot exceed 30 years" };
  }

  return { valid: true };
}

/**
 * Validate education level enum
 */
export function normalizeEducationLevel(level: any): EducationLevel {
  if (!level) return "NONE";
  
  const normalized = String(level).toUpperCase().replace(/[-_\s]/g, "_").trim();
  
  if (normalized.includes("HIGH") || normalized.includes("SCHOOL")) return "HIGH_SCHOOL";
  if (normalized.includes("ASSOCIATE")) return "ASSOCIATE";
  if (normalized.includes("BACHELOR")) return "BACHELOR";
  if (normalized.includes("MASTER")) return "MASTER";
  if (normalized.includes("PHD") || normalized.includes("DOCTOR")) return "PHD";
  if (normalized === "NONE" || normalized === "NOT_REQUIRED") return "NONE";
  
  return "NONE"; // Default
}
