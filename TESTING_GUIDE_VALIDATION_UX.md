# Testing Guide - Job Posting Validation + UX Improvements

## Quick Start

### Prerequisites
- Frontend running at `http://localhost:8080`
- Navigate to `/hr/jobs/new` (Post Job page)

---

## Test Suite 1: Experience Input (NEW)

### Test 1.1: Keyboard Entry
1. Go to Step 1: General Information
2. Find "Required Experience (Years)" field
3. Click in the input field
4. Type "5" using keyboard
5. ✅ Value should update to 5
6. ✅ Helper text should show "Minimum 5 years of professional experience required"

### Test 1.2: Stepper Controls
1. Click the "+" button
2. ✅ Value should increment
3. Click the "-" button
4. ✅ Value should decrement
5. Try to go below 0
6. ✅ "-" button should be disabled at 0

### Test 1.3: Quick Presets
1. Click "Entry Level" preset
2. ✅ Value should be 0
3. ✅ Helper text: "No experience required - suitable for entry-level positions"
4. Click "5 years" preset
5. ✅ Value should be 5
6. ✅ Preset button should be highlighted

### Test 1.4: Validation
1. Type "-5" in the input
2. ✅ Error message: "Experience cannot be negative"
3. Type "50"
4. ✅ Error message: "Experience cannot exceed 30 years"
5. Type "7"
6. ✅ No error, value accepted

---

## Test Suite 2: Salary Validation (ENHANCED)

### Test 2.1: Numeric Input
1. Go to Step 1: General Information
2. Find "Salary Range" section
3. Enter min: "1000"
4. Enter max: "2000"
5. ✅ Values should be accepted as numbers
6. ✅ Preview should show formatted salary

### Test 2.2: Min > Max Validation
1. Enter min: "3000"
2. Enter max: "2000"
3. ✅ Red border on min field
4. ✅ Error message: "Minimum cannot be greater than maximum"

### Test 2.3: Negative Values
1. Enter min: "-100"
2. ✅ Error message: "Minimum cannot be negative"
3. Enter max: "-50"
4. ✅ Error message: "Maximum cannot be negative"

### Test 2.4: Currency Selection
1. Select different currencies (USD, VND, EUR, GBP)
2. ✅ Currency symbol should update in preview
3. ✅ Preview should show formatted numbers

### Test 2.5: Negotiable & Type
1. Check "Negotiable" checkbox
2. ✅ Preview should show "(Negotiable)"
3. Check "Gross (before tax)" checkbox
4. ✅ Preview should show "(Gross)"

---

## Test Suite 3: Smart Overview Tags

### Test 3.1: Experience Tag (0 years)
1. Set experience to 0
2. Go to Step 7: Review & Submit
3. ✅ Experience tag should NOT appear
4. ✅ No "0 years exp" chip shown

### Test 3.2: Experience Tag (> 0 years)
1. Set experience to 5
2. Go to Step 7: Review & Submit
3. ✅ Experience tag should appear: "5 years exp"

### Test 3.3: Education Tag (NONE)
1. Set education level to "Not Required"
2. Go to Step 7: Review & Submit
3. ✅ Education tag should NOT appear

### Test 3.4: Education Tag (Set)
1. Set education level to "Bachelor's Degree"
2. Go to Step 7: Review & Submit
3. ✅ Education tag should appear: "BACHELOR"

### Test 3.5: Salary Tag (Empty)
1. Leave salary fields empty (0)
2. Go to Step 7: Review & Submit
3. ✅ Salary section should NOT appear

### Test 3.6: Salary Tag (Set)
1. Set min: 1000, max: 2000
2. Go to Step 7: Review & Submit
3. ✅ Salary should appear: "USD 1,000 - 2,000"

---

## Test Suite 4: Enum Normalization

### Test 4.1: Job Level Dropdown
1. Go to Step 1: General Information
2. Open "Job Level" dropdown
3. ✅ Options should be:
   - Intern
   - Junior (0-2 years)
   - Mid-Level (2-5 years)
   - Senior (5+ years)
   - Lead
   - Manager
4. ✅ "Director / C-Level" should NOT appear

### Test 4.2: Employment Type Dropdown
1. Open "Employment Type" dropdown
2. ✅ Options should be:
   - Full-time
   - Part-time
   - Contract
   - Temporary (NEW)
   - Freelance
3. ✅ "Internship" should NOT appear

### Test 4.3: Education Level Dropdown
1. Open "Education Level" dropdown
2. ✅ Options should be:
   - High School
   - Associate Degree
   - Bachelor's Degree
   - Master's Degree
   - PhD
   - Not Required
3. ✅ All values should be UPPER_SNAKE_CASE internally

---

## Test Suite 5: Language Requirements (ENHANCED)

### Test 5.1: Language Code Auto-Set
1. Go to Step 1: General Information
2. Add a language requirement
3. Select "English"
4. ✅ languageCode should be set to "en" (check in payload)
5. Select "Japanese"
6. ✅ languageCode should be set to "ja"

### Test 5.2: Certificate Filtering
1. Select "English" as language
2. Click "Add Certificate"
3. ✅ Certificate dropdown should show: IELTS, TOEFL, TOEIC, Cambridge English, CEFR, Other
4. ✅ Should NOT show JLPT, TOPIK, HSK

### Test 5.3: Language Change with Certificate
1. Select "English" + "IELTS" certificate
2. Change language to "Japanese"
3. ✅ Certificate should be auto-cleared
4. ✅ Yellow notice: "Certificate cleared due to language change"
5. ✅ Notice should disappear after 5 seconds

---

## Test Suite 6: Form Submission

### Test 6.1: Complete Form Submission
1. Fill all required fields
2. Set experience to 5
3. Set salary: min 1000, max 2000
4. Set education to "Bachelor's Degree"
5. Add language: English (Fluent)
6. Go to Step 7 and submit
7. ✅ Check browser DevTools → Network tab
8. ✅ Verify payload structure:

```json
{
  "jobLevel": "SENIOR",
  "employmentType": "FULL_TIME",
  "educationLevel": "BACHELOR",
  "minYearsExperience": 5,
  "salary": {
    "min": 1000,
    "max": 2000,
    "currency": "USD",
    "negotiable": false,
    "type": "GROSS"
  },
  "languageRequirements": [
    {
      "languageCode": "en",
      "language": "English",
      "proficiency": "FLUENT"
    }
  ]
}
```

### Test 6.2: Validation Prevents Submission
1. Set salary min: 3000, max: 2000 (invalid)
2. Try to proceed to next step
3. ✅ Should show error and prevent progression
4. Fix the error
5. ✅ Should allow progression

---

## Test Suite 7: Backward Compatibility

### Test 7.1: Load Old Job Data
1. Mock API response with old format:
```json
{
  "jobLevel": "junior",
  "employmentType": "parttime",
  "educationLevel": "bachelor",
  "salary": { "min": "1000", "max": "2000" },
  "requiredExperience": "5+"
}
```
2. Load in MyJobs page
3. ✅ Should normalize to:
   - jobLevel: "JUNIOR"
   - employmentType: "PART_TIME"
   - educationLevel: "BACHELOR"
   - salary: { min: 1000, max: 2000 }
   - minYearsExperience: 5

### Test 7.2: Edit Old Job
1. Load old job data
2. Click "Edit"
3. ✅ Form should populate with normalized values
4. ✅ All dropdowns should show correct selections
5. ✅ Salary should show as numbers
6. ✅ Experience should show in new input

---

## Test Suite 8: Mobile Responsiveness

### Test 8.1: Experience Input on Mobile
1. Open on mobile device (or DevTools mobile view)
2. Test experience input
3. ✅ Stepper buttons should be accessible
4. ✅ Input should be easy to tap
5. ✅ Presets should stack nicely

### Test 8.2: Salary Input on Mobile
1. Test salary inputs on mobile
2. ✅ Currency, min, max should stack vertically
3. ✅ All inputs should be accessible
4. ✅ Checkboxes should be easy to tap

---

## Test Suite 9: Edge Cases

### Test 9.1: Empty Salary
1. Leave salary fields at 0
2. Submit form
3. ✅ Should accept (salary is optional)
4. ✅ Preview should not show salary section

### Test 9.2: Experience = 0
1. Set experience to 0
2. Submit form
3. ✅ Should accept (0 is valid for entry-level)
4. ✅ Preview should not show experience tag

### Test 9.3: Education = NONE
1. Set education to "Not Required"
2. Submit form
3. ✅ Should accept
4. ✅ Preview should not show education tag

### Test 9.4: Rapid Input Changes
1. Rapidly change experience value
2. Rapidly change salary values
3. ✅ Should handle without errors
4. ✅ Validation should update correctly

---

## Test Suite 10: Console Errors

### Test 10.1: No Console Errors
1. Open browser DevTools → Console
2. Navigate through all form steps
3. Fill all fields
4. Submit form
5. ✅ Should have ZERO console errors
6. ✅ Should have ZERO console warnings

### Test 10.2: TypeScript Compilation
1. Run `npm run type-check` (if available)
2. ✅ Should have ZERO TypeScript errors

---

## Bug Report Template

If you find a bug, report using this format:

```
**Test ID**: [e.g., Test 2.2]
**Test Name**: [e.g., Min > Max Validation]
**Expected**: [What should happen]
**Actual**: [What actually happened]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]
**Screenshots**: [If applicable]
**Console Errors**: [If any]
**Browser**: [Chrome/Firefox/Safari]
**Device**: [Desktop/Mobile]
```

---

## Test Results Summary

| Test Suite | Total Tests | Passed | Failed | Notes |
|------------|-------------|--------|--------|-------|
| 1. Experience Input | 4 | | | |
| 2. Salary Validation | 5 | | | |
| 3. Smart Overview Tags | 6 | | | |
| 4. Enum Normalization | 3 | | | |
| 5. Language Requirements | 3 | | | |
| 6. Form Submission | 2 | | | |
| 7. Backward Compatibility | 2 | | | |
| 8. Mobile Responsiveness | 2 | | | |
| 9. Edge Cases | 4 | | | |
| 10. Console Errors | 2 | | | |
| **TOTAL** | **33** | | | |

---

**Tester Name**: _______________  
**Test Date**: _______________  
**Build Version**: _______________  
**Overall Status**: ⬜ PASS / ⬜ FAIL  

---

## Quick Smoke Test (5 minutes)

If you only have 5 minutes, test these critical items:

1. ✅ Experience input allows keyboard entry
2. ✅ Experience tag hidden when 0
3. ✅ Salary validation shows errors
4. ✅ Job level dropdown has MANAGER (not DIRECTOR)
5. ✅ Employment type has TEMP (not INTERN)
6. ✅ Education level has UPPER_SNAKE_CASE values
7. ✅ Form submits successfully
8. ✅ No console errors

If all 8 pass → ✅ **READY FOR PRODUCTION**
