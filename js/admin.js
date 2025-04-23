import {
  getJobData,
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

createNav(true, true);
const jobData = getJobData();
const jobCardsContainer = document.querySelector(".job-cards");

jobData.forEach((job) => {
  const card = createJobCard(job, "admin");
  jobCardsContainer.appendChild(card);
  setupCardEventHandlers(card, job.id);
});

function showAddJobModal() {
  // TODO: implement
}

function showEditJobModal(job) {
  // TODO: implement
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
    const applicant = getApplicationByID(application.applicantId);
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
  // TODO: implement
}
