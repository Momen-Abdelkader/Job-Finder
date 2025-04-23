import {
  getJobData,
  getJobById,
  updateJob,
  addJob,
  deleteJob,
} from "./job-data.js";

createNav(true, true);
const jobData = getJobData();
const jobCardsContainer = document.querySelector(".job-cards");

jobData.forEach((job) => {
  const card = createJobCard(job, "admin");
  jobCardsContainer.appendChild(card);
  setupCardEventHandlers(card, job.id);
});

function showAddJobModal() {}

function showEditJobModal(job) {}

function showDeleteJobModal(job) {
  const modal = document.getElementById("delete-job-modal");
  const confirmButton = modal.querySelector("#confirm-delete");
  const cancelButton = modal.querySelector("#cancel-delete");
  const closeButton = modal.querySelector(".close");

  confirmButton.addEventListener("click", () => {
    deleteJob(job.id);
    location.reload();
  });

  cancelButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.style.display = "flex";
}

function showJobApplicantsModal(job) {}

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
