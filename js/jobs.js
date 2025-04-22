createNav(false);
const jobData = [
  {
    id: 1,
    logo: "../assets/google.png",
    company: "Google",
    title: "Junior Software Engineer",
    location: "Mountain View, CA",
    salary: "$4000/month",
    jobType: "Full Time",
    workMode: "Remote",
    skills: ["JavaScript", "Python", "Problem Solving"],
    experienceLevel: "Junior",
    postedAt: "2025-04-20",
    description:
      "Join Google's early career engineering team to work on high-impact projects using modern technologies. No experience required, but a strong foundation in programming is expected.",
  },
  {
    id: 2,
    logo: "../assets/microsoft.png",
    company: "Microsoft",
    title: "Intern - Software Developer",
    location: "Redmond, WA",
    salary: "$2000/month",
    jobType: "Internship",
    workMode: "Remote",
    skills: ["C#", ".NET", "Teamwork"],
    experienceLevel: "Intern",
    postedAt: "2025-04-19",
    description:
      "Microsoft's internship program offers hands-on development experience with guidance from senior engineers. Ideal for students interested in cloud and software tools.",
  },
  {
    id: 3,
    logo: "../assets/linkedin.png",
    company: "LinkedIn",
    title: "Fresh - Frontend Developer React.js",
    location: "Imbaba, Giza",
    salary: "$52/month",
    jobType: "Part Time",
    workMode: "On-Site",
    skills: ["React.js", "HTML", "CSS"],
    experienceLevel: "Fresh Graduate",
    postedAt: "2025-04-17",
    description:
      "Kickstart your frontend career at LinkedIn. You'll contribute to UI development using React, working with a local engineering team to enhance user experience.",
  },
  {
    id: 4,
    logo: "../assets/amazon.png",
    company: "Amazon",
    title: "Senior - AI Engineer",
    location: "Hawamdeya, Dawla",
    salary: "$5000/month",
    jobType: "Full Time",
    workMode: "On-Site",
    skills: ["Machine Learning", "Python", "AWS"],
    experienceLevel: "Mid-Level",
    postedAt: "2025-04-21",
    description:
      "Join Amazon’s AI team to develop intelligent systems at scale. Ideal for engineers with hands-on experience in machine learning models and cloud services.",
  },
  {
    id: 5,
    logo: "../assets/apple.png",
    company: "Apple",
    title: "iOS Developer",
    location: "Marg, Cairo",
    salary: "$6000/month",
    jobType: "Full Time",
    workMode: "On-Site",
    skills: ["Swift", "Xcode", "UI/UX"],
    experienceLevel: "Senior",
    postedAt: "2025-04-18",
    description:
      "Design and develop iOS applications for Apple’s growing software ecosystem. The ideal candidate has experience shipping high-quality mobile apps.",
  },
  {
    id: 6,
    logo: "../assets/facebook.png",
    company: "Meta",
    title: "Frontend Developer",
    location: "Helmeyat Alzaytoon, Cairo",
    salary: "$5500/month",
    jobType: "Full Time",
    workMode: "Remote",
    skills: ["React", "JavaScript", "Redux"],
    experienceLevel: "Mid-Level",
    postedAt: "2025-04-22",
    description:
      "Work remotely with Meta's frontend team to build performant and scalable web interfaces using React and modern JavaScript technologies.",
  },
  {
    id: 7,
    logo: "../assets/netflix.png",
    company: "Netflix",
    title: "Data Engineer",
    location: "Fayoum, Hassan",
    salary: "$7000/month",
    jobType: "Full Time",
    workMode: "On-Site",
    skills: ["SQL", "Big Data", "Spark"],
    experienceLevel: "Senior",
    postedAt: "2025-04-20",
    description:
      "As a Data Engineer at Netflix, you’ll develop robust data pipelines and optimize systems for content delivery and recommendation algorithms.",
  },
  {
    id: 8,
    logo: "../assets/tesla.png",
    company: "Tesla",
    title: "Software Engineer",
    location: "Om Khenan, Hawamdeya",
    salary: "$4500/month",
    jobType: "Full Time",
    workMode: "On-Site",
    skills: ["C++", "Embedded Systems", "Python"],
    experienceLevel: "Mid-Level",
    postedAt: "2025-04-21",
    description:
      "Develop embedded software for Tesla’s autonomous systems and in-vehicle applications. Requires experience with low-level programming and performance optimization.",
  },
  {
    id: 9,
    logo: "../assets/uber.png",
    company: "Uber",
    title: "Mobile Developer",
    location: "San Francisco, CA",
    salary: "$4800/month",
    jobType: "Full Time",
    workMode: "Hybrid",
    skills: ["Kotlin", "Swift", "REST APIs"],
    experienceLevel: "Mid-Level",
    postedAt: "2025-04-16",
    description:
      "Contribute to Uber’s mobile app development, delivering high-performance features across Android and iOS. Prior experience with mobile frameworks required.",
  },
  {
    id: 10,
    logo: "../assets/Google.png",
    company: "Google",
    title: "Web Developer",
    location: "San Francisco, CA",
    salary: "$4200/month",
    jobType: "Full Time",
    workMode: "Remote",
    skills: ["JavaScript", "HTML", "CSS", "Web Performance"],
    experienceLevel: "Junior",
    postedAt: "2025-04-18",
    description:
      "Work remotely on Google's web services and tools, improving UX and frontend performance using modern web technologies. Ideal for junior developers with strong fundamentals.",
  },
  {
    id: 11,
    logo: "../assets/UnderStair.png",
    company: "Under Stair",
    title: "Programmer",
    location: "October, Giza",
    salary: "$200/month",
    jobType: "Full Time",
    workMode: "On-Site",
    skills: ["C", "Assembly", "Debugging"],
    experienceLevel: "Senior",
    postedAt: "2025-04-15",
    description:
      "Seeking a highly experienced programmer to maintain legacy systems and optimize performance-critical code. Deep understanding of low-level programming is a must.",
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
      selectedFilters.employmentType.some((type) =>
        job.jobType.toLowerCase().includes(type.toLowerCase())
      );
    const isWorkModeMatch =
      selectedFilters.employmentType.length === 0 ||
      selectedFilters.employmentType.some((type) =>
        job.workMode.toLowerCase().includes(type.toLowerCase())
      );
    const isLevelMatch =
      selectedFilters.level.length === 0 ||
      selectedFilters.level.some((level) =>
        job.experienceLevel.toLowerCase().includes(level.toLowerCase())
      );
    const isSalaryMatch =
      job.salary.replace(/[^0-9]/g, "") >= selectedFilters.salary.min &&
      job.salary.replace(/[^0-9]/g, "") <= selectedFilters.salary.max;
    return (
      (isEmploymentTypeMatch || isWorkModeMatch) &&
      isLevelMatch &&
      isSalaryMatch
    );
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
        if (category.category === "Type Of Employment") {
          if (
            job.jobType.toLowerCase() === filter.label.toLowerCase() ||
            job.workMode.toLocaleLowerCase() === filter.label.toLowerCase()
          ) {
            filter.count += 1;
          }
        } else if (category.category === "Level") {
          if (
            job.experienceLevel.toLowerCase() === filter.label.toLowerCase()
          ) {
            filter.count += 1;
          }
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
