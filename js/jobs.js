createNav(false);
const jobData = [
  {
    id: 1,
    logo: "../assets/google.png",
    company: "Google",
    title: "Junior Software Engineer",
    location: "Mountain View, CA",
    tags: ["On-Site", "Full Time", "No Experience"],
    salary: "$4000/month",
  },
  {
    id: 2,
    logo: "../assets/microsoft.png",
    company: "Microsoft",
    title: "Intern - Software Developer",
    location: "Redmond, WA",
    tags: ["Remote", "Internship", "Student"],
    salary: "$2000/month",
  },
  {
    id: 3,
    logo: "../assets/linkedin.png",
    company: "LinkedIn",
    title: "Fresh - Frontend Developer React.js",
    location: "Imbaba, Giza",
    tags: ["On-Site", "Full-Time", "Fresh Graduate"],
    salary: "$52/month",
  },
  {
    id: 4,
    logo: "../assets/amazon.png",
    company: "Amazon",
    title: "Senior - AI Engineer",
    location: "Hawamdeya, Dawla",
    tags: ["On-Site", "Full Time", "Mid-Level"],
    salary: "$5000/month",
  },
  {
    id: 5,
    logo: "../assets/apple.png",
    company: "Apple",
    title: "iOS Developer",
    location: "Marg, Cairo",
    tags: ["On-Site", "Full Time", "Senior"],
    salary: "$6000/month",
  },
  {
    id: 6,
    logo: "../assets/facebook.png",
    company: "Meta",
    title: "Frontend Developer",
    location: "Helmeyat Alzaytoon, Cairo",
    tags: ["Remote", "Full Time", "Mid-Level"],
    salary: "$5500/month",
  },
  {
    id: 7,
    logo: "../assets/netflix.png",
    company: "Netflix",
    title: "Data Engineer",
    location: "Fayoum, Hassan",
    tags: ["On-Site", "Full Time", "Senior"],
    salary: "$7000/month",
  },
  {
    id: 8,
    logo: "../assets/tesla.png",
    company: "Tesla",
    title: "Software Engineer",
    location: "Om Khenan, Hawamdeya",
    tags: ["On-Site", "Full Time", "Mid-Level"],
    salary: "$4500/month",
  },
  {
    id: 9,
    logo: "../assets/uber.png",
    company: "Uber",
    title: "Mobile Developer",
    location: "San Francisco, CA",
    tags: ["Hybrid", "Full Time", "Mid-Level"],
    salary: "$4800/month",
  },
  {
    id: 10,
    logo: "../assets/Google.png",
    company: "Google",
    title: "Web Developer",
    location: "San Francisco, CA",
    tags: ["Remote", "Full Time", "Junior"],
    salary: "$4200/month",
  },
  {
    id: 11,
    logo: "../assets/UnderStair.png",
    company: "Under Stair",
    title: "Programmer",
    location: "October, Giza",
    tags: ["On-Site", "Full Time", "Senior"],
    salary: "$200/month",
  },
];

const filterData = [
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

function generateFilters() {
  const filtersContainer = document.getElementById("filters");
  filterData.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("filter-category");

    const categoryHeading = `<h2>${category.category}</h2>`;
    categoryDiv.innerHTML += categoryHeading;

    if (category.type === "range") {
      const rangeContainer = `
                <div class="range-container">
                    <div class="sliders-control">
                        <input id="from-slider" type="range" value="${category.defaultMin}" min="${category.min}" max="${category.max}"/>
                        <input id="to-slider" type="range" value="${category.defaultMax}" min="${category.min}" max="${category.max}"/>
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
      categoryDiv.innerHTML += rangeContainer;
    } else {
      category.filters.forEach((filter) => {
        const filterDiv = `
                    <div class="filter">
                        <div>
                            <input id="${filter.id}" type="checkbox" name="${filter.id}" value="${filter.label}">
                            <label for="${filter.id}">${filter.label}</label>
                        </div>
                        <a id="${filter.id}-count" class="count">${filter.count}</a>
                    </div>
                `;
        categoryDiv.innerHTML += filterDiv;
      });
    }

    filtersContainer.appendChild(categoryDiv);
  });

  const applyBtn = `
  <div class="button-container">
      <a class="button apply-button" id="apply-filters">Apply Filters</a>
      <a class="button clear-button" id="clear-filters">Clear Filters</a>
  </div>
`;

  filtersContainer.innerHTML += applyBtn;
}

function setupSalarySlider(jobList) {
  const fromSlider = document.getElementById("from-slider");
  const toSlider = document.getElementById("to-slider");
  const minValueLabel = document.getElementById("min-value");
  const maxValueLabel = document.getElementById("max-value");

  const minGap = 100;

  function updateLabels() {
    minValueLabel.textContent = `$${fromSlider.value}`;
    maxValueLabel.textContent = `$${toSlider.value}`;
  }

  function enforceRange() {
    if (parseInt(toSlider.value) - parseInt(fromSlider.value) <= minGap) {
      if (event.target === fromSlider) {
        fromSlider.value = parseInt(toSlider.value) - minGap;
      } else {
        toSlider.value = parseInt(fromSlider.value) + minGap;
      }
    }
    updateLabels();
  }

  fromSlider.addEventListener("input", enforceRange);
  toSlider.addEventListener("input", enforceRange);

  updateLabels();
}

function renderFilteredJobs(filteredJobs) {
  const jobCardsContainer = document.querySelector(".job-cards");
  jobCardsContainer.innerHTML = "";

  filteredJobs.forEach((job) => {
    const card = createJobCard(job);
    jobCardsContainer.appendChild(card);
  });

  document.getElementById("job-count").textContent = filteredJobs.length;
}

function filterJobsSearch() {
  const searchTerm = localStorage.getItem("searchTerm")?.toLowerCase() || "";

  if (!searchTerm) {
    renderFilteredJobs(jobData);
    return;
  }

  const filteredJobs = jobData.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.location.toLowerCase().includes(searchTerm)
    );
  });

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

  filterData.forEach((category) => {
    if (category.category === "Type Of Employment") key = "employmentType";
    else if (category.category === "Level") key = "level";

    if (category.type !== "range") {
      category.filters.forEach((filter) => {
        const checkbox = document.getElementById(filter.id);
        if (checkbox && checkbox.checked) {
          selectedFilters[key].push(filter.label);
        }
      });
    }
  });

  return selectedFilters;
}

function filterJobs(jobs, selectedFilters) {
  return jobs.filter((job) => {
    const isEmploymentTypeMatch =
      selectedFilters.employmentType.length === 0 ||
      selectedFilters.employmentType.some((type) => job.tags.includes(type));
    const isLevelMatch =
      selectedFilters.level.length === 0 ||
      selectedFilters.level.some((level) => job.tags.includes(level));
    const isSalaryMatch =
      job.salary.replace(/[^0-9]/g, "") >= selectedFilters.salary.min &&
      job.salary.replace(/[^0-9]/g, "") <= selectedFilters.salary.max;

    return isEmploymentTypeMatch && isLevelMatch && isSalaryMatch;
  });
}

function clearFilters() {
  filterData.forEach((category) => {
    if (category.type !== "range") {
      category.filters.forEach((filter) => {
        const checkbox = document.getElementById(filter.id);
        if (checkbox) {
          checkbox.checked = false;
        }
      });
    } else {
      document.getElementById("from-slider").value = category.defaultMin;
      document.getElementById("to-slider").value = category.defaultMax;
      document.getElementById(
        "min-value"
      ).textContent = `$${category.defaultMin}`;
      document.getElementById(
        "max-value"
      ).textContent = `$${category.defaultMax}`;
    }
  });

  renderFilteredJobs(jobData);
}

function updateFilterCounts() {
  filterData.forEach((category) => {
    if (!category.filters) return;
    category.filters.forEach((filter) => {
      filter.count = 0;
    });
  });

  jobData.forEach((job) => {
    filterData.forEach((category) => {
      if (!category.filters) return;

      category.filters.forEach((filter) => {
        if (job.tags.includes(filter.label)) {
          filter.count += 1;
        }
      });
    });
  });

  filterData.forEach((category) => {
    if (!category.filters) return;

    category.filters.forEach((filter) => {
      const countElement = document.getElementById(`${filter.id}-count`);
      if (countElement) {
        countElement.textContent = filter.count;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  generateFilters();
  setupSalarySlider();
  renderFilteredJobs(jobData);
  updateFilterCounts();

  const searchInput = document.querySelector(".search-input");
  const findButton = document.querySelector(".find-button");

  const savedSearchTerm = localStorage.getItem("searchTerm");
  if (savedSearchTerm && searchInput) {
    searchInput.value = savedSearchTerm;
    filterJobsSearch();
  }

  function handleSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      localStorage.setItem("searchTerm", searchTerm);
      filterJobsSearch();
    } else {
      localStorage.removeItem("searchTerm");
      filterJobsSearch();
    }
  }

  if (findButton) {
    findButton.addEventListener("click", handleSearch);
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    });
  }

  const applyFiltersBtn = document.getElementById("apply-filters");
  applyFiltersBtn.addEventListener("click", () => {
    const selectedFilters = getSelectedFilters();
    const filteredJobs = filterJobs(jobData, selectedFilters);
    renderFilteredJobs(filteredJobs);
  });

  const clearFiltersBtn = document.getElementById("clear-filters");
  clearFiltersBtn.addEventListener("click", () => {
    clearFilters();
  });
});
