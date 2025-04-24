import {
  getJobsByCompany,
  getJobById,
  updateJob,
  addJob,
  deleteJob,
} from "./job-data.js";

import {
  getApplications,
  getApplicationByJobID,
  getApplicationByUserID,
  getApplicationByID,
  addApplication,
  updateApplicationStatus,
  deleteApplication,
  deleteApplicationsByJobID,
  deleteApplicationsByUserID,
  getApplicationCountByJobID,
  getApplicationCountByUserID,
  getApplicationCount,
  getApplicationID,
} from "./app-data.js";

import { isUserLoggedIn, isUserAdmin, getCurrentUser } from "./auth.js";

import {
  createJobCard,
  disableScrolling,
  enableScrolling,
  successMessage,
  failMessage,
} from "./main.js";

function showAddJobModal() {
  const modal = document.querySelector("#add-job-modal");
  const closeButton = document.querySelector("#add-job-modal .close");
  const cancelButton = document.querySelector("#cancel");
  const jobForm = document.querySelector(".job-form");
  const user = getCurrentUser();

  modal.querySelector("#add-job-button").innerHTML = "Add Job";

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
    jobForm.reset();
    enableScrolling();
  });

  cancelButton.addEventListener("click", () => {
    modal.style.display = "none";
    jobForm.reset();
    enableScrolling();
  });

  jobForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const workLocation = document.querySelector(
      'input[name="workLocation"]:checked'
    ).value;
    const jobType = document.querySelector(
      'input[name="jobType"]:checked'
    ).value;
    const experience = document.querySelector(
      'input[name="experience"]:checked'
    ).value;

    const jobArr = getJobsByCompany(user.id);
    let maxID = 0;
    for (let i = 0; i < jobArr.length; i++) {
      if (maxID < jobArr[i].id) maxID = jobArr[i].id;
    }

    const newJob = {
      id: maxID + 1,
      logo: "../assets/temp-profile.webp", // TODO: implement profile image link
      company: user.companyName,
      companyId: user.id,
      title: jobForm.querySelector("#job-title").value,
      location: jobForm.querySelector("#job-location").value,
      salary: "$" + jobForm.querySelector("#job-salary").value + "/month",
      jobType: jobType,
      workMode: workLocation,
      skills: ["C++", "Debugging", "Batates Soury"], // TODO: implement skills input
      experienceLevel: experience,
      postedAt: new Date(),
      description: jobForm.querySelector("#job-description").value,
    };

    addJob(newJob);

    jobForm.reset();
    modal.style.display = "none";
    enableScrolling();
    location.reload();
  });

  modal.style.display = "flex";
  disableScrolling();
}

function showEditJobModal(job) {
  const modal = document.querySelector("#add-job-modal");
  const closeButton = document.querySelector("#add-job-modal .close");
  const cancelButton = document.querySelector("#cancel");

  let jobForm = document.querySelector(".job-form");
  let workLocation = document.querySelector(
    `input[name="workLocation"][value=${job.workMode}]`
  );
  let jobType = document.querySelector(
    'input[name="jobType"][value="' + job.jobType + '"]'
  );
  let experience = document.querySelector(
    'input[name="experience"][value="' + job.experienceLevel + '"]'
  );

  jobForm.querySelector("#job-title").value = job.title;
  jobForm.querySelector("#job-location").value = job.location;
  jobForm.querySelector("#job-salary").value = job.salary.replace(/\D/g, "");
  jobForm.querySelector("#job-description").value = job.description;
  workLocation.checked = true;
  jobType.checked = true;
  experience.checked = true;

  modal.querySelector("#add-job-button").innerHTML = "Confirm";

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
    jobForm.reset();
    enableScrolling();
  });

  cancelButton.addEventListener("click", () => {
    modal.style.display = "none";
    jobForm.reset();
    enableScrolling();
  });

  jobForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const workLocation = document.querySelector(
      'input[name="workLocation"]:checked'
    ).value;
    const jobType = document.querySelector(
      'input[name="jobType"]:checked'
    ).value;
    const experience = document.querySelector(
      'input[name="experience"]:checked'
    ).value;

    const newJob = {
      id: job.id,
      logo: job.logo,
      company: job.company,
      companyId: job.companyId,
      title: jobForm.querySelector("#job-title").value,
      location: jobForm.querySelector("#job-location").value,
      salary: "$" + jobForm.querySelector("#job-salary").value + "/month",
      jobType: jobType,
      workMode: workLocation,
      skills: ["C++", "Debugging", "Batates Soury"], // <-- Temp Skills
      experienceLevel: experience,
      postedAt: new Date(),
      description: jobForm.querySelector("#job-description").value,
    };

    updateJob(newJob);

    jobForm.reset();
    modal.style.display = "none";
    enableScrolling();
    location.reload();
  });

  modal.style.display = "flex";
  disableScrolling();
}

function showDeleteJobModal(job) {
  const modal = document.getElementById("delete-job-modal");
  const confirmButton = modal.querySelector("#confirm-delete");
  const cancelButton = modal.querySelector("#cancel-delete");
  const closeButton = modal.querySelector(".close");

  confirmButton.addEventListener("click", () => {
    deleteJob(job.id);
    deleteApplicationsByJobID(job.id);
    location.reload();
  });

  cancelButton.addEventListener("click", () => {
    modal.style.display = "none";
    enableScrolling();
  });

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
    enableScrolling();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      enableScrolling();
    }
  });

  modal.style.display = "flex";
  disableScrolling();
}

function showJobApplicantsModal(job) {
  const modal = document.getElementById("job-applicants-modal");
  const closeButton = modal.querySelector(".close");
  const applicantsList = modal.querySelector(".applicants-list");
  const okButton = modal.querySelector("#close-applicants-modal");

  const applications = getApplicationByJobID(job.id);
  applicantsList.innerHTML = "";

  applications.forEach((application) => {
    const applicant = getApplicationByUserID(application.applicantId);
    const applicationDataHTML = `
    <div class="applicant-card" id="${application.applicantId}">
      <div class="applicant-info">
        <img class="applicant-image" src="../assets/profile.webp" alt="${
          applicant.name
        } image">
        <h3 class="applicant-name">${applicant.name}</h3>
        <p class="applicant-email">${applicant.email}</p>
        <p class="applicant-date">${applicant.applicationDate}</p>
        <select class="applicant-status">
          <option ${
            application.status === "Pending" ? "selected" : ""
          }>Pending</option>
          <option ${
            application.status === "Accepted" ? "selected" : ""
          }>Accepted</option>
          <option ${
            application.status === "Rejected" ? "selected" : ""
          }>Rejected</option>
        </select>
      </div>
      <div class="applicant-actions">
        <a class="button resume-button" href="${
          applicant.resumeUrl
        }" target="_blank">View Resume</a>
        <a class="button profile-button" href="../profile.html?userId=${
          applicant.applicantId
        }" target="_blank">View Profile</a>
      </div>
    </div>`;

    const listItem = document.createElement("li");
    listItem.classList.add("applicant-item");
    listItem.innerHTML = applicationDataHTML;
    applicantsList.appendChild(listItem);
  });

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
    enableScrolling();
  });

  okButton.addEventListener("click", () => {
    modal.style.display = "none";
    enableScrolling();
  });

  const statusSelects = modal.querySelectorAll(".applicant-status");
  statusSelects.forEach((select) => {
    select.addEventListener("change", (event) => {
      const newStatus = event.target.value;
      const applicantId = event.target.closest(".applicant-card").id;

      const applicationId = getApplicationID(parseInt(job.id), applicantId);
      if (applicationId) {
        updateApplicationStatus(applicationId, newStatus);
      }
    });
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      enableScrolling();
    }
  });

  modal.style.display = "flex";
  disableScrolling();
}

document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.querySelector("#add-button");

  if (addButton) {
    addButton.addEventListener("click", () => {
      showAddJobModal();
    });
  }
});

function setupCardEventHandlers(card, jobId) {
  const editButton = card.querySelector(".edit-button");
  const deleteButton = card.querySelector(".delete-button");
  const applicantsButton = card.querySelector(".applicants-button");

  if (editButton) {
    editButton.addEventListener("click", () => {
      const job = getJobById(jobId);
      showEditJobModal(job);
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      const job = getJobById(jobId);
      showDeleteJobModal(job);
    });
  }

  if (applicantsButton) {
    applicantsButton.addEventListener("click", () => {
      const job = getJobById(jobId);
      showJobApplicantsModal(job);
    });
  }
}

function init() {
  authValidation();
  const user = getCurrentUser();
  const jobData = getJobsByCompany(user.id);
  const jobCardsContainer = document.querySelector(".job-cards");

  jobData.forEach((job) => {
    const card = createJobCard(job, "admin");
    jobCardsContainer.appendChild(card);
    setupCardEventHandlers(card, job.id);
  });
}

function authValidation() {
  if (!isUserLoggedIn()) {
    alert("You are not logged in. Redirecting to login page.");
    window.location.href = "../html/login.html";
  }

  if (!isUserAdmin()) {
    alert("You are not an admin. Redirecting to home page.");
    window.location.href = "../html/home.html";
  }
}

init();
