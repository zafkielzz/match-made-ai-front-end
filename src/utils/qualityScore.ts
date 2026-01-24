// Quality scoring system for job postings

export interface QualityScoreBreakdown {
  score: number; // 0-100
  maxScore: number;
  category: string;
  suggestions: string[];
}

export interface QualityScoreResult {
  totalScore: number; // 0-100
  breakdown: QualityScoreBreakdown[];
  overallSuggestions: string[];
}

const calculateTextRichness = (text: string, minLength: number): number => {
  if (!text) return 0;
  
  const length = text.trim().length;
  const words = text.trim().split(/\s+/).length;
  const uniqueWords = new Set(text.toLowerCase().split(/\s+/)).size;
  
  let score = 0;
  
  // Length score (0-40%)
  if (length >= minLength * 2) score += 40;
  else if (length >= minLength * 1.5) score += 30;
  else if (length >= minLength) score += 20;
  else score += (length / minLength) * 20;
  
  // Word count score (0-30%)
  if (words >= 50) score += 30;
  else if (words >= 30) score += 20;
  else if (words >= 15) score += 10;
  else score += (words / 15) * 10;
  
  // Vocabulary diversity (0-30%)
  const diversity = words > 0 ? uniqueWords / words : 0;
  if (diversity >= 0.7) score += 30;
  else if (diversity >= 0.5) score += 20;
  else score += diversity * 30;
  
  return Math.min(score, 100);
};

export const calculateQualityScore = (formData: any): QualityScoreResult => {
  const breakdown: QualityScoreBreakdown[] = [];
  
  // 1. Basic Information (15 points)
  const basicInfo: QualityScoreBreakdown = {
    score: 0,
    maxScore: 15,
    category: "Basic Information",
    suggestions: []
  };
  
  if (formData.title && formData.title.length >= 10) basicInfo.score += 3;
  else basicInfo.suggestions.push("Add a descriptive job title (10+ characters)");
  
  if (formData.company && formData.company.length >= 2) basicInfo.score += 2;
  else basicInfo.suggestions.push("Add company name");
  
  if (formData.occupation) basicInfo.score += 3;
  else basicInfo.suggestions.push("Select job occupation");
  
  if (formData.jobLevel) basicInfo.score += 2;
  else basicInfo.suggestions.push("Select job level");
  
  if (formData.workMode) basicInfo.score += 2;
  else basicInfo.suggestions.push("Select work mode");
  
  if (formData.location) basicInfo.score += 3;
  else basicInfo.suggestions.push("Add job location");
  
  breakdown.push(basicInfo);
  
  // 2. Job Overview (20 points)
  const overview: QualityScoreBreakdown = {
    score: 0,
    maxScore: 20,
    category: "Job Overview",
    suggestions: []
  };
  
  if (formData.jobOverview) {
    const richnessScore = calculateTextRichness(formData.jobOverview, 80);
    overview.score = (richnessScore / 100) * 20;
    
    if (formData.jobOverview.length < 80) {
      overview.suggestions.push("Job overview is too short (minimum 80 characters recommended)");
    } else if (formData.jobOverview.length < 150) {
      overview.suggestions.push("Consider expanding job overview to 150+ characters for better context");
    }
  } else {
    overview.suggestions.push("Add a comprehensive job overview");
  }
  
  breakdown.push(overview);
  
  // 3. Responsibilities (15 points)
  const responsibilities: QualityScoreBreakdown = {
    score: 0,
    maxScore: 15,
    category: "Responsibilities",
    suggestions: []
  };
  
  const respCount = formData.responsibilities?.length || 0;
  if (respCount >= 5) responsibilities.score = 15;
  else if (respCount >= 3) responsibilities.score = 10;
  else if (respCount >= 1) responsibilities.score = 5;
  else responsibilities.suggestions.push("Add at least 3 responsibilities");
  
  if (respCount > 0 && respCount < 3) {
    responsibilities.suggestions.push(`Add ${3 - respCount} more responsibilities`);
  } else if (respCount >= 3 && respCount < 5) {
    responsibilities.suggestions.push("Consider adding more responsibilities for clarity (5+ recommended)");
  }
  
  breakdown.push(responsibilities);
  
  // 4. Requirements (15 points)
  const requirements: QualityScoreBreakdown = {
    score: 0,
    maxScore: 15,
    category: "Requirements",
    suggestions: []
  };
  
  const reqCount = formData.requiredQualifications?.length || 0;
  const prefCount = formData.preferredQualifications?.length || 0;
  
  if (reqCount >= 5) requirements.score += 10;
  else if (reqCount >= 3) requirements.score += 7;
  else if (reqCount >= 1) requirements.score += 3;
  else requirements.suggestions.push("Add at least 3 required qualifications");
  
  if (prefCount >= 3) requirements.score += 5;
  else if (prefCount >= 1) requirements.score += 2;
  else requirements.suggestions.push("Add preferred qualifications to attract better candidates");
  
  if (reqCount > 0 && reqCount < 3) {
    requirements.suggestions.push(`Add ${3 - reqCount} more required qualifications`);
  }
  
  breakdown.push(requirements);
  
  // 5. Technology Stack (15 points)
  const techStack: QualityScoreBreakdown = {
    score: 0,
    maxScore: 15,
    category: "Technology Stack",
    suggestions: []
  };
  
  const langCount = formData.programmingLanguages?.length || 0;
  const frameworkCount = formData.frameworks?.length || 0;
  const dbCount = formData.databases?.length || 0;
  const toolCount = formData.toolsPlatforms?.length || 0;
  const totalTech = langCount + frameworkCount + dbCount + toolCount;
  
  if (totalTech >= 8) techStack.score = 15;
  else if (totalTech >= 5) techStack.score = 12;
  else if (totalTech >= 3) techStack.score = 8;
  else if (totalTech >= 1) techStack.score = 4;
  else techStack.suggestions.push("Add technology stack for better AI matching");
  
  if (langCount === 0) {
    techStack.suggestions.push("Add programming languages");
  }
  if (frameworkCount === 0 && totalTech < 5) {
    techStack.suggestions.push("Add frameworks/libraries");
  }
  
  breakdown.push(techStack);
  
  // 6. Language Requirements (10 points)
  const languages: QualityScoreBreakdown = {
    score: 0,
    maxScore: 10,
    category: "Language Requirements",
    suggestions: []
  };
  
  const langReqCount = formData.languageRequirements?.length || 0;
  if (langReqCount >= 2) languages.score = 10;
  else if (langReqCount >= 1) languages.score = 7;
  else languages.suggestions.push("Add language requirements");
  
  const withCertificates = formData.languageRequirements?.filter((l: any) => l.certificate).length || 0;
  if (langReqCount > 0 && withCertificates === 0) {
    languages.suggestions.push("Consider adding language certificates for verification");
  }
  
  breakdown.push(languages);
  
  // 7. Compensation & Benefits (10 points)
  const compensation: QualityScoreBreakdown = {
    score: 0,
    maxScore: 10,
    category: "Compensation & Benefits",
    suggestions: []
  };
  
  if (formData.salary && (formData.salary.min > 0 || formData.salary.max > 0 || formData.salary.negotiable)) {
    compensation.score += 5;
  } else {
    compensation.suggestions.push("Add salary information to attract candidates");
  }
  
  const benefitCount = (formData.benefits?.length || 0) + (formData.customBenefits?.length || 0);
  if (benefitCount >= 5) compensation.score += 5;
  else if (benefitCount >= 3) compensation.score += 3;
  else if (benefitCount >= 1) compensation.score += 1;
  else compensation.suggestions.push("Add benefits to make the position more attractive");
  
  breakdown.push(compensation);
  
  // Calculate total score
  const totalScore = breakdown.reduce((sum, item) => sum + item.score, 0);
  const maxTotalScore = breakdown.reduce((sum, item) => sum + item.maxScore, 0);
  const normalizedScore = Math.round((totalScore / maxTotalScore) * 100);
  
  // Overall suggestions
  const overallSuggestions: string[] = [];
  
  if (normalizedScore < 50) {
    overallSuggestions.push("⚠️ Job posting quality is low. Please complete all required sections.");
  } else if (normalizedScore < 70) {
    overallSuggestions.push("📝 Job posting is acceptable but could be improved for better candidate matching.");
  } else if (normalizedScore < 85) {
    overallSuggestions.push("✅ Good job posting! Consider the suggestions below to make it excellent.");
  } else {
    overallSuggestions.push("🌟 Excellent job posting! This will attract high-quality candidates.");
  }
  
  return {
    totalScore: normalizedScore,
    breakdown,
    overallSuggestions
  };
};
