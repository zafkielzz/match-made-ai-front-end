// Payload normalization utilities

// Remove leading numbering/bullets from list items
export const stripListPrefixes = (text: string): string => {
  return text
    .trim()
    .replace(/^[\d]+[\.\)]\s*/, '')  // Remove "1. " or "1) "
    .replace(/^[-•*]\s*/, '')         // Remove "- " or "• " or "* "
    .trim();
};

// Deduplicate array by case-insensitive comparison
export const deduplicateCaseInsensitive = <T extends { name: string }>(
  items: T[]
): T[] => {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = item.name.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Normalize enum values to uppercase
export const normalizeEnum = (value: string | undefined): string | undefined => {
  return value ? value.toUpperCase() : undefined;
};

// Normalize string array: trim, remove empty, dedupe
export const normalizeStringArray = (items: string[]): string[] => {
  const normalized = items
    .map(item => stripListPrefixes(item))
    .filter(item => item.length > 0);
  
  // Dedupe case-insensitively
  const seen = new Set<string>();
  return normalized.filter(item => {
    const key = item.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Normalize technology stack items
export const normalizeTechnologyStack = <T extends { name: string }>(
  items: T[]
): T[] => {
  return deduplicateCaseInsensitive(
    items.map(item => ({
      ...item,
      name: item.name.trim()
    }))
  );
};

// Ensure salary values are numbers
export const normalizeSalary = (salary: any): any => {
  if (!salary) return salary;
  
  return {
    ...salary,
    min: typeof salary.min === 'string' ? parseInt(salary.min, 10) || 0 : salary.min,
    max: typeof salary.max === 'string' ? parseInt(salary.max, 10) || 0 : salary.max,
  };
};

// Normalize entire job form data before submission
export const normalizeJobFormData = (formData: any): any => {
  return {
    ...formData,
    // Trim strings
    title: formData.title?.trim() || '',
    company: formData.company?.trim() || '',
    jobOverview: formData.jobOverview?.trim() || '',
    workingTime: formData.workingTime?.trim() || '',
    applyEmail: formData.applyEmail?.trim() || '',
    applyLink: formData.applyLink?.trim() || '',
    
    // Normalize enums
    jobLevel: normalizeEnum(formData.jobLevel),
    employmentType: normalizeEnum(formData.employmentType),
    workMode: normalizeEnum(formData.workMode),
    educationLevel: normalizeEnum(formData.educationLevel),
    
    // Normalize arrays
    responsibilities: normalizeStringArray(formData.responsibilities || []),
    requiredQualifications: normalizeStringArray(formData.requiredQualifications || []),
    preferredQualifications: normalizeStringArray(formData.preferredQualifications || []),
    customBenefits: normalizeStringArray(formData.customBenefits || []),
    
    // Normalize technology stack
    programmingLanguages: normalizeTechnologyStack(formData.programmingLanguages || []),
    frameworks: normalizeTechnologyStack(formData.frameworks || []),
    databases: normalizeTechnologyStack(formData.databases || []),
    toolsPlatforms: normalizeTechnologyStack(formData.toolsPlatforms || []),
    
    // Normalize salary
    salary: normalizeSalary(formData.salary),
    
    // Language requirements - trim strings
    languageRequirements: (formData.languageRequirements || []).map((req: any) => ({
      ...req,
      language: req.language?.trim() || '',
      languageCode: req.languageCode?.trim() || '',
      proficiency: req.proficiency?.trim() || '',
      certificate: req.certificate ? {
        type: req.certificate.type?.trim() || '',
        score: req.certificate.score?.trim() || ''
      } : undefined
    }))
  };
};
