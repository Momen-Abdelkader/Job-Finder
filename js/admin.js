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
});
