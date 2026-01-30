/**
 * Mock data for AI-Enhanced Job Schema
 * 
 * Examples showing how to populate new AI matching fields
 */

import type { AIEnhancedJob } from "@/types/jobSchemaAI";

/**
 * Example 1: Senior Backend Developer with full AI enhancements
 */
export const mockAIEnhancedJob1: AIEnhancedJob = {
  id: "ai-job-001",
  title: "Senior Backend Developer",
  companyName: "Tech Innovations Inc",
  jobLevel: "SENIOR",
  employmentType: "FULL_TIME",
  educationLevel: "BACHELOR",
  workMode: "HYBRID",
  minYearsExperience: 5,  // Legacy field kept for compatibility
  
  // (C) Enhanced experience with range and signals
  experience: {
    min: 5,
    max: 8,
    raw: "5-8 years of backend development experience",
    senioritySignals: ["senior", "5+ years", "experienced"],
  },
  
  locationDetails: {
    city: "Ho Chi Minh City",
    country: "Vietnam",
    code: "VN-SG",
  },
  
  jobOverview: "Join our backend team to build scalable microservices that power our e-commerce platform serving 10M+ users. You'll work with cutting-edge technologies and collaborate with talented engineers across the globe.",
  
  responsibilities: [
    "Design and implement RESTful APIs and GraphQL endpoints for mobile and web applications",
    "Optimize database queries and implement caching strategies for improved performance",
    "Lead code reviews and mentor junior developers on best practices",
    "Collaborate with DevOps team to improve CI/CD pipelines and deployment processes",
    "Participate in system architecture decisions and technical planning",
  ],
  
  requirements: {
    required: [
      "5+ years of professional experience in Python backend development",
      "Strong understanding of RESTful API design principles and microservices architecture",
      "Experience with PostgreSQL and Redis for data storage and caching",
      "Proficiency in Docker and Kubernetes for containerization",
      "Solid understanding of software design patterns and SOLID principles",
    ],
    preferred: [
      "Experience with GraphQL and Apollo Server",
      "Familiarity with AWS services (EC2, S3, RDS, Lambda)",
      "Knowledge of message queues (RabbitMQ, Kafka)",
      "Experience with monitoring tools (Prometheus, Grafana)",
      "Contributions to open-source projects",
    ],
  },
  
  // Legacy technology stack (kept for compatibility)
  technologyStack: {
    programmingLanguages: [
      { name: "Python", proficiency: "ADVANCED" },
      { name: "JavaScript", proficiency: "INTERMEDIATE" },
    ],
    frameworks: [
      { name: "Django", proficiency: "ADVANCED" },
      { name: "FastAPI", proficiency: "INTERMEDIATE" },
    ],
    databases: [
      { name: "PostgreSQL", proficiency: "ADVANCED" },
      { name: "Redis", proficiency: "INTERMEDIATE" },
    ],
    toolsPlatforms: [
      { name: "Docker", proficiency: "ADVANCED" },
      { name: "Kubernetes", proficiency: "INTERMEDIATE" },
      { name: "AWS", proficiency: "INTERMEDIATE" },
    ],
  },
  
  // (A) Extracted skills for AI matching
  extractedSkills: {
    core: [
      "Python",
      "Django",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "RESTful API",
      "GraphQL",
      "Microservices",
    ],
    tools: [
      "Docker",
      "Kubernetes",
      "AWS",
      "Git",
      "CI/CD",
      "RabbitMQ",
      "Kafka",
      "Prometheus",
      "Grafana",
    ],
    domain: [
      "Backend Development",
      "API Design",
      "Database Optimization",
      "System Architecture",
      "E-commerce",
    ],
    soft: [
      "Leadership",
      "Mentoring",
      "Code Review",
      "Collaboration",
      "Problem Solving",
    ],
    synonyms: {
      "k8s": "Kubernetes",
      "DB": "Database",
      "API": "Application Programming Interface",
    },
    source: "llm",
  },
  
  // (B) Scoring weights for matching
  scoringWeights: {
    required: 1.0,
    preferred: 0.4,
    techStack: 0.8,
    extractedCore: 1.0,
    extractedTools: 0.8,
  },
  
  // (D) Enhanced language requirements
  languageRequirements: [
    {
      languageCode: "en",
      language: "English",
      proficiency: "FLUENT",
      required: true,  // Required for international team
      certificate: {
        type: "IELTS",
        scoreOrLevel: "7.0",
      },
    },
    {
      languageCode: "vi",
      language: "Vietnamese",
      proficiency: "NATIVE",
      required: false,  // Nice to have
    },
  ],
  
  benefits: {
    predefined: [
      { id: "health", label: "Health Insurance", icon: "🏥" },
      { id: "dental", label: "Dental Insurance", icon: "🦷" },
      { id: "remote", label: "Remote Work", icon: "🏠" },
      { id: "learning", label: "Learning Budget", icon: "📚" },
    ],
    custom: [
      "Annual company retreat",
      "Stock options",
      "Flexible working hours",
    ],
  },
  
  salary: {
    min: 2000,
    max: 3500,
    currency: "USD",
    negotiable: true,
    type: "GROSS",
  },
  
  workingTime: {
    days: ["MON", "TUE", "WED", "THU", "FRI"],
    start: "09:00",
    end: "18:00",
    timezone: "Asia/Ho_Chi_Minh",
    note: "Flexible hours, core hours 10:00-16:00",
  },
  
  applicationDeadline: "2026-03-31",
  numberOfHires: 2,
  
  apply: {
    method: "PLATFORM",
  },
  
  occupation: {
    taxonomy: "ESCO_OCCUPATION",
    code: "2512",
    label: "Software Developer",
  },
  
  industries: [
    {
      taxonomy: "VSIC_INDUSTRY",
      version: "2018",
      code: "62",
      label: "Computer programming, consultancy and related activities",
    },
  ],
  
  status: "PUBLISHED",
  
  metadata: {
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-01-25T15:30:00Z",
  },
  
  // (E) Extraction metadata
  extractionMetadata: {
    extractedAt: "2026-01-25T15:30:00Z",
    extractorVersion: "gpt-4-2024-01",
    confidence: 0.92,
  },
  
  // (F) Precomputed text for matching
  jobTextForMatching: "Senior Backend Developer at Tech Innovations Inc. Join our backend team to build scalable microservices that power our e-commerce platform serving 10M+ users. Responsibilities: Design and implement RESTful APIs and GraphQL endpoints. Optimize database queries and implement caching strategies. Required: 5+ years Python, PostgreSQL, Redis, Docker, Kubernetes. Core skills: Python, Django, FastAPI, PostgreSQL, Redis, RESTful API, GraphQL, Microservices. Tools: Docker, Kubernetes, AWS, Git, CI/CD. Experience: 5-8 years. Languages: English (FLUENT), Vietnamese (NATIVE).",
};

/**
 * Example 2: Junior Frontend Developer with minimal AI enhancements
 */
export const mockAIEnhancedJob2: AIEnhancedJob = {
  id: "ai-job-002",
  title: "Junior Frontend Developer",
  companyName: "Startup Labs",
  jobLevel: "JUNIOR",
  employmentType: "FULL_TIME",
  educationLevel: "BACHELOR",
  workMode: "ONSITE",
  minYearsExperience: 1,
  
  // Minimal experience (auto-populated from minYearsExperience)
  experience: {
    min: 1,
    max: 2,
    raw: "1-2 years or fresh graduate with strong portfolio",
    senioritySignals: ["junior", "fresh graduate"],
  },
  
  locationDetails: {
    city: "Hanoi",
    country: "Vietnam",
  },
  
  jobOverview: "Looking for a passionate junior frontend developer to join our growing team. You'll work on building modern web applications using React and TypeScript.",
  
  responsibilities: [
    "Develop responsive web interfaces using React and TypeScript",
    "Collaborate with designers to implement pixel-perfect UI components",
    "Write clean, maintainable code following team standards",
  ],
  
  requirements: {
    required: [
      "1+ year of experience with React or similar framework",
      "Good understanding of HTML, CSS, and JavaScript",
      "Familiarity with Git version control",
    ],
    preferred: [
      "Experience with TypeScript",
      "Knowledge of state management (Redux, Zustand)",
      "Understanding of responsive design principles",
    ],
  },
  
  technologyStack: {
    programmingLanguages: [
      { name: "JavaScript", proficiency: "INTERMEDIATE" },
      { name: "TypeScript", proficiency: "BASIC" },
    ],
    frameworks: [
      { name: "React", proficiency: "INTERMEDIATE" },
    ],
    databases: [],
    toolsPlatforms: [
      { name: "Git", proficiency: "BASIC" },
    ],
  },
  
  // Minimal extracted skills (can be populated later by AI)
  extractedSkills: {
    core: ["React", "JavaScript", "TypeScript", "HTML", "CSS"],
    tools: ["Git"],
    domain: ["Frontend Development", "Web Development"],
    soft: ["Collaboration", "Attention to Detail"],
    source: "rule",
  },
  
  // Default scoring weights
  scoringWeights: {
    required: 1.0,
    preferred: 0.4,
    techStack: 0.8,
    extractedCore: 1.0,
    extractedTools: 0.8,
  },
  
  languageRequirements: [
    {
      languageCode: "en",
      language: "English",
      proficiency: "INTERMEDIATE",
      required: false,
    },
    {
      languageCode: "vi",
      language: "Vietnamese",
      proficiency: "NATIVE",
      required: true,
    },
  ],
  
  benefits: {
    predefined: [
      { id: "health", label: "Health Insurance", icon: "🏥" },
      { id: "learning", label: "Learning Budget", icon: "📚" },
    ],
    custom: ["Free lunch", "Team building activities"],
  },
  
  salary: {
    min: 500,
    max: 800,
    currency: "USD",
    negotiable: true,
    type: "GROSS",
  },
  
  applicationDeadline: "2026-02-28",
  numberOfHires: 1,
  
  apply: {
    method: "EMAIL",
    email: "hr@startuplabs.com",
  },
  
  status: "PUBLISHED",
  
  metadata: {
    createdAt: "2026-01-25T09:00:00Z",
    updatedAt: "2026-01-25T09:00:00Z",
  },
  
  // No extraction metadata yet (will be added when AI processes it)
  extractionMetadata: null,
  
  // No precomputed text yet
  jobTextForMatching: null,
};

/**
 * Example 3: Legacy job migrated to AI-enhanced schema
 * Shows how old data looks with default values
 */
export const mockLegacyMigratedJob: AIEnhancedJob = {
  id: "legacy-001",
  title: "Full Stack Developer",
  companyName: "Legacy Corp",
  jobLevel: "MID",
  employmentType: "FULL_TIME",
  educationLevel: "BACHELOR",
  workMode: "REMOTE",
  minYearsExperience: 3,
  
  // Auto-populated from minYearsExperience
  experience: {
    min: 3,
    max: null,
    raw: null,
    senioritySignals: [],
  },
  
  locationDetails: {
    city: "Remote",
    country: "Vietnam",
  },
  
  jobOverview: "We are looking for a full stack developer.",
  
  responsibilities: [
    "Develop web applications",
    "Work with team members",
    "Fix bugs and improve performance",
  ],
  
  requirements: {
    required: [
      "3 years of experience",
      "Knowledge of JavaScript",
      "Experience with databases",
    ],
    preferred: [],
  },
  
  technologyStack: {
    programmingLanguages: [{ name: "JavaScript" }],
    frameworks: [{ name: "React" }, { name: "Node.js" }],
    databases: [{ name: "MongoDB" }],
    toolsPlatforms: [],
  },
  
  // Empty extracted skills (not yet processed)
  extractedSkills: {
    core: [],
    tools: [],
    domain: [],
    soft: [],
  },
  
  // Default scoring weights
  scoringWeights: {
    required: 1.0,
    preferred: 0.4,
    techStack: 0.8,
    extractedCore: 1.0,
    extractedTools: 0.8,
  },
  
  languageRequirements: [
    {
      languageCode: "en",
      language: "English",
      proficiency: "INTERMEDIATE",
      required: false,  // Default
    },
  ],
  
  benefits: {
    predefined: [],
    custom: ["Competitive salary"],
  },
  
  applicationDeadline: "2026-03-01",
  numberOfHires: 1,
  
  apply: {
    method: "PLATFORM",
  },
  
  status: "PUBLISHED",
  
  metadata: {
    createdAt: "2025-12-01T00:00:00Z",
    updatedAt: "2025-12-01T00:00:00Z",
  },
  
  // No AI enhancements yet
  extractionMetadata: null,
  jobTextForMatching: null,
};

/**
 * All mock jobs
 */
export const mockAIEnhancedJobs: AIEnhancedJob[] = [
  mockAIEnhancedJob1,
  mockAIEnhancedJob2,
  mockLegacyMigratedJob,
];
