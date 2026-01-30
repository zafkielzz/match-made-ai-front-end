// Job Display Formatters
// Functions to format job data for UI display

import type {
  JobLevel,
  EmploymentType,
  EducationLevel,
  WorkMode,
  JobStatus,
  LocationDetails,
} from "../types/job";

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
