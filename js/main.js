import { getCurrentUser } from "./auth.js";

import { getJobById } from "./job-data.js";

import { createNav } from "./nav.js";

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
                    <a class="apply-button button">Apply Now</a>
                    <a class="details-button button">Details</a>
                `
                }
            </div>
        </div>
    `;

  const template = document.createElement("template");
  template.innerHTML = html.trim();

  template.dataset.id = job.id;

  const element = template.content.firstChild;

  if (!(element instanceof HTMLElement)) {
    throw new Error("createJobCard did not return a valid DOM element");
  }

  return element;
}

export function disableScrolling() {
  document.body.style.overflow = "hidden";
}

export function enableScrolling() {
  document.body.style.overflow = "";
}

export function successMessage(message) {
  const messageContainer = document.createElement("div");
  messageContainer.className = "message-container success";
  messageContainer.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(messageContainer);

  setTimeout(() => {
    messageContainer.classList.add("hide");
    messageContainer.addEventListener("transitionend", () => {
      messageContainer.remove();
    });
  }, 3000);
}

export function failMessage(message) {
  const messageContainer = document.createElement("div");
  messageContainer.className = "message-container fail";
  messageContainer.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(messageContainer);

  setTimeout(() => {
    messageContainer.classList.add("hide");
    messageContainer.addEventListener("transitionend", () => {
      messageContainer.remove();
    });
  }, 3000);
}

// create navigation
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = getCurrentUser();
  console.log(currentUser);
  createNav(currentUser, currentUser?.role === "Admin");
});
