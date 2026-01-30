/**
 * Enhanced Job Schema for AI CV-to-Job Matching
 * 
 * This schema extends the existing NormalizedJob with additional fields
 * to support embedding, reranking, and explainability features.
 * 
 * All new fields are OPTIONAL with sensible defaults to maintain
 * backward compatibility with existing data.
 */

import type {
  NormalizedJob,
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
  LanguageRequirement,
  TechnologyItem,
  TechnologyStack,
  Benefits,
  SalaryRange,
  WorkingTime,
  ApplicationMethod,
  JobMetadata,
} from "@/services/jobService";

// ========================
// (A) EXTRACTED SKILLS
// ========================

/**
 * Skill extraction source
 * - manual: HR manually entered
 * - rule: Rule-based extraction (regex, keyword matching)
 * - llm: LLM-based extraction (GPT, Claude, etc.)
 */
export type SkillExtractionSource = "manual" | "rule" | "llm";

/**
 * Extracted skills normalized for AI matching
 * 
 * This replaces dependency on technologyStack for matching,
 * allowing more flexible skill representation.
 */
export interface ExtractedSkills {
  /**
   * Core technical skills (e.g., "Python", "React", "PostgreSQL")
   * These are the primary skills required for the job
   */
  core: string[];
  
  /**
   * Tools and platforms (e.g., "Docker", "AWS", "Git", "Jira")
   * These are supporting tools used in the role
   */
  tools: string[];
  
  /**
   * Domain-specific skills (e.g., "Machine Learning", "DevOps", "Frontend")
   * These represent broader skill categories or specializations
   */
  domain: string[];
  
  /**
   * Soft skills (e.g., "Leadership", "Communication", "Problem Solving")
   * These are non-technical skills
   */
  soft: string[];
  
  /**
   * Synonym mapping for skill normalization
   * Maps abbreviations/variations to canonical forms
   * 
   * Example:
   * {
   *   "JS": "JavaScript",
   *   "TS": "TypeScript",
   *   "k8s": "Kubernetes",
   *   "ML": "Machine Learning"
   * }
   */
  synonyms?: Record<string, string>;
  
  /**
   * Extraction source for debugging and pipeline tracking
   */
  source?: SkillExtractionSource;
}

/**
 * Default empty extracted skills
 */
export const DEFAULT_EXTRACTED_SKILLS: ExtractedSkills = {
  core: [],
  tools: [],
  domain: [],
  soft: [],
};

// ========================
// (B) SCORING WEIGHTS
// ========================

/**
 * Scoring weights for different job components
 * 
 * These weights control how much each component contributes
 * to the overall matching score between CV and job.
 * 
 * All weights should be between 0.0 and 1.0
 */
export interface ScoringWeights {
  /**
   * Weight for required qualifications
   * Default: 1.0 (highest priority)
   */
  required: number;
  
  /**
   * Weight for preferred qualifications
   * Default: 0.4 (nice-to-have)
   */
  preferred: number;
  
  /**
   * Weight for technology stack match
   * Default: 0.8 (important but not critical)
   */
  techStack: number;
  
  /**
   * Weight for extracted core skills
   * Default: 1.0 (same as required)
   */
  extractedCore: number;
  
  /**
   * Weight for extracted tools
   * Default: 0.8 (same as techStack)
   */
  extractedTools: number;
}

/**
 * Default scoring weights
 * These are used when scoringWeights is not provided
 */
export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  required: 1.0,
  preferred: 0.4,
  techStack: 0.8,
  extractedCore: 1.0,
  extractedTools: 0.8,
};

// ========================
// (C) EXPERIENCE RANGE
// ========================

/**
 * Enhanced experience representation
 * 
 * Extends minYearsExperience with range support and raw text
 * for better parsing and matching flexibility.
 */
export interface ExperienceRange {
  /**
   * Minimum years of experience
   * Defaults to minYearsExperience if available, else null
   */
  min: number | null;
  
  /**
   * Maximum years of experience (optional)
   * Useful for "2-5 years" ranges
   */
  max: number | null;
  
  /**
   * Raw experience text from job posting
   * Examples:
   * - "2-5 years"
   * - "at least 3 years"
   * - "freshers welcome"
   * - "5+ years in backend development"
   */
  raw: string | null;
  
  /**
   * Seniority signals extracted from text
   * Examples: ["senior", "lead", "5+ years", "manager", "principal"]
   * 
   * These help with fuzzy matching when exact years aren't specified
   */
  senioritySignals: string[];
}

/**
 * Default experience range
 */
export const DEFAULT_EXPERIENCE_RANGE: ExperienceRange = {
  min: null,
  max: null,
  raw: null,
  senioritySignals: [],
};

// ========================
// (D) ENHANCED LANGUAGE REQUIREMENTS
// ========================

/**
 * Enhanced language requirement with required flag
 * 
 * Extends existing LanguageRequirement to distinguish between
 * required and optional languages.
 */
export interface EnhancedLanguageRequirement extends LanguageRequirement {
  /**
   * Whether this language is required (vs. nice-to-have)
   * Default: false
   * 
   * Set to true for:
   * - Languages with certificate requirements
   * - Languages explicitly marked as "required" in job posting
   * - Primary working language
   */
  required: boolean;
}

// ========================
// (E) EXTRACTION METADATA (BONUS)
// ========================

/**
 * Metadata for skill extraction pipeline
 * 
 * Tracks when and how skills were extracted for debugging
 * and pipeline monitoring.
 */
export interface ExtractionMetadata {
  /**
   * ISO timestamp when extraction was performed
   */
  extractedAt: string;
  
  /**
   * Version of the extraction pipeline/model
   * Examples: "rule-v1.0", "gpt-4-2024-01", "claude-3-opus"
   */
  extractorVersion: string;
  
  /**
   * Confidence score (0.0 - 1.0) if available
   */
  confidence?: number;
  
  /**
   * Any errors or warnings during extraction
   */
  errors?: string[];
}

// ========================
// (F) PRECOMPUTED TEXT FOR MATCHING (BONUS)
// ========================

/**
 * Precomputed text for embedding and reranking
 * 
 * This field stores a cleaned, concatenated version of all
 * job text fields for efficient embedding generation.
 * 
 * Format example:
 * "Senior Backend Developer at Tech Corp. Build scalable APIs...
 *  Responsibilities: Design RESTful APIs, Optimize databases...
 *  Requirements: 5+ years Python, PostgreSQL, Docker..."
 */
export type JobTextForMatching = string | null;

// ========================
// ENHANCED JOB SCHEMA
// ========================

/**
 * Enhanced Job interface with AI matching fields
 * 
 * Extends NormalizedJob with additional fields for:
 * - Skill extraction
 * - Scoring weights
 * - Experience ranges
 * - Enhanced language requirements
 * - Extraction metadata
 * - Precomputed matching text
 * 
 * All new fields are OPTIONAL to maintain backward compatibility.
 */
export interface AIEnhancedJob extends Omit<NormalizedJob, 'languageRequirements'> {
  // ========================
  // EXISTING FIELDS (from NormalizedJob)
  // ========================
  id: string | number;
  title: string;
  companyName: string;
  jobLevel: JobLevel;
  employmentType: EmploymentType;
  educationLevel: EducationLevel;
  workMode: WorkMode;
  minYearsExperience: number;  // KEPT for backward compatibility
  locationDetails: LocationDetails;
  jobOverview: string;
  responsibilities: string[];
  requirements: Requirements;
  technologyStack: TechnologyStack;  // KEPT for backward compatibility
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
  
  // ========================
  // NEW FIELDS FOR AI MATCHING
  // ========================
  
  /**
   * (A) Extracted skills for AI matching
   * Replaces dependency on technologyStack
   * 
   * Default: { core: [], tools: [], domain: [], soft: [] }
   */
  extractedSkills?: ExtractedSkills;
  
  /**
   * (B) Scoring weights for matching algorithm
   * Controls contribution of each component to match score
   * 
   * Default: {
   *   required: 1.0,
   *   preferred: 0.4,
   *   techStack: 0.8,
   *   extractedCore: 1.0,
   *   extractedTools: 0.8
   * }
   */
  scoringWeights?: ScoringWeights;
  
  /**
   * (C) Enhanced experience representation
   * Extends minYearsExperience with range and signals
   * 
   * Default: {
   *   min: minYearsExperience,
   *   max: null,
   *   raw: null,
   *   senioritySignals: []
   * }
   */
  experience?: ExperienceRange;
  
  /**
   * (D) Enhanced language requirements with required flag
   * Replaces languageRequirements from NormalizedJob
   * 
   * Default: [] (empty array)
   */
  languageRequirements: EnhancedLanguageRequirement[];
  
  /**
   * (E) Extraction metadata for debugging
   * Tracks when and how skills were extracted
   * 
   * Default: null
   */
  extractionMetadata?: ExtractionMetadata | null;
  
  /**
   * (F) Precomputed text for embedding/reranking
   * Concatenated job text for efficient matching
   * 
   * Default: null
   */
  jobTextForMatching?: JobTextForMatching;
}

// ========================
// MIGRATION HELPERS
// ========================

/**
 * Convert NormalizedJob to AIEnhancedJob
 * 
 * Adds default values for all new fields to ensure
 * backward compatibility with existing data.
 * 
 * @param job - Existing NormalizedJob
 * @returns AIEnhancedJob with defaults for new fields
 */
export function migrateToAIEnhancedJob(job: NormalizedJob): AIEnhancedJob {
  // Convert existing language requirements to enhanced version
  const enhancedLanguageRequirements: EnhancedLanguageRequirement[] = 
    job.languageRequirements.map(req => ({
      ...req,
      required: false,  // Default to optional
    }));
  
  // Create experience range from minYearsExperience
  const experience: ExperienceRange = {
    min: job.minYearsExperience || null,
    max: null,
    raw: null,
    senioritySignals: [],
  };
  
  return {
    ...job,
    languageRequirements: enhancedLanguageRequirements,
    extractedSkills: DEFAULT_EXTRACTED_SKILLS,
    scoringWeights: DEFAULT_SCORING_WEIGHTS,
    experience,
    extractionMetadata: null,
    jobTextForMatching: null,
  };
}

/**
 * Populate experience range from minYearsExperience
 * 
 * Helper to automatically set experience.min from legacy field
 * 
 * @param job - AIEnhancedJob
 * @returns Updated job with experience.min set
 */
export function populateExperienceFromLegacy(job: AIEnhancedJob): AIEnhancedJob {
  if (!job.experience) {
    job.experience = {
      min: job.minYearsExperience || null,
      max: null,
      raw: null,
      senioritySignals: [],
    };
  } else if (job.experience.min === null && job.minYearsExperience) {
    job.experience.min = job.minYearsExperience;
  }
  
  return job;
}

/**
 * Extract seniority signals from job title and overview
 * 
 * Helper to populate senioritySignals from text
 * 
 * @param job - AIEnhancedJob
 * @returns Updated job with senioritySignals populated
 */
export function extractSenioritySignals(job: AIEnhancedJob): AIEnhancedJob {
  const signals: string[] = [];
  const text = `${job.title} ${job.jobOverview}`.toLowerCase();
  
  // Common seniority keywords
  const keywords = [
    'intern', 'junior', 'mid', 'senior', 'lead', 'principal',
    'manager', 'director', 'head', 'chief', 'vp', 'c-level',
    'entry', 'experienced', 'expert', 'architect'
  ];
  
  keywords.forEach(keyword => {
    if (text.includes(keyword)) {
      signals.push(keyword);
    }
  });
  
  // Extract year patterns (e.g., "5+ years", "3-5 years")
  const yearPatterns = text.match(/\d+\+?\s*years?/gi);
  if (yearPatterns) {
    signals.push(...yearPatterns.map(p => p.toLowerCase()));
  }
  
  if (!job.experience) {
    job.experience = DEFAULT_EXPERIENCE_RANGE;
  }
  
  job.experience.senioritySignals = [...new Set(signals)];  // Deduplicate
  
  return job;
}

/**
 * Mark language as required if it has certificate requirement
 * 
 * Helper to automatically set required=true for languages with certificates
 * 
 * @param job - AIEnhancedJob
 * @returns Updated job with language requirements marked
 */
export function markRequiredLanguages(job: AIEnhancedJob): AIEnhancedJob {
  job.languageRequirements = job.languageRequirements.map(req => ({
    ...req,
    // Mark as required if certificate is specified
    required: req.required || !!req.certificate,
  }));
  
  return job;
}

/**
 * Generate precomputed text for matching
 * 
 * Concatenates all relevant job text fields into a single string
 * for efficient embedding generation.
 * 
 * @param job - AIEnhancedJob
 * @returns Precomputed text string
 */
export function generateJobTextForMatching(job: AIEnhancedJob): string {
  const parts: string[] = [];
  
  // Title and company
  parts.push(`${job.title} at ${job.companyName}`);
  
  // Overview
  if (job.jobOverview) {
    parts.push(job.jobOverview);
  }
  
  // Responsibilities
  if (job.responsibilities.length > 0) {
    parts.push('Responsibilities: ' + job.responsibilities.join('. '));
  }
  
  // Requirements
  if (job.requirements.required.length > 0) {
    parts.push('Required: ' + job.requirements.required.join('. '));
  }
  if (job.requirements.preferred.length > 0) {
    parts.push('Preferred: ' + job.requirements.preferred.join('. '));
  }
  
  // Extracted skills (if available)
  if (job.extractedSkills) {
    if (job.extractedSkills.core.length > 0) {
      parts.push('Core skills: ' + job.extractedSkills.core.join(', '));
    }
    if (job.extractedSkills.tools.length > 0) {
      parts.push('Tools: ' + job.extractedSkills.tools.join(', '));
    }
    if (job.extractedSkills.domain.length > 0) {
      parts.push('Domain: ' + job.extractedSkills.domain.join(', '));
    }
  }
  
  // Technology stack (fallback if extractedSkills not available)
  if (!job.extractedSkills || job.extractedSkills.core.length === 0) {
    const techItems: string[] = [];
    job.technologyStack.programmingLanguages.forEach(t => techItems.push(t.name));
    job.technologyStack.frameworks.forEach(t => techItems.push(t.name));
    job.technologyStack.databases.forEach(t => techItems.push(t.name));
    job.technologyStack.toolsPlatforms.forEach(t => techItems.push(t.name));
    
    if (techItems.length > 0) {
      parts.push('Technologies: ' + techItems.join(', '));
    }
  }
  
  // Experience
  if (job.experience?.raw) {
    parts.push('Experience: ' + job.experience.raw);
  } else if (job.minYearsExperience > 0) {
    parts.push(`Experience: ${job.minYearsExperience}+ years`);
  }
  
  // Languages
  if (job.languageRequirements.length > 0) {
    const langs = job.languageRequirements
      .map(l => `${l.language} (${l.proficiency})`)
      .join(', ');
    parts.push('Languages: ' + langs);
  }
  
  return parts.join('. ');
}

// ========================
// TYPE GUARDS
// ========================

/**
 * Check if a job has AI enhancements
 * 
 * @param job - Job object
 * @returns True if job has any AI enhancement fields
 */
export function hasAIEnhancements(job: NormalizedJob | AIEnhancedJob): job is AIEnhancedJob {
  const enhanced = job as AIEnhancedJob;
  return !!(
    enhanced.extractedSkills ||
    enhanced.scoringWeights ||
    enhanced.experience ||
    enhanced.extractionMetadata ||
    enhanced.jobTextForMatching
  );
}

/**
 * Check if extracted skills are populated
 * 
 * @param job - AIEnhancedJob
 * @returns True if any skill category has items
 */
export function hasExtractedSkills(job: AIEnhancedJob): boolean {
  if (!job.extractedSkills) return false;
  
  return (
    job.extractedSkills.core.length > 0 ||
    job.extractedSkills.tools.length > 0 ||
    job.extractedSkills.domain.length > 0 ||
    job.extractedSkills.soft.length > 0
  );
}

// ========================
// VALIDATION
// ========================

/**
 * Validate scoring weights
 * 
 * @param weights - ScoringWeights object
 * @returns Validation result
 */
export function validateScoringWeights(
  weights: Partial<ScoringWeights>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const checkWeight = (name: string, value: number | undefined) => {
    if (value === undefined) return;
    if (value < 0 || value > 1) {
      errors.push(`${name} must be between 0.0 and 1.0, got ${value}`);
    }
  };
  
  checkWeight('required', weights.required);
  checkWeight('preferred', weights.preferred);
  checkWeight('techStack', weights.techStack);
  checkWeight('extractedCore', weights.extractedCore);
  checkWeight('extractedTools', weights.extractedTools);
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate experience range
 * 
 * @param experience - ExperienceRange object
 * @returns Validation result
 */
export function validateExperienceRange(
  experience: Partial<ExperienceRange>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (experience.min !== null && experience.min !== undefined) {
    if (experience.min < 0) {
      errors.push('Minimum experience cannot be negative');
    }
    if (experience.min > 50) {
      errors.push('Minimum experience cannot exceed 50 years');
    }
  }
  
  if (experience.max !== null && experience.max !== undefined) {
    if (experience.max < 0) {
      errors.push('Maximum experience cannot be negative');
    }
    if (experience.max > 50) {
      errors.push('Maximum experience cannot exceed 50 years');
    }
  }
  
  if (
    experience.min !== null && experience.min !== undefined &&
    experience.max !== null && experience.max !== undefined &&
    experience.min > experience.max
  ) {
    errors.push('Minimum experience cannot be greater than maximum');
  }
  
  return { valid: errors.length === 0, errors };
}
