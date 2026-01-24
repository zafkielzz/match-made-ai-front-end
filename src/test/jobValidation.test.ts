import { describe, it, expect } from 'vitest';
import {
  isGibberish,
  countLetters,
  validateBulletItem,
  validateApplicationDeadline,
  validateTechnologyStack,
  jobTitleSchema,
  jobOverviewSchema,
} from '../utils/jobValidation';

describe('jobValidation', () => {
  describe('isGibberish', () => {
    it('should detect repeated characters', () => {
      expect(isGibberish('aaaaa')).toBe(true);
      expect(isGibberish('11111')).toBe(true);
      expect(isGibberish('-----')).toBe(true);
    });

    it('should detect common placeholders', () => {
      expect(isGibberish('test')).toBe(true);
      expect(isGibberish('test123')).toBe(true);
      expect(isGibberish('asd')).toBe(true);
      expect(isGibberish('qwe')).toBe(true);
      expect(isGibberish('123')).toBe(true);
      expect(isGibberish('lorem')).toBe(true);
    });

    it('should detect keyboard mashing', () => {
      expect(isGibberish('qwerty')).toBe(true);
      expect(isGibberish('asdfgh')).toBe(true);
      expect(isGibberish('12345')).toBe(true);
    });

    it('should allow valid text', () => {
      expect(isGibberish('Senior Backend Developer')).toBe(false);
      expect(isGibberish('Python programming experience')).toBe(false);
      expect(isGibberish('Design and implement APIs')).toBe(false);
    });
  });

  describe('countLetters', () => {
    it('should count only letters', () => {
      expect(countLetters('abc123')).toBe(3);
      expect(countLetters('Hello World!')).toBe(10);
      expect(countLetters('123')).toBe(0);
      expect(countLetters('Test-123')).toBe(4);
    });
  });

  describe('validateBulletItem', () => {
    it('should reject items that are too short', () => {
      const result = validateBulletItem('Short', 20);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 20 characters');
    });

    it('should reject items with too few letters', () => {
      const result = validateBulletItem('123456789012345678901234567890', 20);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('meaningful text');
    });

    it('should reject gibberish', () => {
      const result = validateBulletItem('qwertyuiopasdfghjklzxc', 20);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('placeholder or gibberish');
    });

    it('should reject only numbers or symbols', () => {
      const result = validateBulletItem('1, 2, 3, 4, 5, 6, 7, 8, 9, 10', 20);
      expect(result.valid).toBe(false);
      // The validation catches this as "too few letters" first, which is also correct
      expect(result.error).toMatch(/meaningful text|only numbers or symbols/);
    });

    it('should accept valid items', () => {
      const result = validateBulletItem(
        'Design and implement RESTful APIs for mobile applications',
        20
      );
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('validateTechnologyStack', () => {
    it('should reject placeholder technology names', () => {
      const result = validateTechnologyStack([
        { name: 'test' },
        { name: 'asd' },
        { name: '123' },
      ]);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject gibberish technology names', () => {
      const result = validateTechnologyStack([
        { name: 'qwerty' },
      ]);
      expect(result.valid).toBe(false);
    });

    it('should accept valid technology names', () => {
      const result = validateTechnologyStack([
        { name: 'Python', proficiency: 'Advanced' },
        { name: 'React', proficiency: 'Intermediate' },
        { name: 'PostgreSQL' },
      ]);
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });

  describe('validateApplicationDeadline', () => {
    it('should require deadline for published jobs', () => {
      const result = validateApplicationDeadline('', 'PUBLISHED');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required for published jobs');
    });

    it('should allow empty deadline for drafts', () => {
      const result = validateApplicationDeadline('', 'DRAFT');
      expect(result.valid).toBe(true);
    });

    it('should reject past dates for published jobs', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = validateApplicationDeadline(
        yesterday.toISOString().split('T')[0],
        'PUBLISHED'
      );
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be in the future');
    });

    it('should accept future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = validateApplicationDeadline(
        tomorrow.toISOString().split('T')[0],
        'PUBLISHED'
      );
      expect(result.valid).toBe(true);
    });
  });

  describe('jobTitleSchema', () => {
    it('should reject titles that are too short', () => {
      expect(() => jobTitleSchema.parse('Dev')).toThrow();
    });

    it('should reject titles that are too long', () => {
      const longTitle = 'A'.repeat(121);
      expect(() => jobTitleSchema.parse(longTitle)).toThrow();
    });

    it('should reject titles with too few letters', () => {
      expect(() => jobTitleSchema.parse('123456789012')).toThrow();
    });

    it('should reject gibberish titles', () => {
      expect(() => jobTitleSchema.parse('qwertyuiop')).toThrow();
    });

    it('should accept valid titles', () => {
      expect(jobTitleSchema.parse('Senior Backend Developer')).toBe('Senior Backend Developer');
      expect(jobTitleSchema.parse('Full Stack Engineer')).toBe('Full Stack Engineer');
    });
  });

  describe('jobOverviewSchema', () => {
    it('should reject overviews that are too short', () => {
      expect(() => jobOverviewSchema.parse('Short description')).toThrow();
    });

    it('should reject overviews with too few letters', () => {
      const numericText = '1234567890 '.repeat(10);
      expect(() => jobOverviewSchema.parse(numericText)).toThrow();
    });

    it('should reject gibberish overviews', () => {
      const gibberish = 'qwertyuiop '.repeat(10);
      expect(() => jobOverviewSchema.parse(gibberish)).toThrow();
    });

    it('should reject overviews with too much repetition', () => {
      const repetitive = 'test test test test test test test test test test test test test test test';
      expect(() => jobOverviewSchema.parse(repetitive)).toThrow();
    });

    it('should accept valid overviews', () => {
      const validOverview = 
        'Join our backend team to build scalable microservices. You will design APIs and optimize database performance, directly impacting 1M+ users.';
      expect(jobOverviewSchema.parse(validOverview)).toBe(validOverview);
    });
  });
});
