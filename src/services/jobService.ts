// Job Service - Main entry point
// Re-exports from modular services and utilities

// ========================
// TYPE EXPORTS
// ========================
export type {
  JobLevel,
  EmploymentType,
  EducationLevel,
  WorkMode,
  JobStatus,
  LanguageProficiency,
  TechProficiency,
  ApplyMethod,
  LocationDetails,
  Occupation,
  JobRole,
  OccupationMapping,
  Requirements,
  LanguageCertificate,
  LanguageRequirement,
  TechCertificate,
  TechnologyItem,
  TechnologyStack,
  Benefits,
  SalaryRange,
  WorkingTime,
  ApplicationMethod,
  JobMetadata,
  NormalizedJob,
  RawJob,
  JobUpdatePayload,
} from "../types/job";

// ========================
// API EXPORTS
// ========================
export {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from "./jobApi";

// ========================
// NORMALIZATION EXPORTS
// ========================
export {
  normalizeJob,
  normalizeEducationLevel,
} from "../utils/jobNormalizers";

// ========================
// FORMATTER EXPORTS
// ========================
export {
  formatJobLevel,
  formatEmploymentType,
  formatEducationLevel,
  formatWorkMode,
  formatStatus,
  formatExperience,
  formatLocation,
} from "../utils/jobFormatters";

// ========================
// VALIDATION EXPORTS
// ========================
export {
  validateSalaryTyped as validateSalary,
  validateISODate,
  validateDeadline,
  validateApplicationMethodTyped as validateApplicationMethod,
  validateWorkingTime,
  validateExperience,
} from "../utils/jobValidation";
