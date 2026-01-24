export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "hr";
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  status: "open" | "closed";
  applicants: number;
  pending: number;
};

export type Application = {
  id: string;
  userId: string;
  jobId: string;
  status: "pending" | "approved" | "rejected";
  score: number;
  jobTitle: string;
  company: string;
  location: string;
  appliedAt: number;
  why: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
};
