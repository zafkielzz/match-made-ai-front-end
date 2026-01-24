# Job Posting Validation & Quality Control Implementation

## Overview

This implementation adds comprehensive front-end validation, UX guardrails, and payload normalization to the HR "Create Job Post" flow to improve data quality for AI CV-to-Job matching.

## Key Features

### 1. **Form Validation Rules** ✅

All validation is performed client-side without requiring backend taxonomy services.

#### Title Validation
- **Required**: 10-120 characters
- **Must contain**: At least 2 letters
- **Rejects**: Gibberish patterns (e.g., "qwe123", "asdfgh")

#### Company Name Validation
- **Required**: 2-120 characters
- **Trimmed**: Leading/trailing whitespace removed

#### Job Overview Validation
- **Required**: Minimum 80 characters
- **Must contain**: At least 20 letters
- **Rejects**: 
  - Repeated characters (e.g., "aaaa")
  - Placeholder text (e.g., "test", "lorem ipsum")
  - Keyboard mashing (e.g., "qwerty")
  - Excessive repetition (< 50% unique words)

#### Responsibilities & Requirements Validation
- **Minimum items**: 3 required items
- **Item length**: Each item must be at least 20 characters
- **Must contain**: Meaningful text (at least 10 letters per item)
- **Rejects**:
  - Only numbers/symbols (e.g., "1", "123", "---")
  - Placeholder text
  - Gibberish patterns

#### Technology Stack Validation
- **Optional** but recommended
- **Deduplication**: Case-insensitive name matching
- **Rejects**: Common placeholders ("test", "asd", "qwe", "123")
- **Suggestion**: Shows warning if no technologies added

#### Language Requirements Validation
- **languageCode**: Required if language is selected
- **proficiency**: Required
- **certificate**: If provided, both type and score must be present
- **Guidance**: Inline hint that matching prioritizes languages

#### Salary Validation
- **If negotiable = true**: Min/max can be empty
- **If negotiable = false**: 
  - Min must be > 0
  - Max must be >= min
- **Currency**: Required if any salary number entered

#### Application Deadline Validation
- **For PUBLISHED jobs**: Required and must be in future (Asia/Ho_Chi_Minh timezone)
- **For DRAFT jobs**: Optional
- **Timezone handling**: Converts to UTC+7 for validation

#### Application Method Validation
- **If method = "email"**: Valid email required
- **If method = "link"**: Valid URL required (http/https)
- **If method = "platform"**: Both optional

### 2. **Quality Score System** ✅

Real-time quality scoring (0-100) displayed in sidebar while editing.

#### Score Breakdown

| Category | Max Points | Criteria |
|----------|-----------|----------|
| Basic Information | 15 | Title, company, occupation, job level, work mode, location |
| Job Overview | 20 | Length, word count, vocabulary diversity |
| Responsibilities | 15 | Number of items (3+ required, 5+ excellent) |
| Requirements | 15 | Required + preferred qualifications count |
| Technology Stack | 15 | Total tech items across all categories |
| Language Requirements | 10 | Number of languages + certificates |
| Compensation & Benefits | 10 | Salary info + benefits count |

#### Score Interpretation
- **85-100**: 🌟 Excellent - Will attract high-quality candidates
- **70-84**: ✅ Good - Consider suggestions to make it excellent
- **50-69**: 📝 Acceptable - Could be improved for better matching
- **0-49**: ⚠️ Low quality - Please complete all required sections

#### Actionable Suggestions
The quality score card shows specific, actionable suggestions for each category:
- "Add 2 more responsibilities"
- "Job overview too short (minimum 80 characters)"
- "Add programming languages"
- "Consider adding language certificates"

### 3. **Publish Gate (Quality Check Dialog)** ✅

Modal dialog shown before publishing with three sections:

#### Blocking Issues (Must Fix)
- Validation errors that prevent publishing
- Displayed in red with error icon
- Submit button disabled until fixed

#### Warnings (Can Proceed)
- Quality suggestions that don't block publishing
- Displayed in yellow with warning icon
- User can proceed anyway

#### Quality Summary
- Shows overall quality score
- Lists improvement suggestions by category
- Success state when all checks pass

### 4. **Payload Normalization** ✅

All data is normalized before submission:

#### String Normalization
- Trim all strings
- Remove empty strings from arrays
- Strip leading numbering/bullets from list items (e.g., "1. ", "- ", "• ")

#### Array Deduplication
- Case-insensitive deduplication
- Preserves first occurrence

#### Enum Normalization
- Convert to uppercase: `JUNIOR`, `MID`, `SENIOR`, `FULL_TIME`, `ONSITE`, etc.

#### Salary Normalization
- Ensure numbers are integers (not strings)
- Remove salary object if both min/max are 0

#### Technology Stack Normalization
- Deduplicate by case-insensitive name
- Trim all names

### 5. **Enhanced UX** ✅

#### Inline Validation Messages
- Real-time character count for job overview (80/80)
- Color-coded feedback (green/yellow/red)
- Error messages appear under fields immediately
- Input validation on blur and submit

#### Helper Text & Examples
- Responsibilities: 2 example bullets shown
- Requirements: 2 example bullets shown
- "Why this matters" hints near critical fields

#### Visual Feedback
- Quality score updates in real-time
- Progress indicators for multi-step form
- Color-coded validation states
- Sticky sidebar with quality score

## File Structure

```
match-made-ai/
├── src/
│   ├── utils/
│   │   ├── jobValidation.ts          # Core validation logic with Zod schemas
│   │   ├── jobNormalization.ts       # Payload normalization utilities
│   │   └── qualityScore.ts           # Quality scoring algorithm
│   ├── components/hr/
│   │   ├── QualityScoreCard.tsx      # Real-time quality score display
│   │   ├── QualityCheckDialog.tsx    # Pre-publish quality gate modal
│   │   └── BulletListInput.tsx       # Enhanced with inline validation
│   ├── pages/hr/
│   │   └── PostJob.tsx               # Updated with validation integration
│   └── test/
│       └── jobValidation.test.ts     # Unit tests (27 tests, all passing)
```

## Usage

### For HR Users

1. **Fill out the form**: Navigate through 7 steps
2. **Monitor quality score**: Check sidebar for real-time feedback
3. **Review suggestions**: Address any warnings or errors
4. **Submit**: Click "Review & Submit" to see quality check
5. **Publish or save**: Confirm to publish or save as draft

### For Developers

#### Validation Functions

```typescript
import { validateJobForm, validateBulletItem } from '@/utils/jobValidation';

// Validate entire form
const result = validateJobForm(formData);
if (!result.valid) {
  console.log('Errors:', result.errors);
  console.log('Warnings:', result.warnings);
}

// Validate single bullet item
const itemResult = validateBulletItem('Design APIs', 20);
if (!itemResult.valid) {
  console.log('Error:', itemResult.error);
}
```

#### Normalization

```typescript
import { normalizeJobFormData } from '@/utils/jobNormalization';

const normalized = normalizeJobFormData(formData);
// All strings trimmed, arrays deduplicated, enums uppercase
```

#### Quality Score

```typescript
import { calculateQualityScore } from '@/utils/qualityScore';

const score = calculateQualityScore(formData);
console.log('Total:', score.totalScore); // 0-100
console.log('Breakdown:', score.breakdown);
console.log('Suggestions:', score.overallSuggestions);
```

## Testing

### Run Tests

```bash
npm test -- jobValidation.test.ts
```

### Test Coverage

- ✅ Gibberish detection (repeated chars, placeholders, keyboard mashing)
- ✅ Bullet item validation (length, letters, meaningful text)
- ✅ Technology stack validation (placeholder rejection)
- ✅ Application deadline validation (timezone handling)
- ✅ Job title schema (length, letters, gibberish)
- ✅ Job overview schema (length, letters, repetition)

**Result**: 27 tests, all passing ✅

## Validation Heuristics

### Gibberish Detection

The system uses multiple heuristics to detect low-quality input:

1. **Repeated Characters**: `aaaa`, `1111`, `-----`
2. **Common Placeholders**: `test`, `asd`, `qwe`, `lorem`, `123`
3. **Keyboard Mashing**: `qwerty`, `asdfgh`, `12345`
4. **Only Numbers/Symbols**: `123`, `---`, `...`
5. **Low Letter Count**: Less than required threshold
6. **Excessive Repetition**: Less than 50% unique words

### Why These Rules?

These rules prevent HR from submitting:
- Quick test data: "test test test"
- Keyboard mashing: "qwertyuiop"
- Placeholder content: "asd123"
- Numbered lists without content: "1, 2, 3"

This ensures high-quality embeddings for AI matching.

## Constraints & Design Decisions

### No Backend Changes
- All validation is client-side
- No new required fields added to payload
- Optional fields can be safely ignored by backend

### No Taxonomy Dependency
- Does not require backend taxonomy services
- Works with existing occupation/industry search components

### Performance
- Validation runs on blur and submit (not on every keystroke)
- Quality score updates on form change (debounced)
- Minimal re-renders with React state management

### Accessibility
- Error messages use ARIA labels
- Color is not the only indicator (icons + text)
- Keyboard navigation supported
- Screen reader friendly

## Future Enhancements

Potential improvements for future iterations:

1. **AI-Powered Suggestions**: Use LLM to suggest improvements to job descriptions
2. **Duplicate Detection**: Check for similar existing job postings
3. **Skill Extraction Preview**: Show extracted skills before publishing
4. **A/B Testing**: Track which quality scores correlate with more applications
5. **Saved Templates**: Allow HR to save high-quality job templates
6. **Bulk Import**: Validate multiple jobs from CSV/Excel

## Troubleshooting

### Common Issues

**Q: Quality score is low but all fields are filled**
- A: Check the suggestions in the quality score card. You may need to add more detail (e.g., longer overview, more responsibilities)

**Q: Can't publish job - blocking errors**
- A: Review the Quality Check Dialog. Fix all red errors before publishing. Yellow warnings can be ignored.

**Q: Validation rejects valid input**
- A: Ensure text is meaningful (not just numbers/symbols) and meets minimum length requirements

**Q: Technology stack shows placeholder error**
- A: Avoid common test words like "test", "asd", "qwe". Use actual technology names.

## Summary

This implementation provides:
- ✅ Comprehensive front-end validation
- ✅ Real-time quality scoring (0-100)
- ✅ Pre-publish quality gate
- ✅ Payload normalization
- ✅ Enhanced UX with inline feedback
- ✅ 27 passing unit tests
- ✅ Zero TypeScript errors
- ✅ No backend dependencies

The system blocks low-quality submissions while providing clear, actionable feedback to help HR create job postings that enable better AI matching.
