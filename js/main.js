import { getCurrentUser } from "./auth.js";

export function createJobCard(job, isAdmin = false) {
import { getJobById } from "./job-data.js";

export function createJobCard(job, isAdmin = false) {
  const html = `
        <div class="job-card">
            <div class="company-info">
                <img src="${job.logo}" class="company-logo">
                <h4 class="company-name">${job.company}</h4>                
            </div>
            <div class="job-info">
                <h4 class="job-title">${job.title}</h4>
                <a class="job-location">${job.location}</a>
            </div>
            <ul class="tags">
                <li><a class="tag">${job.workMode}</a></li>
                <li><a class="tag">${job.jobType}</a></li> 
                <li><a class="tag">${job.experienceLevel}</a></li>
                <li><a class="tag">${job.salary}</a></li>
            </ul>
            <div class="buttons">
                ${
                  isAdmin
                    ? `
                    <a class="edit-button button">Edit</a>
                    <a class="applicants-button button"">Applicants</a>
                    <a class="delete-button button"">Delete</a>
                `
                    : `
                    <a class="apply-button button" >Apply Now</a>
                    <a class="details-button button" >Details</a>
                `
                }
            </div>
        </div>
    `;

  const template = document.createElement("template");
  template.innerHTML = html.trim();

  template.dataset.id=job.id;

  if(!isAdmin){
    const detailsbutton = template.querySelector(".details-button");
    detailsbutton.addEventListener("click",(e)=>{showDetailsModal(job)});
  }

  const element = template.content.firstChild;

  if (!(element instanceof HTMLElement)) {
    throw new Error("createJobCard did not return a valid DOM element");
  }

  return element;
}

function disableScrolling() {
  document.body.style.overflow = "hidden";
}

function enableScrolling() {
  document.body.style.overflow = "";
}

// create navigation
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = getCurrentUser();
  console.log(currentUser);
  createNav(currentUser, currentUser?.role === "Admin");
});
