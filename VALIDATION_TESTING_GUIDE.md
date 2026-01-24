# Job Posting Validation - Testing Guide

## Quick Test Scenarios

### ✅ Valid Job Posting (Should Pass)

```
Title: Senior Backend Developer
Company: Tech Corp
Overview: Join our backend team to build scalable microservices. You'll design APIs and optimize database performance, directly impacting 1M+ users.

Responsibilities:
- Design and implement RESTful APIs for mobile applications using Python and Django
- Collaborate with frontend team to integrate backend services with React applications
- Optimize database queries and implement caching strategies for improved performance

Required Qualifications:
- 3+ years of professional experience in Python backend development
- Strong understanding of RESTful API design principles and microservices architecture
- Experience with PostgreSQL and Redis for data storage and caching

Preferred Qualifications:
- Experience with GraphQL and microservices architecture patterns
- Familiarity with cloud platforms like AWS or Google Cloud Platform

Tech Stack:
- Languages: Python, JavaScript
- Frameworks: Django, FastAPI
- Databases: PostgreSQL, Redis

Languages: English (Advanced), Vietnamese (Native)
Deadline: [Tomorrow's date]
Status: PUBLISHED
```

**Expected**: Quality score 85+, all validations pass, can publish

---

### ❌ Invalid Job Posting (Should Fail)

```
Title: Dev
Company: A
Overview: test test test

Responsibilities:
- 1
- 2
- 3

Required Qualifications:
- asd
- qwe
- 123

Tech Stack:
- test
- asd
- qwe

Deadline: [Yesterday's date]
Status: PUBLISHED
```

**Expected**: Multiple blocking errors, cannot publish

---

## Test Cases by Feature

### 1. Title Validation

| Input | Expected Result |
|-------|----------------|
| "Dev" | ❌ Too short (min 10 chars) |
| "qwertyuiop" | ❌ Gibberish detected |
| "123456789012" | ❌ Too few letters (min 2) |
| "Senior Backend Developer" | ✅ Valid |

### 2. Job Overview Validation

| Input | Expected Result |
|-------|----------------|
| "Short" | ❌ Too short (min 80 chars) |
| "test test test test test test test test test test test test test test test" | ❌ Too much repetition |
| "qwertyuiop asdfghjkl zxcvbnm qwertyuiop asdfghjkl zxcvbnm qwertyuiop asdfghjkl" | ❌ Keyboard mashing |
| "Join our backend team to build scalable microservices. You'll design APIs and optimize database performance, directly impacting 1M+ users." | ✅ Valid |

### 3. Bullet List Items (Responsibilities/Requirements)

| Input | Expected Result |
|-------|----------------|
| "Short" | ❌ Too short (min 20 chars) |
| "1, 2, 3, 4, 5, 6, 7, 8, 9, 10" | ❌ Only numbers/symbols |
| "qwertyuiopasdfghjklzxc" | ❌ Gibberish |
| "Design and implement RESTful APIs" | ✅ Valid |

### 4. Technology Stack

| Input | Expected Result |
|-------|----------------|
| "test" | ❌ Placeholder detected |
| "asd" | ❌ Placeholder detected |
| "qwerty" | ❌ Gibberish detected |
| "Python" | ✅ Valid |

### 5. Application Deadline

| Scenario | Expected Result |
|----------|----------------|
| Empty + DRAFT | ✅ Valid |
| Empty + PUBLISHED | ❌ Required for published jobs |
| Yesterday + PUBLISHED | ❌ Must be in future |
| Tomorrow + PUBLISHED | ✅ Valid |

### 6. Application Method

| Method | Email | Link | Expected Result |
|--------|-------|------|----------------|
| email | empty | - | ❌ Email required |
| email | invalid | - | ❌ Invalid email |
| email | valid@email.com | - | ✅ Valid |
| link | - | empty | ❌ Link required |
| link | - | invalid | ❌ Invalid URL |
| link | - | https://example.com | ✅ Valid |
| platform | empty | empty | ✅ Valid |

---

## Quality Score Testing

### Low Quality (0-49)

**Minimal form with placeholders**
- Title: "test job"
- Company: "test"
- Overview: "test test test test test test test test test test test test test test test test test test"
- 3 responsibilities: "test1", "test2", "test3"
- 3 requirements: "asd", "qwe", "zxc"

**Expected Score**: ~20-30

---

### Acceptable Quality (50-69)

**Basic form with minimal content**
- Valid title and company
- 80-char overview
- 3 responsibilities (20+ chars each)
- 3 required qualifications
- No tech stack
- No preferred qualifications

**Expected Score**: ~55-65

---

### Good Quality (70-84)

**Complete form with some detail**
- Valid title and company
- 150-char overview
- 4 responsibilities
- 4 required + 2 preferred qualifications
- 3-5 tech items
- 1 language requirement
- Salary info
- 3 benefits

**Expected Score**: ~75-80

---

### Excellent Quality (85-100)

**Comprehensive form with rich detail**
- Descriptive title and company
- 200+ char overview
- 5+ responsibilities
- 5+ required + 3+ preferred qualifications
- 8+ tech items across categories
- 2+ language requirements with certificates
- Complete salary info
- 5+ benefits

**Expected Score**: ~90-95

---

## Manual Testing Checklist

### Step 1: General Information
- [ ] Try submitting with empty title → Should show error
- [ ] Enter "test" as title → Should show gibberish warning
- [ ] Enter valid title → Should accept
- [ ] Try submitting without occupation → Should show error
- [ ] Select occupation → Should accept
- [ ] Try submitting without language → Should show error
- [ ] Add language without proficiency → Should show error
- [ ] Add complete language → Should accept

### Step 2: Job Overview & Responsibilities
- [ ] Enter short overview (< 80 chars) → Should show warning
- [ ] Enter "test test test..." → Should show repetition error
- [ ] Enter valid overview → Should accept
- [ ] Try adding responsibility "1" → Should show inline error
- [ ] Try adding "qwerty..." → Should show gibberish error
- [ ] Add valid responsibility → Should accept
- [ ] Try proceeding with < 3 items → Should block

### Step 3: Requirements
- [ ] Try adding requirement "asd" → Should show inline error
- [ ] Add valid requirement → Should accept
- [ ] Try proceeding with < 3 items → Should block
- [ ] Add preferred qualification "123" → Should show error
- [ ] Add valid preferred qualification → Should accept

### Step 4: Tech Stack
- [ ] Add "test" as technology → Should show error in quality check
- [ ] Add "Python" → Should accept
- [ ] Add "python" again → Should deduplicate
- [ ] Check quality score increases with more tech

### Step 5: Benefits
- [ ] Try proceeding with no benefits → Should show error
- [ ] Select 1 benefit → Should accept
- [ ] Check quality score increases with more benefits

### Step 6: Application Info
- [ ] Set deadline to yesterday + PUBLISHED → Should show error
- [ ] Set deadline to tomorrow → Should accept
- [ ] Select email method without email → Should show error
- [ ] Enter invalid email → Should show error
- [ ] Enter valid email → Should accept
- [ ] Select link method without URL → Should show error
- [ ] Enter invalid URL → Should show error
- [ ] Enter valid URL → Should accept

### Step 7: Review & Submit
- [ ] Check quality score is displayed
- [ ] Click submit → Should show Quality Check Dialog
- [ ] Verify blocking errors are shown in red
- [ ] Verify warnings are shown in yellow
- [ ] Try publishing with errors → Submit button disabled
- [ ] Fix errors → Submit button enabled
- [ ] Confirm publish → Should normalize and submit

---

## Automated Testing

### Run Unit Tests

```bash
cd match-made-ai
npm test -- jobValidation.test.ts
```

**Expected**: All 27 tests pass

### Test Coverage

```bash
npm test -- --coverage jobValidation.test.ts
```

---

## Edge Cases to Test

1. **Unicode Characters**: Try entering Vietnamese characters in title/overview
2. **Very Long Input**: Enter 500+ character overview
3. **Special Characters**: Try `<script>alert('xss')</script>` in fields
4. **Copy-Paste**: Copy numbered list from Word/Google Docs
5. **Rapid Typing**: Type very fast to test debouncing
6. **Browser Back**: Navigate back and forward between steps
7. **Refresh**: Refresh page mid-form (data should be lost - expected)
8. **Multiple Tabs**: Open form in two tabs simultaneously

---

## Performance Testing

1. **Large Form**: Fill out form with maximum allowed content
2. **Quality Score**: Check that score updates smoothly (< 100ms)
3. **Validation**: Check that inline validation doesn't lag
4. **Submit**: Check that normalization completes quickly (< 500ms)

---

## Accessibility Testing

1. **Keyboard Navigation**: Tab through entire form
2. **Screen Reader**: Test with NVDA/JAWS
3. **Color Blindness**: Check with color blindness simulator
4. **High Contrast**: Test in high contrast mode
5. **Zoom**: Test at 200% zoom level

---

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Common Issues & Solutions

### Issue: "Quality score not updating"
**Solution**: Check that form state is being updated correctly. Quality score recalculates on every form change.

### Issue: "Can't add bullet item"
**Solution**: Ensure item is at least 20 characters and contains meaningful text (not just numbers/symbols).

### Issue: "Deadline validation fails for future date"
**Solution**: Check timezone. System uses Asia/Ho_Chi_Minh (UTC+7). Your local time may differ.

### Issue: "Tech stack shows placeholder error for valid tech"
**Solution**: Avoid exact matches for "test", "asd", "qwe", "123". Use full technology names.

---

## Reporting Issues

When reporting validation issues, include:
1. Input value that caused the issue
2. Expected behavior
3. Actual behavior
4. Browser and OS
5. Screenshots of error messages
6. Console errors (if any)

---

## Success Criteria

A successful implementation should:
- ✅ Block all placeholder/gibberish content
- ✅ Provide clear, actionable error messages
- ✅ Show quality score 0-100 in real-time
- ✅ Display quality check dialog before publish
- ✅ Normalize all data before submission
- ✅ Pass all 27 unit tests
- ✅ Have zero TypeScript errors
- ✅ Work on all major browsers
- ✅ Be accessible (WCAG 2.1 AA)
