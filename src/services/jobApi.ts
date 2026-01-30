// Job API Service
// HTTP calls for job CRUD operations

import type { NormalizedJob, JobUpdatePayload, RawJob } from "../types/job";
import { normalizeJob } from "../utils/jobNormalizers";

const API_BASE_URL = "http://localhost:3000";

/**
 * Fetch all jobs from the API
 */
export async function getJobs(): Promise<NormalizedJob[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const jobsArray = Array.isArray(data) ? data : [];
    return jobsArray.map(normalizeJob);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
}

/**
 * Get a single job by ID
 */
export async function getJobById(id: string | number): Promise<NormalizedJob> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return normalizeJob(data);
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
}

/**
 * Create a new job
 */
export async function createJob(payload: any): Promise<NormalizedJob> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return normalizeJob(data);
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
}

/**
 * Update a job by ID (partial update)
 */
export async function updateJob(
  id: string | number,
  payload: JobUpdatePayload
): Promise<NormalizedJob> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return normalizeJob(data);
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
}

/**
 * Delete a job by ID
 */
export async function deleteJob(id: string | number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.status !== 204) {
      await response.json();
    }
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
}
