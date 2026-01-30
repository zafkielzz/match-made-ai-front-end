import { describe, it, expect } from 'vitest';
import type { NormalizedJob } from '@/services/jobService';
import {
  migrateToAIEnhancedJob,
  populateExperienceFromLegacy,
  extractSenioritySignals,
  markRequiredLanguages,
  generateJobTextForMatching,
  hasAIEnhancements,
  hasExtractedSkills,
  validateScoringWeights,
  validateExperienceRange,
  DEFAULT_EXTRACTED_SKILLS,
  DEFAULT_SCORING_WEIGHTS,
  DEFAULT_EXPERIENCE_RANGE,
  type AIEnhancedJob,
  type ExtractedSkills,
  type ScoringWeights,
  type ExperienceRange,
} from '@/types/jobSchemaAI';

describe('AI Job Schema', () => {
  // Sample legacy job for testing
  const sampleLegacyJob: NormalizedJob = {
    id: 'test-001',
    title: 'Senior Backend Developer',
    companyName: 'Test Corp',
    jobLevel: 'SENIOR',
    employmentType: 'FULL_TIME',
    educationLevel: 'BACHELOR',
    workMode: 'HYBRID',
    minYearsExperience: 5,
    languageRequirements: [
      {
        languageCode: 'en',
        language: 'English',
        proficiency: 'FLUENT',
      },
    ],
    locationDetails: {
      city: 'Ho Chi Minh City',
      country: 'Vietnam',
    },
    jobOverview: 'Build scalable backend systems',
    responsibilities: ['Design APIs', 'Optimize databases'],
    requirements: {
      required: ['5+ years Python', 'PostgreSQL experience'],
      preferred: ['AWS knowledge'],
    },
    technologyStack: {
      programmingLanguages: [{ name: 'Python' }],
      frameworks: [{ name: 'Django' }],
      databases: [{ name: 'PostgreSQL' }],
      toolsPlatforms: [{ name: 'Docker' }],
    },
    benefits: {
      predefined: [],
      custom: [],
    },
    applicationDeadline: '2026-03-31',
    numberOfHires: 1,
    apply: {
      method: 'PLATFORM',
    },
    status: 'PUBLISHED',
    metadata: {
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  };

  describe('migrateToAIEnhancedJob', () => {
    it('should add default values for all new fields', () => {
      const enhanced = migrateToAIEnhancedJob(sampleLegacyJob);

      expect(enhanced.extractedSkills).toEqual(DEFAULT_EXTRACTED_SKILLS);
      expect(enhanced.scoringWeights).toEqual(DEFAULT_SCORING_WEIGHTS);
      expect(enhanced.experience?.min).toBe(5);
      expect(enhanced.experience?.max).toBeNull();
      expect(enhanced.extractionMetadata).toBeNull();
      expect(enhanced.jobTextForMatching).toBeNull();
    });

    it('should convert language requirements to enhanced version', () => {
      const enhanced = migrateToAIEnhancedJob(sampleLegacyJob);

      expect(enhanced.languageRequirements[0].required).toBe(false);
      expect(enhanced.languageRequirements[0].languageCode).toBe('en');
    });

    it('should preserve all existing fields', () => {
      const enhanced = migrateToAIEnhancedJob(sampleLegacyJob);

      expect(enhanced.id).toBe(sampleLegacyJob.id);
      expect(enhanced.title).toBe(sampleLegacyJob.title);
      expect(enhanced.minYearsExperience).toBe(5);
      expect(enhanced.technologyStack).toEqual(sampleLegacyJob.technologyStack);
    });
  });

  describe('populateExperienceFromLegacy', () => {
    it('should create experience object from minYearsExperience', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [],
        minYearsExperience: 3,
      };

      const updated = populateExperienceFromLegacy(job);

      expect(updated.experience?.min).toBe(3);
      expect(updated.experience?.max).toBeNull();
      expect(updated.experience?.raw).toBeNull();
      expect(updated.experience?.senioritySignals).toEqual([]);
    });

    it('should not overwrite existing experience.min', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [],
        minYearsExperience: 3,
        experience: {
          min: 5,
          max: 8,
          raw: '5-8 years',
          senioritySignals: [],
        },
      };

      const updated = populateExperienceFromLegacy(job);

      expect(updated.experience?.min).toBe(5); // Should keep existing value
    });

    it('should set experience.min from minYearsExperience if experience.min is null', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [],
        minYearsExperience: 7,
        experience: {
          min: null,
          max: 10,
          raw: 'up to 10 years',
          senioritySignals: [],
        },
      };

      const updated = populateExperienceFromLegacy(job);

      expect(updated.experience?.min).toBe(7);
    });
  });

  describe('extractSenioritySignals', () => {
    it('should extract seniority keywords from title', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [],
        title: 'Senior Backend Developer',
        jobOverview: 'Looking for experienced engineer',
      };

      const updated = extractSenioritySignals(job);

      expect(updated.experience?.senioritySignals).toContain('senior');
      expect(updated.experience?.senioritySignals).toContain('experienced');
    });

    it('should extract year patterns from text', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [],
        title: 'Backend Developer',
        jobOverview: 'Requires 5+ years of experience',
      };

      const updated = extractSenioritySignals(job);

      expect(updated.experience?.senioritySignals).toContain('5+ years');
    });

    it('should deduplicate signals', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [],
        title: 'Senior Senior Developer',
        jobOverview: 'Senior position',
      };

      const updated = extractSenioritySignals(job);

      const seniorCount = updated.experience?.senioritySignals.filter(
        (s) => s === 'senior'
      ).length;
      expect(seniorCount).toBe(1);
    });

    it('should handle multiple seniority levels', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [],
        title: 'Lead Backend Architect',
        jobOverview: 'Principal engineer role',
      };

      const updated = extractSenioritySignals(job);

      expect(updated.experience?.senioritySignals).toContain('lead');
      expect(updated.experience?.senioritySignals).toContain('architect');
      expect(updated.experience?.senioritySignals).toContain('principal');
    });
  });

  describe('markRequiredLanguages', () => {
    it('should mark language as required if certificate exists', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [
          {
            languageCode: 'en',
            language: 'English',
            proficiency: 'FLUENT',
            required: false,
            certificate: {
              type: 'IELTS',
              scoreOrLevel: '7.0',
            },
          },
        ],
      };

      const updated = markRequiredLanguages(job);

      expect(updated.languageRequirements[0].required).toBe(true);
    });

    it('should not change required flag if already true', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [
          {
            languageCode: 'en',
            language: 'English',
            proficiency: 'FLUENT',
            required: true,
          },
        ],
      };

      const updated = markRequiredLanguages(job);

      expect(updated.languageRequirements[0].required).toBe(true);
    });

    it('should keep required=false if no certificate', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [
          {
            languageCode: 'vi',
            language: 'Vietnamese',
            proficiency: 'NATIVE',
            required: false,
          },
        ],
      };

      const updated = markRequiredLanguages(job);

      expect(updated.languageRequirements[0].required).toBe(false);
    });
  });

  describe('generateJobTextForMatching', () => {
    it('should concatenate all relevant job fields', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [
          {
            languageCode: 'en',
            language: 'English',
            proficiency: 'FLUENT',
            required: true,
          },
        ],
        extractedSkills: {
          core: ['Python', 'Django'],
          tools: ['Docker'],
          domain: ['Backend Development'],
          soft: [],
        },
      };

      const text = generateJobTextForMatching(job);

      expect(text).toContain('Senior Backend Developer');
      expect(text).toContain('Test Corp');
      expect(text).toContain('Build scalable backend systems');
      expect(text).toContain('Design APIs');
      expect(text).toContain('5+ years Python');
      expect(text).toContain('Core skills: Python, Django');
      expect(text).toContain('Tools: Docker');
      expect(text).toContain('English (FLUENT)');
    });

    it('should use technologyStack if extractedSkills not available', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [],
        extractedSkills: undefined,
      };

      const text = generateJobTextForMatching(job);

      expect(text).toContain('Technologies: Python, Django, PostgreSQL, Docker');
    });

    it('should include experience.raw if available', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [],
        experience: {
          min: 5,
          max: 8,
          raw: '5-8 years of backend development',
          senioritySignals: [],
        },
      };

      const text = generateJobTextForMatching(job);

      expect(text).toContain('Experience: 5-8 years of backend development');
    });
  });

  describe('hasAIEnhancements', () => {
    it('should return true if job has extractedSkills', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [],
        extractedSkills: {
          core: ['Python'],
          tools: [],
          domain: [],
          soft: [],
        },
      };

      expect(hasAIEnhancements(job)).toBe(true);
    });

    it('should return true if job has scoringWeights', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [],
        scoringWeights: DEFAULT_SCORING_WEIGHTS,
      };

      expect(hasAIEnhancements(job)).toBe(true);
    });

    it('should return false if job has no AI enhancements', () => {
      const job: NormalizedJob = sampleLegacyJob;

      expect(hasAIEnhancements(job)).toBe(false);
    });
  });

  describe('hasExtractedSkills', () => {
    it('should return true if any skill category has items', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [],
        extractedSkills: {
          core: ['Python'],
          tools: [],
          domain: [],
          soft: [],
        },
      };

      expect(hasExtractedSkills(job)).toBe(true);
    });

    it('should return false if all skill categories are empty', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [],
        extractedSkills: {
          core: [],
          tools: [],
          domain: [],
          soft: [],
        },
      };

      expect(hasExtractedSkills(job)).toBe(false);
    });

    it('should return false if extractedSkills is undefined', () => {
      const job: AIEnhancedJob = {
        ...sampleLegacyJob,
        languageRequirements: [],
        extractedSkills: undefined,
      };

      expect(hasExtractedSkills(job)).toBe(false);
    });
  });

  describe('validateScoringWeights', () => {
    it('should accept valid weights', () => {
      const weights: ScoringWeights = {
        required: 1.0,
        preferred: 0.4,
        techStack: 0.8,
        extractedCore: 1.0,
        extractedTools: 0.8,
      };

      const result = validateScoringWeights(weights);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weights < 0', () => {
      const weights: Partial<ScoringWeights> = {
        required: -0.5,
      };

      const result = validateScoringWeights(weights);

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('required');
      expect(result.errors[0]).toContain('0.0 and 1.0');
    });

    it('should reject weights > 1', () => {
      const weights: Partial<ScoringWeights> = {
        preferred: 1.5,
      };

      const result = validateScoringWeights(weights);

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('preferred');
      expect(result.errors[0]).toContain('0.0 and 1.0');
    });

    it('should accept edge values 0 and 1', () => {
      const weights: ScoringWeights = {
        required: 0.0,
        preferred: 1.0,
        techStack: 0.5,
        extractedCore: 0.0,
        extractedTools: 1.0,
      };

      const result = validateScoringWeights(weights);

      expect(result.valid).toBe(true);
    });
  });

  describe('validateExperienceRange', () => {
    it('should accept valid experience range', () => {
      const experience: ExperienceRange = {
        min: 3,
        max: 5,
        raw: '3-5 years',
        senioritySignals: [],
      };

      const result = validateExperienceRange(experience);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject negative min', () => {
      const experience: Partial<ExperienceRange> = {
        min: -1,
      };

      const result = validateExperienceRange(experience);

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Minimum experience cannot be negative');
    });

    it('should reject negative max', () => {
      const experience: Partial<ExperienceRange> = {
        max: -5,
      };

      const result = validateExperienceRange(experience);

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Maximum experience cannot be negative');
    });

    it('should reject min > max', () => {
      const experience: Partial<ExperienceRange> = {
        min: 10,
        max: 5,
      };

      const result = validateExperienceRange(experience);

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Minimum experience cannot be greater than maximum');
    });

    it('should reject experience > 50 years', () => {
      const experience: Partial<ExperienceRange> = {
        min: 60,
      };

      const result = validateExperienceRange(experience);

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('cannot exceed 50 years');
    });

    it('should accept null values', () => {
      const experience: ExperienceRange = {
        min: null,
        max: null,
        raw: 'freshers welcome',
        senioritySignals: [],
      };

      const result = validateExperienceRange(experience);

      expect(result.valid).toBe(true);
    });
  });
});
