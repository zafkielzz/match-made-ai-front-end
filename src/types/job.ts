// Job Type Definitions
// Centralized type definitions for job-related data structures

// ========================
// ENUMS (UPPER_SNAKE_CASE)
// ========================
export type JobLevel = "INTERN" | "JUNIOR" | "MID" | "SENIOR" | "LEAD" | "MANAGER";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMP" | "FREELANCE";
export type EducationLevel = "HIGH_SCHOOL" | "ASSOCIATE" | "BACHELOR" | "MASTER" | "PHD" | "NONE";
export type WorkMode = "ONSITE" | "REMOTE" | "HYBRID";
export type JobStatus = "DRAFT" | "PUBLISHED";
export type LanguageProficiency = "BASIC" | "INTERMEDIATE" | "FLUENT" | "NATIVE";
export type TechProficiency = "BASIC" | "INTERMEDIATE" | "ADVANCED";
export type ApplyMethod = "LINK" | "EMAIL" | "PLATFORM";

// ========================
// INTERFACES
// ========================
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
  type: string;
  scoreOrLevel: string;
  customName?: string;
}

export interface LanguageRequirement {
  languageCode: string;
  language: string;
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
  min: number;
  max: number;
  currency: string;
  negotiable: boolean;
  type: "GROSS" | "NET";
}

export interface WorkingTime {
  days: string[];
  start: string;
  end: string;
  timezone: string;
  note?: string;
}

export interface ApplicationMethod {
  method: ApplyMethod;
  email?: string;
  link?: string;
}

export interface JobMetadata {
  createdAt: string;
  updatedAt: string;
}

/**
 * Normalized Job Interface
 * Clean, consistent schema used throughout the app
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
  workingTime?: WorkingTime;
  applicationDeadline: string;
  numberOfHires: number;
  apply: ApplicationMethod;
  jobRole?: JobRole;
  occupationMapping?: OccupationMapping;
  occupation?: Occupation;
  industries?: Array<{
    taxonomy: string;
    version: string;
    code: string;
    label: string;
  }>;
  channelsPlatforms?: string[];
  status: JobStatus;
  metadata: JobMetadata;
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
