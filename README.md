# Match-Made-AI – Frontend

Frontend application for **Match-Made-AI**, an AI-assisted job–candidate matching platform.  
This repository focuses on the **user interface and interaction flow**, while AI logic and backend services are handled by separate services.

>  Current status: **Work in progress**  
> Some features are implemented with mock data to validate UX and system flow before full backend/AI integration.

---

##  Project Overview

Match-Made-AI aims to support recruitment by automatically matching candidates with relevant job postings using AI-based semantic matching and scoring.

The frontend provides:
- A clear user experience for **candidates** to explore matched jobs
- A management interface for **HR** to post jobs and review candidates with AI-assisted insights

---

##  User Roles & Features

###  Candidate (Applicant)

**Current features**
- Upload CV  
  - Supports structured CV format  
  - Uploading existing CV files (PDF/DOCX) is **planned**
- Apply filters (job level, skills, etc.)
- View a list of matched jobs (currently generated using mock data)
- View job details
- See **matching score** for each job
- Apply directly to a job from the job detail page

**Planned features**
- CV parsing from uploaded PDF/DOCX
- Real-time AI matching results from backend AI service
- Application status tracking (applied / accepted / rejected)

---

##  HR (Recruiter)

**Current features**
- Post job openings using a structured job format
- View list of candidates who applied for a job
- View candidate CV information along with **AI matching score**
- Approve or reject candidates
- Send application result notifications to candidate accounts

**Planned features**
- Upload existing job descriptions (DOCX)
- Advanced filtering and ranking of candidates
- Integration with AI core service for real matching logic

---

##  AI Integration (Conceptual)

At the current stage, AI-related results (job matching, scores) are **mocked** in the frontend to validate user flows.

Planned integration:
- Frontend → Backend API
- Backend → AI Core Service
- AI Core returns:
  - Matching score
  - Skill coverage
  - Explanation metadata (optional)

---

##  Tech Stack

- **Frontend Framework**: React
- **Language**: JavaScript / TypeScript
- **State Management**: Context API (current)
- **Styling**: CSS / Tailwind (if applicable)
- **API Communication**: REST (planned)

---


##  Current Status & Roadmap

**Completed / In Progress**
- Candidate job browsing flow
- Matching score visualization
- HR job posting and candidate review UI
- Role-based UI separation

**Next steps**
- Connect to backend APIs
- Replace mock data with real AI matching results
- Support CV and JD file uploads (PDF/DOCX)
- Improve UX for large job/candidate lists

---

##  Related Repositories

- **match-made-ai-core** – AI service for embedding, matching, and scoring  
- **match-made-ai-backend** – Backend API and business logic

---
## Running Locally

>  Work in progress. Some features use mock data.

```bash
git clone https://github.com/zafkielzz/match-made-ai-front-end.git
cd match-made-ai-front-end
npm install
npm run dev
```
---
##  Notes

This repository focuses on **frontend UX and system interaction**, not on AI model development.  
The project is developed as a **team project**, with clear separation of frontend, backend, and AI responsibilities.

---

##  License

This project is for educational and experimental purposes.
