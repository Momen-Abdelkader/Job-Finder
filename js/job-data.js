const jobData = [
  {
    id: 1,
    logo: "../assets/google.png",
    company: "Google",
    companyId: 1001,
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
    companyId: 1002,
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
    companyId: 1003,
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
    companyId: 1004,
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
    companyId: 1005,
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
    logo: "../assets/meta.png",
    company: "Meta",
    companyId: 1006,
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
    companyId: 1007,
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
    companyId: 1008,
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
    companyId: 1009,
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
    companyId: 1001,
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
    companyId: 10010,
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

if (
  !localStorage.getItem("jobData") ||
  localStorage.getItem("jobData") === "[]" // TODO: remove this line after testing
) {
  localStorage.setItem("jobData", JSON.stringify(jobData));
}

function getJobData() {
  return JSON.parse(localStorage.getItem("jobData") || "[]");
}

function getJobsByCompany(companyId) {
  const jobs = getJobData();
  return jobs.filter((job) => job.companyId === companyId);
}

function getJobById(jobId) {
  const jobs = getJobData();
  return jobs.find((job) => job.id === jobId);
}

function addJob(job) {
  const jobs = getJobData();
  job.id = jobs.length ? jobs[jobs.length - 1].id + 1 : 1;
  jobs.push(job);
  localStorage.setItem("jobData", JSON.stringify(jobs));
}

function updateJob(updatedJob) {
  const jobs = getJobData();
  const index = jobs.findIndex((job) => job.id === updatedJob.id);
  if (index !== -1) {
    jobs[index] = updatedJob;
    localStorage.setItem("jobData", JSON.stringify(jobs));
  }
}

function deleteJob(jobId) {
  const jobs = getJobData();
  const updatedJobs = jobs.filter((job) => job.id !== jobId);
  localStorage.setItem("jobData", JSON.stringify(updatedJobs));
}
