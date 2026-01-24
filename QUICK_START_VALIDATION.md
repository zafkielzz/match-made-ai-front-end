# Quick Start - Job Posting Validation

## What Was Implemented

A comprehensive validation and quality control system for HR job postings that:
- ✅ Blocks placeholder/gibberish content (e.g., "test123", "qwerty")
- ✅ Shows real-time quality score (0-100) while editing
- ✅ Provides inline validation with clear error messages
- ✅ Displays pre-publish quality check dialog
- ✅ Normalizes all data before submission
- ✅ Includes 27 passing unit tests

## Files Added

```
src/
├── utils/
│   ├── jobValidation.ts          # Validation rules & schemas
│   ├── jobNormalization.ts       # Data normalization
│   └── qualityScore.ts           # Quality scoring (0-100)
├── components/hr/
│   ├── QualityScoreCard.tsx      # Sidebar quality score
│   └── QualityCheckDialog.tsx    # Pre-publish modal
└── test/
    └── jobValidation.test.ts     # Unit tests (27 tests)
```

## How It Works

### 1. Real-Time Validation
As HR fills out the form, validation runs on:
- **Blur**: When leaving a field
- **Submit**: When clicking "Next" or "Submit"

### 2. Quality Score
Sidebar shows live quality score (0-100) with:
- Category breakdown (7 categories)
- Actionable suggestions
- Color-coded feedback

### 3. Publish Gate
Before publishing, a modal shows:
- **Red errors**: Must fix to publish
- **Yellow warnings**: Can proceed anyway
- **Quality summary**: Overall score and tips

### 4. Data Normalization
Before API call, all data is:
- Trimmed (no extra spaces)
- Deduplicated (case-insensitive)
- Normalized (enums uppercase)
- Cleaned (no empty strings)

## Validation Rules Summary

| Field | Rule |
|-------|------|
| Title | 10-120 chars, min 2 letters, no gibberish |
| Overview | 80+ chars, min 20 letters, no placeholders |
| Responsibilities | Min 3 items, each 20+ chars, meaningful text |
| Requirements | Min 3 items, each 20+ chars, meaningful text |
| Tech Stack | No "test"/"asd"/"qwe", deduplicated |
| Deadline | Future date for PUBLISHED (UTC+7) |
| Email/URL | Valid format based on application method |

## Testing

### Run Unit Tests
```bash
cd match-made-ai
npm test -- jobValidation.test.ts
```
**Expected**: All 27 tests pass ✅

### Manual Testing
1. Try entering "test" as job title → Should show error
2. Try adding "1" as responsibility → Should show inline error
3. Fill out complete form → Quality score should be 70+
4. Click submit → Should show quality check dialog
5. Publish → Data should be normalized and submitted

## Common Scenarios

### ❌ Invalid Input (Blocked)
```
Title: "test"
Overview: "qwerty qwerty qwerty..."
Responsibilities: ["1", "2", "3"]
```
**Result**: Multiple errors, cannot publish

### ✅ Valid Input (Accepted)
```
Title: "Senior Backend Developer"
Overview: "Join our backend team to build scalable microservices..."
Responsibilities: [
  "Design and implement RESTful APIs...",
  "Collaborate with frontend team...",
  "Optimize database queries..."
]
```
**Result**: Quality score 85+, can publish

## Key Features

### Gibberish Detection
Blocks:
- Repeated characters: "aaaa", "1111"
- Placeholders: "test", "asd", "qwe", "lorem"
- Keyboard mashing: "qwerty", "asdfgh"
- Numbers-only: "123", "456"

### Quality Score Categories
1. Basic Information (15 pts)
2. Job Overview (20 pts)
3. Responsibilities (15 pts)
4. Requirements (15 pts)
5. Technology Stack (15 pts)
6. Language Requirements (10 pts)
7. Compensation & Benefits (10 pts)

### Inline Feedback
- Character counters (e.g., "80/80 chars")
- Color-coded validation (green/yellow/red)
- Example bullets for guidance
- "Why this matters" hints

## Troubleshooting

**Q: Can't add bullet item**
A: Ensure it's 20+ characters with meaningful text (not just numbers)

**Q: Quality score is low**
A: Check suggestions in sidebar - add more detail to each section

**Q: Can't publish**
A: Fix all red errors in quality check dialog

**Q: Tech stack shows error**
A: Avoid "test", "asd", "qwe" - use actual technology names

## Documentation

- `JOB_POSTING_VALIDATION_IMPLEMENTATION.md` - Complete docs
- `VALIDATION_TESTING_GUIDE.md` - Testing scenarios
- `IMPLEMENTATION_SUMMARY.md` - Technical summary
- `QUICK_START_VALIDATION.md` - This file

## Success Criteria

✅ All 27 unit tests passing
✅ Zero TypeScript errors in validation files
✅ Blocks placeholder content
✅ Shows quality score 0-100
✅ Displays quality check dialog
✅ Normalizes data before submit
✅ Provides clear error messages

## Next Steps

1. **Test manually**: Fill out job posting form
2. **Review quality score**: Check sidebar feedback
3. **Try invalid input**: Test gibberish detection
4. **Publish job**: Verify quality check dialog
5. **Check API payload**: Confirm data is normalized

---

**Implementation Status**: ✅ Complete and tested
**Test Results**: 27/27 passing
**TypeScript Errors**: 0
**Ready for**: Production use
