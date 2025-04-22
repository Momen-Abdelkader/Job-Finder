import { jobData } from "./job-data.js";

createNav(true, true);

const jobCardsContainer = document.querySelector(".job-cards");

jobData.forEach((job) => {
  const card = createJobCard(job, "admin");
  jobCardsContainer.appendChild(card);
});
