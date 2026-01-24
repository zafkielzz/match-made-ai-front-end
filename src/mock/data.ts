// Mock data for jobs, users, applications, notifications
export const jobs = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Tech Corp",
    location: "Remote",
    description: "Build modern UIs with React.",
    requirements: "React, TypeScript, CSS",
    status: "open",
    applicants: 2,
    pending: 1,
  },
  {
    id: "2",
    title: "Backend Developer",
    company: "Data Inc",
    location: "New York, NY",
    description: "Work on APIs and databases.",
    requirements: "Node.js, SQL, REST",
    status: "open",
    applicants: 1,
    pending: 1,
  },
  {
    id: "3",
    title: "Product Manager",
    company: "Biz Solutions",
    location: "San Francisco, CA",
    description: "Lead product teams.",
    requirements: "Agile, Communication",
    status: "closed",
    applicants: 1,
    pending: 0,
  },
];

export const users = [
  { id: "u1", name: "Alice", email: "alice@email.com", role: "user" },
  { id: "u2", name: "Bob", email: "bob@email.com", role: "hr" },
];

export const applications = [
  {
    id: "a1",
    userId: "u1",
    jobId: "1",
    status: "pending",
    score: 87,
    jobTitle: "Frontend Developer",
    company: "Tech Corp",
    location: "Remote",
    appliedAt: Date.now() - 86400000,
    why: "Strong React skills.",
  },
  {
    id: "a2",
    userId: "u1",
    jobId: "2",
    status: "approved",
    score: 65,
    jobTitle: "Backend Developer",
    company: "Data Inc",
    location: "New York, NY",
    appliedAt: Date.now() - 172800000,
    why: "Good Node.js experience.",
  },
  {
    id: "a3",
    userId: "u1",
    jobId: "3",
    status: "rejected",
    score: 40,
    jobTitle: "Product Manager",
    company: "Biz Solutions",
    location: "San Francisco, CA",
    appliedAt: Date.now() - 259200000,
    why: "No PM experience.",
  },
];

export const notifications = [
  {
    id: "n1",
    userId: "u1",
    title: "Application Approved",
    body: "Your application for Backend Developer was approved.",
    read: false,
    createdAt: Date.now() - 3600000,
  },
  {
    id: "n2",
    userId: "u1",
    title: "Application Rejected",
    body: "Your application for Product Manager was rejected.",
    read: true,
    createdAt: Date.now() - 7200000,
  },
];
