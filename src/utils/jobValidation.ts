import { z } from "zod";

// Heuristic to detect gibberish/placeholder text
export const isGibberish = (text: string): boolean => {
  const trimmed = text.trim();
  
  // Check for repeated characters (e.g., "aaaa", "1111")
  if (/(.)\1{4,}/.test(trimmed)) return true;
  
  // Check for common placeholder patterns
  const placeholderPatterns = [
    /^(test|asd|qwe|zxc|abc|xyz|lorem|ipsum|placeholder|sample|example|demo|temp|tmp)\d*$/i,
    /^\d+$/,  // Only numbers
    /^[^a-zA-Z]+$/,  // No letters at all
    /^[.,;:\-_!?]+$/,  // Only punctuation
  ];
  
  if (placeholderPatterns.some(pattern => pattern.test(trimmed))) return true;
  
  // Check for keyboard mashing (e.g., "asdfgh", "qwerty")
  const keyboardRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890'];
  const lowerText = trimmed.toLowerCase();
  for (const row of keyboardRows) {
    for (let i = 0; i <= row.length - 5; i++) {
      if (lowerText.includes(row.substring(i, i + 5))) return true;
    }
  }
  
  return false;
};

// Count actual letters in text
export const countLetters = (text: string): number => {
  return (text.match(/[a-zA-Z]/g) || []).length;
};

// Validate a single bullet point item
export const validateBulletItem = (item: string, minLength = 20): { valid: boolean; error?: string } => {
  const trimmed = item.trim();
  
  if (trimmed.length < minLength) {
    return { valid: false, error: `Item must be at least ${minLength} characters` };
  }
  
  const letterCount = countLetters(trimmed);
  if (letterCount < 10) {
    return { valid: false, error: "Item must contain meaningful text (at least 10 letters)" };
  }
  
  if (isGibberish(trimmed)) {
    return { valid: false, error: "Please avoid placeholder or gibberish text" };
  }
  
  // Check if it's just a number or symbol
  if (/^[\d\s\-.,;:!?•]+$/.test(trimmed)) {
    return { valid: false, error: "Item cannot be only numbers or symbols" };
  }
  
  return { valid: true };
};

// Zod schema for job title
export const jobTitleSchema = z.string()
  .min(10, "Job title must be at least 10 characters")
  .max(120, "Job title must not exceed 120 characters")
  .refine(
    (val) => countLetters(val) >= 2,
    "Job title must contain at least 2 letters"
  )
  .refine(
    (val) => !isGibberish(val),
    "Please provide a valid job title"
  );

// Zod schema for company name
export const companyNameSchema = z.string()
  .min(2, "Company name must be at least 2 characters")
  .max(120, "Company name must not exceed 120 characters")
  .refine(
    (val) => val.trim().length >= 2,
    "Company name is required"
  );

// Zod schema for job overview
export const jobOverviewSchema = z.string()
  .min(80, "Job overview must be at least 80 characters for quality matching")
  .refine(
    (val) => countLetters(val) >= 20,
    "Job overview must contain at least 20 letters"
  )
  .refine(
    (val) => !isGibberish(val),
    "Please provide a meaningful job overview, not placeholder text"
  )
  .refine(
    (val) => {
      // Check for repeated words (e.g., "test test test")
      const words = val.toLowerCase().split(/\s+/);
      const uniqueWords = new Set(words);
      return uniqueWords.size / words.length > 0.5; // At least 50% unique words
    },
    "Job overview appears to contain too much repetition"
  );

// Validate bullet list items
export const validateBulletList = (
  items: string[],
  minItems: number,
  itemMinLength = 20
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (items.length < minItems) {
    errors.push(`At least ${minItems} items are required`);
  }
  
  items.forEach((item, index) => {
    const result = validateBulletItem(item, itemMinLength);
    if (!result.valid) {
      errors.push(`Item ${index + 1}: ${result.error}`);
    }
  });
  
  return { valid: errors.length === 0, errors };
};

// Technology stack validation
export const validateTechnologyStack = (
  items: { name: string; proficiency?: string }[]
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const invalidNames = ['test', 'asd', 'qwe', 'zxc', '123', 'abc', 'xyz', 'temp', 'demo'];
  
  items.forEach((item, index) => {
    const nameLower = item.name.toLowerCase().trim();
    
    if (invalidNames.includes(nameLower)) {
      errors.push(`Technology ${index + 1}: "${item.name}" appears to be a placeholder`);
    }
    
    if (nameLower.length < 2) {
      errors.push(`Technology ${index + 1}: Name too short`);
    }
    
    if (isGibberish(item.name)) {
      errors.push(`Technology ${index + 1}: "${item.name}" appears to be gibberish`);
    }
  });
  
  return { valid: errors.length === 0, errors };
};

// Language requirements validation
export const validateLanguageRequirements = (
  requirements: Array<{
    language: string;
    languageCode?: string;
    proficiency: string;
    certificate?: { type: string; score?: string };
  }>
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  requirements.forEach((req, index) => {
    if (!req.language || !req.language.trim()) {
      errors.push(`Language ${index + 1}: Language is required`);
    }
    
    if (!req.languageCode || !req.languageCode.trim()) {
      errors.push(`Language ${index + 1}: Language code is required`);
    }
    
    if (!req.proficiency || !req.proficiency.trim()) {
      errors.push(`Language ${index + 1}: Proficiency level is required`);
    }
    
    if (req.certificate) {
      if (!req.certificate.type || !req.certificate.type.trim()) {
        errors.push(`Language ${index + 1}: Certificate type is required when certificate is specified`);
      }
      if (!req.certificate.score || !req.certificate.score.trim()) {
        errors.push(`Language ${index + 1}: Certificate score is required when certificate is specified`);
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
};

// Salary validation
export const validateSalary = (salary: {
  min: number;
  max: number;
  currency: string;
  negotiable: boolean;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!salary.negotiable) {
    if (salary.min <= 0) {
      errors.push("Minimum salary must be greater than 0 when not negotiable");
    }
    if (salary.max <= 0) {
      errors.push("Maximum salary must be greater than 0 when not negotiable");
    }
    if (salary.min > 0 && salary.max > 0 && salary.max < salary.min) {
      errors.push("Maximum salary must be greater than or equal to minimum salary");
    }
  }
  
  if ((salary.min > 0 || salary.max > 0) && !salary.currency) {
    errors.push("Currency is required when salary is specified");
  }
  
  return { valid: errors.length === 0, errors };
};

// Application deadline validation (Asia/Ho_Chi_Minh timezone)
export const validateApplicationDeadline = (
  deadline: string,
  status: string
): { valid: boolean; error?: string } => {
  if (!deadline) {
    if (status === "PUBLISHED") {
      return { valid: false, error: "Application deadline is required for published jobs" };
    }
    return { valid: true }; // OK for drafts
  }
  
  const deadlineDate = new Date(deadline);
  const now = new Date();
  
  // Convert to Asia/Ho_Chi_Minh timezone for comparison
  const hcmOffset = 7 * 60; // UTC+7 in minutes
  const localOffset = now.getTimezoneOffset();
  const offsetDiff = (hcmOffset + localOffset) * 60 * 1000;
  const hcmNow = new Date(now.getTime() + offsetDiff);
  
  if (status === "PUBLISHED" && deadlineDate <= hcmNow) {
    return { valid: false, error: "Application deadline must be in the future (Asia/Ho_Chi_Minh timezone)" };
  }
  
  return { valid: true };
};

// Application method validation
export const validateApplicationMethod = (
  method: string,
  email: string,
  link: string
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (method === "email") {
    if (!email || !email.trim()) {
      errors.push("Email is required when application method is email");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push("Please provide a valid email address");
      }
    }
  }
  
  if (method === "link") {
    if (!link || !link.trim()) {
      errors.push("Link is required when application method is external link");
    } else {
      try {
        new URL(link);
      } catch {
        errors.push("Please provide a valid URL (must start with http:// or https://)");
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
};

// Full form validation
export interface JobFormValidationResult {
  valid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
}

export const validateJobForm = (formData: any): JobFormValidationResult => {
  const errors: Record<string, string[]> = {};
  const warnings: Record<string, string[]> = {};
  
  // Title validation
  try {
    jobTitleSchema.parse(formData.title);
  } catch (err: any) {
    errors.title = err.errors.map((e: any) => e.message);
  }
  
  // Company validation
  try {
    companyNameSchema.parse(formData.company);
  } catch (err: any) {
    errors.company = err.errors.map((e: any) => e.message);
  }
  
  // Job overview validation
  try {
    jobOverviewSchema.parse(formData.jobOverview);
  } catch (err: any) {
    errors.jobOverview = err.errors.map((e: any) => e.message);
  }
  
  // Responsibilities validation
  const respValidation = validateBulletList(formData.responsibilities || [], 3, 20);
  if (!respValidation.valid) {
    errors.responsibilities = respValidation.errors;
  }
  
  // Required qualifications validation
  const reqQualValidation = validateBulletList(formData.requiredQualifications || [], 3, 20);
  if (!reqQualValidation.valid) {
    errors.requiredQualifications = reqQualValidation.errors;
  }
  
  // Preferred qualifications validation (optional but must pass rules if provided)
  if (formData.preferredQualifications && formData.preferredQualifications.length > 0) {
    const prefQualValidation = validateBulletList(formData.preferredQualifications, 0, 20);
    if (!prefQualValidation.valid) {
      errors.preferredQualifications = prefQualValidation.errors;
    }
  }
  
  // Technology stack validation
  const allTech = [
    ...(formData.programmingLanguages || []),
    ...(formData.frameworks || []),
    ...(formData.databases || []),
    ...(formData.toolsPlatforms || [])
  ];
  
  if (allTech.length === 0) {
    warnings.technologyStack = ["Consider adding at least one technology for better candidate matching"];
  } else {
    const techValidation = validateTechnologyStack(allTech);
    if (!techValidation.valid) {
      errors.technologyStack = techValidation.errors;
    }
  }
  
  // Language requirements validation
  if (formData.languageRequirements && formData.languageRequirements.length > 0) {
    const langValidation = validateLanguageRequirements(formData.languageRequirements);
    if (!langValidation.valid) {
      errors.languageRequirements = langValidation.errors;
    }
  }
  
  // Salary validation
  if (formData.salary) {
    const salaryValidation = validateSalary(formData.salary);
    if (!salaryValidation.valid) {
      errors.salary = salaryValidation.errors;
    }
  }
  
  // Deadline validation
  const deadlineValidation = validateApplicationDeadline(
    formData.applicationDeadline,
    formData.jobStatus
  );
  if (!deadlineValidation.valid) {
    errors.applicationDeadline = [deadlineValidation.error!];
  }
  
  // Application method validation
  const appMethodValidation = validateApplicationMethod(
    formData.applyMethod,
    formData.applyEmail,
    formData.applyLink
  );
  if (!appMethodValidation.valid) {
    errors.applicationMethod = appMethodValidation.errors;
  }
  
  // Required fields
  if (!formData.occupation) {
    errors.occupation = ["Job role/occupation is required"];
  }
  
  if (!formData.jobLevel) {
    errors.jobLevel = ["Job level is required"];
  }
  
  if (!formData.workMode) {
    errors.workMode = ["Work mode is required"];
  }
  
  if (!formData.location) {
    errors.location = ["Job location is required"];
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
};
