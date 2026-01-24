import { jobs, applications, notifications } from "./data";

let jobsStore = [...jobs];
let applicationsStore = [...applications];
let notificationsStore = [...notifications];

export function getJobById(id: string) {
  return Promise.resolve(jobsStore.find((j) => j.id === id));
}

export function getMyApplications(userId: string) {
  return Promise.resolve(applicationsStore.filter((a) => a.userId === userId));
}

export function getNotifications(userId: string) {
  return Promise.resolve(notificationsStore.filter((n) => n.userId === userId));
}

export function markNotificationRead(id: string) {
  notificationsStore = notificationsStore.map((n) =>
    n.id === id ? { ...n, read: true } : n,
  );
  return Promise.resolve();
}

export function applyToJob(jobId: string, userId: string) {
  const job = jobsStore.find((j) => j.id === jobId);
  if (!job?.status || job.status !== "open")
    return Promise.reject(new Error("Job not open"));
  applicationsStore.push({
    id: `a${applicationsStore.length + 1}`,
    userId,
    jobId,
    status: "pending",
    score: Math.floor(Math.random() * 100),
    jobTitle: job.title,
    company: job.company,
    location: job.location,
    appliedAt: Date.now(),
    why: "Auto-matched by AI.",
  });
  job.applicants++;
  job.pending++;
  notificationsStore.push({
    id: `n${notificationsStore.length + 1}`,
    userId,
    title: "Application Submitted",
    body: `You applied for ${job.title}.`,
    read: false,
    createdAt: Date.now(),
  });
  return Promise.resolve();
}

export function getHRDashboardStats(hrId: string) {
  const jobs = jobsStore.filter((j) => j.status === "open");
  const pending = applicationsStore.filter(
    (a) => a.status === "pending",
  ).length;
  return Promise.resolve({ jobs: jobs.length, pending });
}

export function postJob(form: any) {
  jobsStore.push({
    ...form,
    id: `${jobsStore.length + 1}`,
    status: "open",
    applicants: 0,
    pending: 0,
  });
  return Promise.resolve();
}

export function getMyJobs(hrId: string) {
  // All jobs for demo
  return Promise.resolve(jobsStore);
}

export function closeJob(id: string) {
  jobsStore = jobsStore.map((j) =>
    j.id === id ? { ...j, status: "closed" } : j,
  );
  return Promise.resolve();
}

export function getApplicantsForJob(jobId: string) {
  return Promise.resolve(applicationsStore.filter((a) => a.jobId === jobId));
}

export function updateApplicationStatus(appId: string, status: string) {
  applicationsStore = applicationsStore.map((a) =>
    a.id === appId ? { ...a, status } : a,
  );
  return Promise.resolve();
}

export function rejectAllPendingApplicants(jobId: string) {
  applicationsStore = applicationsStore.map((a) =>
    a.jobId === jobId && a.status === "pending"
      ? { ...a, status: "rejected" }
      : a,
  );
  return Promise.resolve();
}
