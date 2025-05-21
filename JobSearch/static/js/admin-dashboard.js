const skillsContainer = document.getElementById("skills-tags");
const newSkillInput = document.querySelector(".add-skill-button");
let newSkill;
let uiSkills = [];
const map = new Map([
  ["Student", "student"],
  ["Fresh-Graduate", "fresh_graduate"],
  ["Junior", "junior"],
  ["Mid-Level", "mid_level"],
  ["Senior", "senior"],
  ["On-Site", "on_site"],
  ["Remote", "remote"],
  ["Hybrid", "hybrid"],
  ["Full-Time", "full_time"],
  ["Part-Time", "part_time"],
  ["Internship", "internship"]
]);

newSkillInput.addEventListener("click", function () {
  if (newSkill.value.trim() !== "") {
    const newSkills = newSkill.value.trim();

    if (!uiSkills.includes(newSkills)) {
      uiSkills.push(newSkills);
      refreshSkillTags();
    }

    newSkill.value = "";
  }
});

function refreshSkillTags() {
  skillsContainer.innerHTML = "";
  uiSkills.forEach((skill) => {
    const skillTag = document.createElement("span");
    skillTag.className = "tagg";
    skillTag.innerHTML = `${skill} <span class="tag-remove">x</span>`;

    skillTag.querySelector(".tag-remove").addEventListener("click", () => {
      uiSkills = uiSkills.filter((s) => s !== skill);
      refreshSkillTags();
    });

    skillsContainer.appendChild(skillTag);
  });
}

function showAddJobModal() {
  const modal = document.querySelector("#add-job-modal");
  const closeButton = document.querySelector("#add-job-modal .close");
  const cancelButton = document.querySelector("#cancel");
  const jobForm = document.querySelector(".job-form");
  
  modal.querySelector("#form-title").innerHTML = "Add New Job";
  jobForm.reset();
  uiSkills = [];
  newSkill = document.querySelector(".add-tag-input");

  modal.querySelector("#add-job-button").innerHTML = "Add Job";
  modal.querySelector("#add-job-button").setAttribute("name", "add-job");

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
    uiSkills = [];
    refreshSkillTags();
    jobForm.reset();
    enableScrolling();
  });

  cancelButton.addEventListener("click", () => {
    modal.style.display = "none";
    uiSkills = [];
    refreshSkillTags();
    jobForm.reset();
    enableScrolling();
  });

  jobForm.addEventListener("submit", function () {
    const skillsInput = document.createElement('input');
    skillsInput.type = 'hidden';
    skillsInput.name = 'skills';
    skillsInput.value = JSON.stringify(uiSkills);
    this.appendChild(skillsInput);
    
    modal.style.display = "none";
    enableScrolling();
    location.reload();
  });

  modal.style.display = "flex";
  disableScrolling();
}

function showEditJobModal(jobCard) {
  const modal = document.querySelector("#add-job-modal");
  const closeButton = document.querySelector("#add-job-modal .close");
  const cancelButton = document.querySelector("#cancel");

  modal.querySelector("#form-title").innerHTML = "Edit Job";

  let jobForm = document.querySelector(".job-form");

  uiSkills = [];

  jobForm.querySelector("#hidden-job-id-edit").value = jobCard.id;
  jobForm.reset();


  let workLocation = document.querySelector(
    `input[name="work-type"][value="${map.get(jobCard.querySelector("#job-work-type").textContent)}"]`
  );
  let jobType = document.querySelector(
    `input[name="job-type"][value="${map.get(jobCard.querySelector("#job-job-type").textContent)}"]`
  );
  let experience = document.querySelector(
    `input[name="experience"][value="${map.get(jobCard.querySelector("#job-exp").textContent)}"]`
  );

  jobForm.querySelector("#job-title").value = jobCard.querySelector(".job-title").innerHTML;
  jobForm.querySelector("#job-location").value = jobCard.querySelector(".job-location").innerHTML;  
  jobForm.querySelector("#job-salary").value = parseInt(jobCard.querySelector("#job-salary").innerHTML.replace(/\D/g, ""), 10) || 0;
  jobForm.querySelector("#job-description").value = jobCard.querySelector(".job-job-description").innerHTML;
  workLocation.checked = true;
  jobType.checked = true;
  experience.checked = true;

  jobCard.querySelectorAll(".skill-tag").forEach((tag) => {
    const skill = tag.childNodes[0].textContent.trim();
    if (!uiSkills.includes(skill)) {
      uiSkills.push(skill);
    }
  });

  refreshSkillTags();
  newSkill = document.querySelector(".add-tag-input");

  modal.querySelector("#add-job-button").innerHTML = "Confirm";
  modal.querySelector("#add-job-button").setAttribute("name", "edit-job");

  closeButton.addEventListener("click", () => {
    uiSkills = [];
    refreshSkillTags();
    jobForm.querySelector("#hidden-job-id-edit").value.remove;
    modal.style.display = "none";
    jobForm.reset();
    enableScrolling();
  });

  cancelButton.addEventListener("click", () => {
    uiSkills = [];
    refreshSkillTags();
    jobForm.querySelector("#hidden-job-id-edit").value.remove;
    modal.style.display = "none";
    jobForm.reset();
    enableScrolling();
  });

  jobForm.addEventListener("submit", function () {
    modal.style.display = "none";
    enableScrolling();
  });

  modal.style.display = "flex";
  disableScrolling();
}

function showDeleteJobModal(jobCard) {
  const modal = document.getElementById("delete-job-modal");
  const confirmButton = modal.querySelector("#confirm-delete");
  const cancelButton = modal.querySelector("#cancel-delete");
  const closeButton = modal.querySelector(".close");
  const hiddenJob = document.querySelector("#hidden-job-id");

  hiddenJob.value = jobCard.id;
  confirmButton.addEventListener("click", () => {
    jobCard.remove();
    modal.style.display = "none";
  });

  cancelButton.addEventListener("click", () => {
    hiddenJob.value.remove;
    modal.style.display = "none";
    uiSkills = [];
    refreshSkillTags();
    enableScrolling();
  });

  closeButton.addEventListener("click", () => {
    hiddenJob.value.remove;
    modal.style.display = "none";
    uiSkills = [];
    refreshSkillTags();
    enableScrolling();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      hiddenJob.value.remove;
      modal.style.display = "none";
      enableScrolling();
    }
  });

  modal.style.display = "flex";
  disableScrolling();
}

function addSkillsToForm() {
  let skillsInput = document.querySelector('input[name="skillz"]');
  if (!skillsInput) {
    skillsInput = document.createElement('input');
    skillsInput.type = 'hidden';
    skillsInput.name = 'skillz';
    document.querySelector('.job-form').appendChild(skillsInput);
  }
  skillsInput.value = JSON.stringify(uiSkills);
  uiSkills = [];
}

const jobForm = document.querySelector('.job-form');
if (jobForm) {
  jobForm.addEventListener('submit', addSkillsToForm);
}

function applicantProfileSetup(user) {

  fetch('profile.html')
  .then(response => response.text())
  .then(html => {
    const parser = new DOMParser();
    const anotherDoc = parser.parseFromString(html, 'text/html');

  const applicantInfo = anotherDoc.querySelector('.content'); 

  applicantInfo.querySelector('#email').innerHTML = user.email;
  applicantInfo.querySelector('#fullname').innerHTML = user.name;
  applicantInfo.querySelector('#phone').innerHTML = user.phone;
  applicantInfo.querySelector('#location').innerHTML = user.location;
  applicantInfo.querySelector('#job-title').innerHTML = user.jobTitle;
  applicantInfo.querySelector('#resume').innerHTML = "Resume";
  applicantInfo.querySelector('#resume').href = user.resume;
  uiSkills = user.skills;

  const skillsContainer = document.querySelector('#skills-tags');
  skillsContainer.innerHTML = "";
  uiSkills.forEach(skill => {
    const skillTag = document.createElement('span');
    skillTag.className = 'skill-tag';
    skillTag.innerHTML = skill;
    
    skillsContainer.appendChild(skillTag);
  });
});
};

async function fetchJobApplications(jobId) {
    try {
        const response = await fetch(`/api/job/${jobId}/applications/`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.applications;
    } catch (error) {
        console.error('Error fetching job applications:', error);
        return []; // Return empty array on error
    }
}

async function updateApplicationStatus(applicationId, newStatus) {
    try {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        const response = await fetch(`/api/application/${applicationId}/update-status/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                status: newStatus
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update status');
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error updating application status:', error);
        throw error; // Re-throw to let caller handle it
    }
}

async function showJobApplicantsModal(jobId) {
  const modal = document.getElementById("job-applicants-modal");
  const closeButton = modal.querySelector(".close");
  const applicantsList = modal.querySelector(".applicants-list");
  const okButton = modal.querySelector("#close-applicants-modal");

  const applications = await fetchJobApplications(jobId);
  applicantsList.innerHTML = "";

  applications.forEach((application) => {
    const applicationDataHTML = `
    <div class="applicant-card" id="${application.id}">
      <div class="applicant-info">
        <img class="applicant-image" src="${application.profile_photo_url}" alt="${application.applicant_name}'s image">
        <h3 class="applicant-name">${application.applicant_name}</h3>
        <p class="applicant-email">${application.applicant_email}</p>
        <p class="applicant-date">${application.application_date}</p>
        <select class="applicant-status">
          <option ${
            application.application_status === "Pending" ? "selected" : ""
          }>Pending</option>
          <option ${
            application.application_status === "Accepted" ? "selected" : ""
          }>Accepted</option>
          <option ${
            application.application_status === "Rejected" ? "selected" : ""
          }>Rejected</option>
        </select>
      </div>
      <div class="applicant-actions">
        <a class="button resume-button"
          ${application.resume_url ? `href="${application.resume_url}" target="_blank"` : ""}>
          View Resume
        </a>
        <a class="button profile-button" href="/profile-view/${application.applicant_id}" target="_blank">View Profile</a>
      </div>
    </div>`;

    const listItem = document.createElement("li");
    listItem.classList.add("applicant-item");
    listItem.innerHTML = applicationDataHTML;
    applicantsList.appendChild(listItem);

    const statusSelect = listItem.querySelector(".applicant-status");
    statusSelect.addEventListener("change", async (event) => {
      const newStatus = event.target.value;
      try {
        await updateApplicationStatus(application.id, newStatus);
        console.log(`Application status updated to ${newStatus}`);
      } catch (error) {
        console.error('Error updating application status:', error);
      }
    });

  });

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
    enableScrolling();
  });

  okButton.addEventListener("click", () => {
    modal.style.display = "none";
    enableScrolling();
  });



  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      enableScrolling();
    }
  });

  modal.style.display = "flex";
  disableScrolling();
}

document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.querySelector("#add-button");

  if (addButton) {
    addButton.addEventListener("click", () => {
      uiSkills = [];
      showAddJobModal();
    });
  }
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-button')) {
        const jobCard = event.target.closest('.job-card');
        const jobId = jobCard.id;
        console.log('Delete job with ID:', jobId);
        showDeleteJobModal(jobCard);
    }
    
    if (event.target.classList.contains('edit-button')) {
        const jobCard = event.target.closest('.job-card');
        const jobId = jobCard.id;
        console.log('Edit job with ID:', jobId);
        showEditJobModal(jobCard);
    }

    if (event.target.classList.contains('applicants-button')) {
        const jobCard = event.target.closest('.job-card');
        const jobId = jobCard.id;
        console.log('View applicants for job with ID:', jobId);
        showJobApplicantsModal(jobId);
    }
});

