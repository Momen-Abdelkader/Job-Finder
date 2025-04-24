import {
  getJobData,
  getJobById,
  updateJob,
  addJob,
  deleteJob,
} from "./job-data.js";

import { getCurrentUser } from "./auth.js";

import { createJobCard } from "./main.js";

// constants
const FILTER_CONFIG = [
  {
    category: "Type Of Employment",
    filters: [
      { id: "full-time", label: "Full Time", count: 0 },
      { id: "part-time", label: "Part Time", count: 0 },
      { id: "internship", label: "Internship", count: 0 },
      { id: "remote", label: "Remote", count: 0 },
      { id: "onsite", label: "On-Site", count: 0 },
    ],
  },
  {
    category: "Level",
    filters: [
      { id: "senior", label: "Senior", count: 0 },
      { id: "midlevel", label: "Mid-Level", count: 0 },
      { id: "junior", label: "Junior", count: 0 },
      { id: "fresh-grad", label: "Fresh Graduate", count: 0 },
      { id: "student", label: "Student", count: 0 },
    ],
  },
  {
    category: "Salary",
    type: "range",
    min: 0,
    max: 20000,
    step: 500,
    defaultMin: 0,
    defaultMax: 20000,
  },
];

const MIN_SALARY_GAP = 100;

const jobData = getJobData();

const currentUser = getCurrentUser();

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
  generateFilters();
  setupSalarySlider();
  renderFilteredJobs(jobData);
  updateFilterCounts();
  setupEventListeners();
  restoreSearchTerm();
}

// filters
function generateFilters() {
  FILTER_CONFIG.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("filter-category");
    categoryDiv.innerHTML = createCategoryHeading(category);

    if (category.type === "range") {
      categoryDiv.innerHTML += createRangeFilter(category);
    } else {
      category.filters.forEach((filter) => {
        categoryDiv.innerHTML += createCheckboxFilter(filter);
      });
    }

    domElements.filtersContainer.appendChild(categoryDiv);
  });

  domElements.filtersContainer.innerHTML += createActionButtons();
}

function createCategoryHeading(category) {
  return `<h2>${category.category}</h2>`;
}

function createRangeFilter(category) {
  return `
    <div class="range-container">
      <div class="sliders-control">
        <input id="from-slider" type="range" value="${category.defaultMin}" 
               min="${category.min}" max="${category.max}"/>
        <input id="to-slider" type="range" value="${category.defaultMax}" 
               min="${category.min}" max="${category.max}"/>
      </div>
      <div class="form-control">
        <div class="control-container">
          <div class="min-label">Min</div>
          <a id="min-value">${category.defaultMin}</a>
        </div>
        <div class="control_container">
          <div class="max-label">Max</div>
          <a id="max-value">${category.defaultMax}</a>
        </div>
      </div>
    </div>`;
}

function createCheckboxFilter(filter) {
  return `
    <div class="filter">
      <div>
        <input id="${filter.id}" type="checkbox" name="${filter.id}" value="${filter.label}">
        <label for="${filter.id}">${filter.label}</label>
      </div>
      <a id="${filter.id}-count" class="count">${filter.count}</a>
    </div>`;
}

function createActionButtons() {
  return `
    <div class="button-container">
      <a class="button apply-button" id="apply-filters">Apply Filters</a>
      <a class="button clear-button" id="clear-filters">Clear Filters</a>
    </div>`;
}

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

// rendering job cards
function renderFilteredJobs(jobs) {
  domElements.jobCardsContainer.innerHTML = "";
  jobs.forEach((job) =>
    domElements.jobCardsContainer.appendChild(createJobCard(job))
  );
  domElements.jobCount.textContent = jobs.length;
}

// filteration logic
function filterJobsSearch() {
  const searchTerm = localStorage.getItem("searchTerm")?.toLowerCase() || "";
  if (!searchTerm) return renderFilteredJobs(jobData);

  const filteredJobs = jobData.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.location.toLowerCase().includes(searchTerm)
  );

  renderFilteredJobs(filteredJobs);
}

function getSelectedFilters() {
  const selectedFilters = {
    employmentType: [],
    level: [],
    salary: {
      min: parseInt(document.getElementById("from-slider").value),
      max: parseInt(document.getElementById("to-slider").value),
    },
  };

  FILTER_CONFIG.forEach((category) => {
    if (category.type === "range") return;

    const key =
      category.category === "Type Of Employment" ? "employmentType" : "level";

    category.filters.forEach((filter) => {
      const checkbox = document.getElementById(filter.id);
      if (checkbox?.checked) selectedFilters[key].push(filter.label);
    });
  });

  return selectedFilters;
}

function filterJobs(jobs, { employmentType, level, salary }) {
  return jobs.filter((job) => {
    const salaryValue = parseInt(job.salary.replace(/[^0-9]/g, ""));

    return (
      (employmentType.length === 0 ||
        employmentType.some(
          (type) =>
            job.jobType.toLowerCase().includes(type.toLowerCase()) ||
            job.workMode.toLowerCase().includes(type.toLowerCase())
        )) &&
      (level.length === 0 ||
        level.some((lvl) =>
          job.experienceLevel.toLowerCase().includes(lvl.toLowerCase())
        )) &&
      salaryValue >= salary.min &&
      salaryValue <= salary.max
    );
  });
}

// filter interactions
function clearFilters() {
  FILTER_CONFIG.forEach((category) => {
    if (category.type === "range") {
      document.getElementById("from-slider").value = category.defaultMin;
      document.getElementById("to-slider").value = category.defaultMax;
      document.getElementById(
        "min-value"
      ).textContent = `$${category.defaultMin}`;
      document.getElementById(
        "max-value"
      ).textContent = `$${category.defaultMax}`;
    } else {
      category.filters.forEach((filter) => {
        const checkbox = document.getElementById(filter.id);
        if (checkbox) checkbox.checked = false;
      });
    }
  });

  localStorage.removeItem("searchTerm");
  domElements.searchInput.value = "";

  renderFilteredJobs(jobData);
}

function updateFilterCounts() {
  // Get search-filtered jobs
  const searchTerm = localStorage.getItem("searchTerm")?.toLowerCase() || "";
  const filteredBySearch = searchTerm
    ? jobData.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.location.toLowerCase().includes(searchTerm)
      )
    : jobData;

  // Reset all counts
  FILTER_CONFIG.forEach((category) => {
    if (category.filters)
      category.filters.forEach((filter) => (filter.count = 0));
  });

  // Count within the search-filtered jobs
  filteredBySearch.forEach((job) => {
    FILTER_CONFIG.forEach((category) => {
      if (!category.filters) return;

      category.filters.forEach((filter) => {
        if (category.category === "Type Of Employment") {
          if (
            job.jobType.toLowerCase() === filter.label.toLowerCase() ||
            job.workMode.toLowerCase() === filter.label.toLowerCase()
          )
            filter.count++;
        } else if (category.category === "Level") {
          if (
            job.experienceLevel.toLowerCase() === filter.label.toLowerCase()
          ) {
            filter.count++;
          }
        }
      });
    });
  });

  // Update DOM counts
  FILTER_CONFIG.forEach((category) => {
    if (!category.filters) return;

    category.filters.forEach((filter) => {
      const countElement = document.getElementById(`${filter.id}-count`);
      if (countElement) countElement.textContent = filter.count;
    });
  });
}

// event handlers
function handleSearch() {
  const searchTerm = domElements.searchInput.value.trim();
  if (searchTerm) {
    localStorage.setItem("searchTerm", searchTerm);
  } else {
    localStorage.removeItem("searchTerm");
  }

  handleApplyFilters();
  updateFilterCounts();
}

function handleApplyFilters() {
  const searchTerm = localStorage.getItem("searchTerm")?.toLowerCase() || "";
  const filters = getSelectedFilters();

  const filtered = filterJobs(jobData, filters).filter((job) => {
    return (
      !searchTerm ||
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.location.toLowerCase().includes(searchTerm)
    );
  });

  renderFilteredJobs(filtered);
}

// setup
function setupEventListeners() {
  domElements.findButton?.addEventListener("click", handleSearch);
  domElements.searchInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  document
    .getElementById("apply-filters")
    ?.addEventListener("click", handleApplyFilters);
  document
    .getElementById("clear-filters")
    ?.addEventListener("click", clearFilters);
}

function restoreSearchTerm() {
  const savedSearchTerm = localStorage.getItem("searchTerm");
  if (savedSearchTerm && domElements.searchInput) {
    domElements.searchInput.value = savedSearchTerm;
  }
  handleApplyFilters();
}

// document loaded
document.addEventListener("DOMContentLoaded", init);

// // Add this function to create job cards with click handlers
// function createJobCard(job) {
//   const card = document.createElement("div");
//   card.classList.add("job-card");
//   card.dataset.id = job.id;

//   card.innerHTML = `
//     <div class="company-info">
//       <img src="${job.logo}" alt="${job.company} logo" class="company-logo">
//       <h2 class="company-name">${job.company}</h2>
//     </div>
//     <div class="job-info">
//       <h4 class="job-title">${job.title}</h4>
//       <p class="job-location">${job.location}</p>
//       <p class="job-salary">${job.salary}</p>
//     </div>
//     <ul class="tags">
//       <li class="tag">${job.jobType}</li>
//       <li class="tag">${job.workMode}</li>
//       <li class="tag">${job.experienceLevel}</li>

//     </ul>
//     <div class="buttons">
//       <a href="#" class="button apply-button">Apply Now</a>
//       <a href="#" class="button details-button">View Details</a>
//     </div>
//   `;

//   // Add click event for the entire card
//   card.addEventListener("click", (e) => {
//     if (e.target.classList.contains("button")) {
//       return;
//     }
//     showDetailsModal(job);
//   });

//   // Add click event for details button
//   card.querySelector(".details-button").addEventListener("click", (e) => {
//     e.preventDefault();
//     showDetailsModal(job);
//   });

//   return card;
// }

function showDetailsModal(job) {
  const modalContainer = document.createElement('div');
  modalContainer.id = 'modal-container';
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  // Format the skills as HTML list items
  const skillsHTML = job.skills.map(skill => `<li class="tag">${skill}</li>`).join('');
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">&times;</span>
      <div class="modal-header">
        <div class="company-info-large">
          <img src="${job.logo}" alt="${job.company} logo" class="company-logo-large">
          <div>
            <h2 class="company-name">${job.company}</h2>
            <h1 class="job-title-large">${job.title}</h1>
            <p class="job-location">${job.location}</p>
            <p class="job-posted">Posted: ${new Date(job.postedAt).toLocaleDateString()}</p>
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
        <a href="#" class="button apply-button large-button">Apply Now</a>
      </div>
    </div>
  `;

  document.body.appendChild(modalContainer);
  modalContainer.appendChild(modal);
  
  // Force reflow to enable transition
  void modalContainer.offsetWidth;
  
  // Activate modal
  modalContainer.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Close handlers
  const closeModal = () => {
    modalContainer.classList.remove('active');
    setTimeout(() => {
      document.body.removeChild(modalContainer);
      document.body.style.overflow = '';
    }, 300);
  };

  modal.querySelector('.close-button').addEventListener('click', closeModal);
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// Helper function to format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function closeModal() {
  const modal = document.querySelector(".modal");
  if (modal) {
    modal.classList.remove("active");
    setTimeout(() => {
      document.getElementById("modal-container").innerHTML = "";
      document.body.style.overflow = ""; // Re-enable scrolling
    }, 300);
    
    // Remove ESC key event listener
    document.removeEventListener("keydown", handleEscKey);
  }
}

function handleEscKey(e) {
  if (e.key === "Escape") {
    closeModal();
  }
}