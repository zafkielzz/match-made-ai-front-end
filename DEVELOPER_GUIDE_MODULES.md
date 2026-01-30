# Developer Guide: Job Service Modules

## Quick Reference

### When to use which module?

| Task | Import From | Example |
|------|-------------|---------|
| Define job types | `@/types/job` | `import type { NormalizedJob } from "@/types/job"` |
| Fetch jobs from API | `@/services/jobApi` | `import { getJobs } from "@/services/jobApi"` |
| Convert raw API data | `@/utils/jobNormalizers` | `import { normalizeJob } from "@/utils/jobNormalizers"` |
| Display job data | `@/utils/jobFormatters` | `import { formatJobLevel } from "@/utils/jobFormatters"` |
| Validate job data | `@/utils/jobValidation` | `import { validateSalary } from "@/utils/jobValidation"` |
| Use everything | `@/services/jobService` | `import { NormalizedJob, getJobs } from "@/services/jobService"` |

## Module Details

### 1. types/job.ts
**Purpose:** Type definitions only

**Exports:**
- Enums: `JobLevel`, `EmploymentType`, `WorkMode`, `JobStatus`, etc.
- Interfaces: `NormalizedJob`, `RawJob`, `JobUpdatePayload`, etc.

**Usage:**
```typescript
import type { 
  NormalizedJob, 
  JobLevel, 
  SalaryRange 
} from "@/types/job";

const job: NormalizedJob = { /* ... */ };
const level: JobLevel = "SENIOR";
```

### 2. services/jobApi.ts
**Purpose:** HTTP API calls

**Exports:**
- `getJobs()` - Fetch all jobs
- `getJobById(id)` - Fetch single job
- `createJob(payload)` - Create new job
- `updateJob(id, payload)` - Update existing job
- `deleteJob(id)` - Delete job

**Usage:**
```typescript
import { getJobs, createJob } from "@/services/jobApi";

// Fetch all jobs
const jobs = await getJobs();

// Create new job
const newJob = await createJob({
  title: "Senior Developer",
  // ...
});
```

### 3. utils/jobNormalizers.ts
**Purpose:** Data transformation

**Exports:**
- `normalizeJob(rawJob)` - Main normalizer
- `normalizeEducationLevel(level)` - Education normalizer

**Usage:**
```typescript
import { normalizeJob } from "@/utils/jobNormalizers";

const rawData = await fetch("/api/jobs/1").then(r => r.json());
const normalized = normalizeJob(rawData);
```

**Note:** Usually you don't need to call this directly - `jobApi` functions do it automatically.

### 4. utils/jobFormatters.ts
**Purpose:** Display formatting

**Exports:**
- `formatJobLevel(level)` - "SENIOR" → "Senior"
- `formatEmploymentType(type)` - "FULL_TIME" → "Full-time"
- `formatEducationLevel(level)` - "BACHELOR" → "Bachelor's Degree"
- `formatWorkMode(mode)` - "REMOTE" → "Remote"
- `formatStatus(status)` - "PUBLISHED" → "Published"
- `formatExperience(years)` - 5 → "5 years"
- `formatLocation(location)` - { city, country } → "City, Country"

**Usage:**
```typescript
import { formatJobLevel, formatLocation } from "@/utils/jobFormatters";

<div>{formatJobLevel(job.jobLevel)}</div>
<div>{formatLocation(job.locationDetails)}</div>
```

### 5. utils/jobValidation.ts
**Purpose:** Data validation

**Exports:**
- `validateSalary(salary)` - Validate salary range
- `validateDeadline(deadline, status)` - Validate application deadline
- `validateApplicationMethod(apply)` - Validate application method
- `validateWorkingTime(workingTime)` - Validate working hours
- `validateExperience(years)` - Validate experience years
- `validateJobForm(formData)` - Full form validation
- Plus many more...

**Usage:**
```typescript
import { validateSalary, validateDeadline } from "@/utils/jobValidation";

const salaryResult = validateSalary({
  min: 50000,
  max: 80000,
  currency: "USD",
  negotiable: false,
  type: "GROSS"
});

if (!salaryResult.valid) {
  console.error(salaryResult.error);
}
```

### 6. services/jobService.ts
**Purpose:** Backward compatibility & convenience

**Exports:** Everything from all modules

**Usage:**
```typescript
// Import everything from one place
import { 
  NormalizedJob,
  getJobs,
  formatJobLevel,
  validateSalary
} from "@/services/jobService";
```

## Best Practices

### ✅ DO

```typescript
// Import types with 'type' keyword
import type { NormalizedJob } from "@/types/job";

// Import from specific modules for clarity
import { getJobs } from "@/services/jobApi";
import { formatJobLevel } from "@/utils/jobFormatters";

// Use formatters in UI components
<span>{formatJobLevel(job.jobLevel)}</span>

// Validate before submitting
const validation = validateJobForm(formData);
if (!validation.valid) {
  // Handle errors
}
```

### ❌ DON'T

```typescript
// Don't import everything if you only need types
import { NormalizedJob } from "@/services/jobService"; // ❌
import type { NormalizedJob } from "@/types/job";     // ✅

// Don't call normalizeJob manually
const raw = await fetch(...);
const job = normalizeJob(raw); // ❌
const job = await getJobById(id); // ✅ (already normalized)

// Don't display raw enum values
<span>{job.jobLevel}</span> // ❌ Shows "SENIOR"
<span>{formatJobLevel(job.jobLevel)}</span> // ✅ Shows "Senior"
```

## Common Patterns

### Fetching and Displaying Jobs

```typescript
import type { NormalizedJob } from "@/types/job";
import { getJobs } from "@/services/jobApi";
import { formatJobLevel, formatLocation } from "@/utils/jobFormatters";

function JobList() {
  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  
  useEffect(() => {
    getJobs().then(setJobs);
  }, []);
  
  return (
    <div>
      {jobs.map(job => (
        <div key={job.id}>
          <h3>{job.title}</h3>
          <p>{formatJobLevel(job.jobLevel)}</p>
          <p>{formatLocation(job.locationDetails)}</p>
        </div>
      ))}
    </div>
  );
}
```

### Creating a Job with Validation

```typescript
import { createJob } from "@/services/jobApi";
import { validateJobForm } from "@/utils/jobValidation";

async function handleSubmit(formData: any) {
  // Validate first
  const validation = validateJobForm(formData);
  
  if (!validation.valid) {
    // Show errors
    Object.entries(validation.errors).forEach(([field, errors]) => {
      console.error(`${field}:`, errors);
    });
    return;
  }
  
  // Create job
  try {
    const newJob = await createJob(formData);
    console.log("Job created:", newJob);
  } catch (error) {
    console.error("Failed to create job:", error);
  }
}
```

### Updating a Job

```typescript
import { updateJob } from "@/services/jobApi";
import type { JobUpdatePayload } from "@/types/job";

async function handleUpdate(jobId: string, changes: JobUpdatePayload) {
  try {
    const updatedJob = await updateJob(jobId, changes);
    console.log("Job updated:", updatedJob);
  } catch (error) {
    console.error("Failed to update job:", error);
  }
}
```

## Migration Guide

### From Old Code

```typescript
// Old way (still works)
import { 
  NormalizedJob, 
  getJobs, 
  formatJobLevel 
} from "@/services/jobService";
```

### To New Code

```typescript
// New way (recommended)
import type { NormalizedJob } from "@/types/job";
import { getJobs } from "@/services/jobApi";
import { formatJobLevel } from "@/utils/jobFormatters";
```

**Note:** Both ways work! The old way is maintained for backward compatibility.

## Testing

### Testing API Calls

```typescript
import { vi } from 'vitest';
import { getJobs } from '@/services/jobApi';

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ id: 1, title: "Test" }])
  })
);

const jobs = await getJobs();
expect(jobs).toHaveLength(1);
```

### Testing Formatters

```typescript
import { formatJobLevel } from '@/utils/jobFormatters';

expect(formatJobLevel("SENIOR")).toBe("Senior");
expect(formatJobLevel("MID")).toBe("Mid-Level");
```

### Testing Validators

```typescript
import { validateSalary } from '@/utils/jobValidation';

const result = validateSalary({
  min: 100,
  max: 50,
  currency: "USD",
  negotiable: false,
  type: "GROSS"
});

expect(result.valid).toBe(false);
expect(result.error).toContain("greater than maximum");
```

## Questions?

- **Where do I add a new job field?** → `types/job.ts`
- **Where do I add a new API endpoint?** → `services/jobApi.ts`
- **Where do I add a new formatter?** → `utils/jobFormatters.ts`
- **Where do I add a new validator?** → `utils/jobValidation.ts`
- **Where do I add normalization logic?** → `utils/jobNormalizers.ts`
