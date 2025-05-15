// import {
//   getJobData,
//   getJobById,
//   updateJob,
//   addJob,
//   deleteJob,
// } from "./job-data.js";

// import { hasUserApplied, addApplication, applyToJob } from "./app-data.js";

// import { getCurrentUser, isUserAdmin, isUserLoggedIn } from "./auth.js";

// import {
//   createJobCard,
//   enableScrolling,
//   disableScrolling,
//   successMessage,
//   failMessage,
// } from "./main.js";

// constants
const MIN_SALARY_GAP = 100;

let showAppliedJobs = localStorage.getItem("showAppliedJobs") === "true";

// DOM
const domElements = {
  filtersContainer: document.getElementById("filters"),
  jobCardsContainer: document.querySelector(".job-cards"),
  jobCount: document.getElementById("job-count"),
  searchInput: document.querySelector(".search-input"),
  findButton: document.querySelector(".find-button"),
};

// initialization
function init() {
  addShowAppliedJobsToggle();
  setupSalarySlider();
  setupEventListeners();
}

function addShowAppliedJobsToggle() {
  const toggleContainer = document.createElement("div");
  toggleContainer.classList.add("applied-jobs-toggle");
  toggleContainer.innerHTML = `
    <div class="toggle-container filter-category">
      <label class="switch">
        <input type="checkbox" id="show-applied-toggle" ${
          showAppliedJobs ? "checked" : ""
        }>
        <span class="slider round"></span>
      </label>
      <span class="toggle-label">Show jobs I've already applied to</span>
    </div>
  `;

  domElements.filtersContainer.insertAdjacentElement(
    "afterbegin",
    toggleContainer
  );
}

// filters


// salary slider
function setupSalarySlider() {
  const fromSlider = document.getElementById("from-slider");
  const toSlider = document.getElementById("to-slider");
  const minValueLabel = document.getElementById("min-value");
  const maxValueLabel = document.getElementById("max-value");

  const updateLabels = () => {
    minValueLabel.textContent = `$${fromSlider.value}`;
    maxValueLabel.textContent = `$${toSlider.value}`;
  };

  const enforceRange = (event) => {
    if (
      parseInt(toSlider.value) - parseInt(fromSlider.value) <=
      MIN_SALARY_GAP
    ) {
      event.target === fromSlider
        ? (fromSlider.value = parseInt(toSlider.value) - MIN_SALARY_GAP)
        : (toSlider.value = parseInt(fromSlider.value) + MIN_SALARY_GAP);
    }
    updateLabels();
  };

  fromSlider.addEventListener("input", enforceRange);
  toSlider.addEventListener("input", enforceRange);
  updateLabels();
}

function showApplyModal(job) {
  const modalContainer = document.createElement("div");
  modalContainer.id = "apply-modal-container";
  modalContainer.className = "modal-container";

  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-title">
        <h1>Apply for Job</h1>
        <span class="close-button">&times;</span>
      </div>
      <div class="modal-header">
        <div class="company-info-large">
          <img src="${job.logo}" alt="${
    job.company
  } logo" class="company-logo-large">
          <div>
            <h2 class="company-name">${job.company}</h2>
            <h1 class="job-title-large">${job.title}</h1>
            <p class="job-location">${job.location}</p>
            <p class="job-posted">Posted: ${new Date(
              job.postedAt
            ).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to apply for this job?</p>
        <div class="modal-actions">
          <a class="button apply-button">Apply</a>
          <a class="button cancel-button">Cancel</a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalContainer);
  modalContainer.appendChild(modal);

  void modalContainer.offsetWidth;

  modalContainer.classList.add("active");
  disableScrolling();

  const closeModal = () => {
    modalContainer.classList.remove("active");
    setTimeout(() => {
      document.body.removeChild(modalContainer);
      enableScrolling();
    }, 300);
  };

  modal.querySelector(".close-button").addEventListener("click", closeModal);
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) closeModal();
  });

  modal.querySelector(".cancel-button").addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  const applyButton = modal.querySelector(".apply-button");
  applyButton.addEventListener("click", () => {
    if (!isUserLoggedIn()) {
      window.location.href = "login.html";
      return;
    }

    if (hasUserApplied(job.id, user.id)) {
      failMessage("You have already applied for this job.");
      closeModal();
    } else {
      applyToJob(job.id, user.id);
      successMessage("Application submitted successfully!");
      closeModal();
      handleApplyFilters();
      updateFilterCounts();
    }
  });
}

function showDetailsModal(job) {
  const modalContainer = document.createElement("div");
  modalContainer.id = "details-modal-container";
  modalContainer.className = "modal-container";

  const modal = document.createElement("div");
  modal.className = "modal";

  const skillsHTML = job.skills
    .map((skill) => `<li class="tag">${skill}</li>`)
    .join("");

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">&times;</span>
      <div class="modal-header">
        <div class="company-info-large">
          <img src="${job.logo}" alt="${
    job.company
  } logo" class="company-logo-large">
          <div>
            <h2 class="company-name">${job.company}</h2>
            <h1 class="job-title-large">${job.title}</h1>
            <p class="job-location">${job.location}</p>
            <p class="job-posted">Posted: ${new Date(
              job.postedAt
            ).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="job-highlights">
          <div class="highlight-item">
            <h3>Salary</h3>
            <p>${job.salary}</p>
          </div>
          <div class="highlight-item">
            <h3>Job Type</h3>
            <p>${job.jobType}</p>
          </div>
          <div class="highlight-item">
            <h3>Experience</h3>
            <p>${job.experienceLevel}</p>
          </div>
          <div class="highlight-item">
            <h3>Work Mode</h3>
            <p>${job.workMode}</p>
          </div>
        </div>
        
        <div class="job-section">
          <h3>Job Description</h3>
          <p>${job.description}</p>
        </div>
        
        <div class="job-section">
          <h3>Skills Required</h3>
          <ul class="tags">
            ${skillsHTML}
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        ${
          isUserLoggedIn() && hasUserApplied(job.id, user.id)
            ? '<a class="button apply-button large-button already-applied">Already Applied</a>'
            : '<a href="#" class="button apply-button large-button">Apply Now</a>'
        }
      </div>
    </div>
  `;

  document.body.appendChild(modalContainer);
  modalContainer.appendChild(modal);

  void modalContainer.offsetWidth;

  modalContainer.classList.add("active");
  disableScrolling();

  const closeModal = () => {
    modalContainer.classList.remove("active");
    setTimeout(() => {
      document.body.removeChild(modalContainer);
      enableScrolling();
    }, 300);
  };

  modal.querySelector(".close-button").addEventListener("click", closeModal);
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  const applyButton = modal.querySelector(".apply-button");
  applyButton.addEventListener("click", () => {
    if (!isUserLoggedIn()) {
      window.location.href = "login.html";
      return;
    }

    if (hasUserApplied(job.id, user.id)) {
      failMessage("You have already applied for this job.");
    } else {
      applyToJob(job.id, user.id);
      successMessage("Application submitted successfully!");
      closeModal();
      handleApplyFilters();
      updateFilterCounts();
    }
  });
}

function closeModal() {
  const modal = document.querySelector(".modal");
  if (modal) {
    modal.classList.remove("active");
    setTimeout(() => {
      document.getElementById(id).innerHTML = "";
      enableScrolling();
    }, 300);

    document.removeEventListener("keydown", handleEscKey);
  }
}

function handleEscKey(e) {
  if (e.key === "Escape") {
    closeModal();
  }
}

function handleAppliedJobsToggle() {
  const toggleCheckbox = document.getElementById("show-applied-toggle");
  if (!toggleCheckbox) return;

  showAppliedJobs = toggleCheckbox.checked;
  localStorage.setItem("showAppliedJobs", showAppliedJobs.toString());
  handleApplyFilters();
  updateFilterCounts();
}

// setup
function setupEventListeners() {
  const toggleCheckbox = document.getElementById("show-applied-toggle");
  if (toggleCheckbox) {
    toggleCheckbox.addEventListener("change", handleAppliedJobsToggle);
  }
}

document.addEventListener("DOMContentLoaded", init);
