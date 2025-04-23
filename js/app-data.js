import { getJobData } from "./job-data.js";

/*
example applications object:
const applicantsExample = {
  1: {
    jobId: 3, // References the job they're applying for
    applicantId: 1, // Unique ID for the applicant
    name: "Sarah Johnson", // Full name
    email: "sarah@example.com", // Contact email
    experienceLevel: "Entry Level", // Experience level
    skills: ["JavaScript", "React", "HTML", "CSS"], // Key skills
    education: "Bachelor of Computer Science, University of Technology", // Simplified education
    experience: "1 year intern at TechCorp", // Simplified experience
    applicationDate: "2025-04-22", // When they applied
    status: "Pending", // Application status: Applied, Reviewing, Interviewed, Rejected, Hired
    resumeUrl: "../resumes/sarah_resume.pdf", // Path to resume file
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
  return Object.values(applications).filter(
    (app) => app.applicantId === userId
  );
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
  const skillsPool = [
    "JavaScript",
    "React",
    "HTML",
    "CSS",
    "Python",
    "C#",
    ".NET",
    "Java",
    "SQL",
    "Node.js",
    "TypeScript",
    "Angular",
    "Vue",
    "Swift",
    "Kotlin",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "C++",
  ];
  const universities = [
    "University of Technology",
    "State University",
    "Polytechnic Institute",
    "International College",
  ];
  const statuses = ["Pending", "Rejected", "Hired"];

  for (let i = 1; i <= count; i++) {
    // Select a random job
    const job = jobData[Math.floor(Math.random() * jobData.length)];

    // Generate random applicant details
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

    // Generate 3-5 random skills (with some overlap with job skills)
    const applicantSkills = [...job.skills];
    while (applicantSkills.length < 3 + Math.floor(Math.random() * 3)) {
      const randomSkill =
        skillsPool[Math.floor(Math.random() * skillsPool.length)];
      if (!applicantSkills.includes(randomSkill)) {
        applicantSkills.push(randomSkill);
      }
    }

    // Generate education and experience based on level
    const university =
      universities[Math.floor(Math.random() * universities.length)];
    const degree = Math.random() > 0.3 ? "Bachelor" : "Master";
    const education = `${degree} of Computer Science, ${university}`;

    let experience = "";
    if (
      job.experienceLevel === "Intern" ||
      job.experienceLevel === "Fresh Graduate"
    ) {
      experience = `${Math.floor(Math.random() * 2) + 1} year intern at ${
        job.company
      }`;
    } else if (job.experienceLevel === "Junior") {
      experience = `${
        Math.floor(Math.random() * 3) + 1
      } years at various companies`;
    } else {
      experience = `${
        Math.floor(Math.random() * 5) + 3
      } years professional experience`;
    }

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
      experienceLevel: job.experienceLevel,
      skills: applicantSkills,
      education: education,
      experience: experience,
      applicationDate: formattedDate,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      resumeUrl: `../resumes/${firstName.toLowerCase()}_resume.pdf`,
    };
  }

  return applications;
}

if (
  !localStorage.getItem("applications") ||
  localStorage.getItem("applications") === "{}"
) {
  const jobData = getJobData();
  const mockApplications = generateMockApplications(jobData, 50);
  localStorage.setItem("applications", JSON.stringify(mockApplications));
}
