import { getJobData } from "./job-data.js";
import { getCurrentUser } from "./auth.js";

/*
example applications object:
const applicantsExample = {
  1: {
    jobId: 3, // References the job they're applying for
    applicantId: 1, // Unique ID for the applicant
    name: "Sarah Johnson", // Full name
    email: "sarah@example.com", // Contact email
    applicationDate: "2025-04-22", // When they applied
    status: "Pending", // Application status: Applied, Reviewing, Interviewed, Rejected, Hired
  },
};
*/

export function getApplications() {
  return JSON.parse(localStorage.getItem("applications")) || {};
}

export function getApplicationByJobID(jobId) {
  const applications = getApplications();
  return Object.values(applications).filter((app) => app.jobId === jobId);
}

export function getApplicationByUserID(userId) {
  const applications = getApplications();
  let application = null;
  for (const id in applications) {
    if (applications[id].applicantId === userId) {
      application = applications[id];
      break;
    }
  }
  return application;
}

export function getApplicationByID(applicationID) {
  const applications = getApplications();
  return applications[applicationID] || null;
}

export function addApplication(application) {
  const applications = getApplications();
  let maxID = Math.max(0, ...Object.keys(applications).map(Number));
  let id = maxID + 1;
  applications[id] = application;
  localStorage.setItem("applications", JSON.stringify(applications));
}

export function applyToJob(jobID, userID) {
  if (hasUserApplied(jobID, userID)) {
    console.log("User has already applied to this job.");
    return;
  }

  const user = getCurrentUser();
  if (user.id != userID) {
    console.log("User ID mismatch. Cannot apply to job.");
    return;
  }

  const newApplication = {
    jobId: jobID,
    applicantId: userID,
    name: user.name,
    email: user.email,
    applicationDate: new Date().toISOString().split("T")[0],
    status: "Pending",
  };

  addApplication(newApplication);
}

export function updateApplicationStatus(applicationID, status) {
  const applications = getApplications();
  if (applications[applicationID]) {
    applications[applicationID].status = status;
    localStorage.setItem("applications", JSON.stringify(applications));
  }
}

export function deleteApplication(applicationID) {
  const applications = getApplications();
  delete applications[applicationID];
  localStorage.setItem("applications", JSON.stringify(applications));
}

export function deleteApplicationsByJobID(jobId) {
  const applications = getApplications();
  for (const id in applications) {
    if (applications[id].jobId === jobId) {
      delete applications[id];
    }
  }
  localStorage.setItem("applications", JSON.stringify(applications));
}

export function deleteApplicationsByUserID(userId) {
  const applications = getApplications();
  for (const id in applications) {
    if (applications[id].applicantId === userId) {
      delete applications[id];
    }
  }
  localStorage.setItem("applications", JSON.stringify(applications));
}

export function getApplicationCountByJobID(jobId) {
  const applications = getApplications();
  return Object.values(applications).filter((app) => app.jobId === jobId)
    .length;
}

export function getApplicationCountByUserID(userId) {
  const applications = getApplications();
  return Object.values(applications).filter((app) => app.applicantId === userId)
    .length;
}

export function getApplicationCount() {
  const applications = getApplications();
  return Object.keys(applications).length;
}

export function getApplicationID(jobID, userID) {
  const applications = getApplications();
  for (const id in applications) {
    const { jobId, applicantId } = applications[id];
    if (`${jobId}` === `${jobID}` && `${applicantId}` === `${userID}`) {
      return id;
    }
  }
  return null;
}

export function hasUserApplied(jobID, userID) {
  const applications = getApplications();
  for (const id in applications) {
    const { jobId, applicantId } = applications[id];
    if (`${jobId}` === `${jobID}` && `${applicantId}` === `${userID}`) {
      return true;
    }
  }
  return false;
}

function generateMockApplications(jobData, count = 20) {
  const applications = {};
  const firstNames = [
    "Sarah",
    "John",
    "Emily",
    "Michael",
    "Jessica",
    "David",
    "Jennifer",
    "Robert",
    "Lisa",
    "William",
  ];
  const lastNames = [
    "Johnson",
    "Smith",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
    "Davis",
    "Garcia",
    "Rodriguez",
    "Wilson",
  ];
  const experienceLevels = ["Entry Level", "Junior", "Mid-Level", "Senior"];
  const statuses = ["Pending", "Rejected", "Hired"];

  for (let i = 1; i <= count; i++) {
    // Select a random job
    const job = jobData[Math.floor(Math.random() * jobData.length)];

    // Generate random applicant details
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

    // Generate random application date within the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const applicationDate = new Date();
    applicationDate.setDate(applicationDate.getDate() - daysAgo);
    const formattedDate = applicationDate.toISOString().split("T")[0];

    applications[i] = {
      jobId: job.id,
      applicantId: i,
      name: `${firstName} ${lastName}`,
      email: email,
      applicationDate: formattedDate,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
  }

  return applications;
}

// if (
//   !localStorage.getItem("applications") ||
//   localStorage.getItem("applications") === "{}"
// ) {
//   const jobData = getJobData();
//   const mockApplications = generateMockApplications(jobData, 50);
//   localStorage.setItem("applications", JSON.stringify(mockApplications));
// }
