const skillsContainer = document.getElementById("skills-tags");
const newSkillInput = document.querySelector(".add-skill-button");
let newSkill;
let uiSkills = [];
// Tags input listeners
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
    skillTag.className = "skill-tag";
    skillTag.innerHTML = `${skill} <span class="tag-remove">x</span>`;

    // Add event listener to remove button (UI only)
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

  uiSkills = [];
  newSkill = document.querySelector(".add-tag-input");

  modal.querySelector("#add-job-button").innerHTML = "Add Job";

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
    jobForm.reset();
    enableScrolling();
  });

  cancelButton.addEventListener("click", () => {
    modal.style.display = "none";
    jobForm.reset();
    enableScrolling();
  });

  jobForm.addEventListener("submit", function () {
    // const workLocation = document.querySelector(
    //   'input[name="workLocation"]:checked'
    // ).value;
    // const jobType = document.querySelector(
    //   'input[name="jobType"]:checked'
    // ).value;
    // const experience = document.querySelector(
    //   'input[name="experience"]:checked'
    // ).value;

    // const jobArr = getJobsByCompany(user.id);
    // let maxID = 0;
    // for (let i = 0; i < jobArr.length; i++) {
    //   if (maxID < jobArr[i].id) maxID = jobArr[i].id;
    // }

    // const newJob = {
    //   id: maxID + 1,
    //   logo: "../assets/temp-profile.webp", // TODO: implement profile image link
    //   company: user.companyName,
    //   companyId: user.id,
    //   title: jobForm.querySelector("#job-title").value,
    //   location: jobForm.querySelector("#job-location").value,
    //   salary: "$" + jobForm.querySelector("#job-salary").value + "/month",
    //   jobType: jobType,
    //   workMode: workLocation,
    //   skills: uiSkills, 
    //   experienceLevel: experience,
    //   postedAt: new Date(),
    //   description: jobForm.querySelector("#job-description").value,
    // };
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

  let jobForm = document.querySelector(".job-form");

  let jobList;

  // fetch('/admin-dashboard/')  // URL to your Django view
  //   .then(response => {
  //       if (!response.ok) {
  //           throw new Error('Network response was not ok');
  //       }
  //       return response.json();  // Parse JSON response
  //   })
  //   .then(data => {
  //       console.log(data);  // Process your Django model data
  //       jobList = data;
  //   })
  //   .catch(error => {
  //       console.error('There was a problem:', error);
  //   });



  // let workLocation = document.querySelector(
  //   `input[name="workLocation"][value=${job.workMode}]`
  // );
  // let jobType = document.querySelector(
  //   'input[name="jobType"][value="' + job.jobType + '"]'
  // );
  // let experience = document.querySelector(
  //   'input[name="experience"][value="' + job.experienceLevel + '"]'
  // );

  // jobForm.querySelector("#job-title").value = job.title;
  // jobForm.querySelector("#job-location").value = job.location;
  // jobForm.querySelector("#job-salary").value = job.salary.replace(/\D/g, "");
  // jobForm.querySelector("#job-description").value = job.description;
  // workLocation.checked = true;
  // jobType.checked = true;
  // experience.checked = true;

  // uiSkills = job.skills;
  // refreshSkillTags();
  newSkill = document.querySelector(".add-tag-input");

  modal.querySelector("#add-job-button").innerHTML = "Confirm";

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
    jobForm.reset();
    enableScrolling();
  });

  cancelButton.addEventListener("click", () => {
    modal.style.display = "none";
    jobForm.reset();
    enableScrolling();
  });

  jobForm.addEventListener("submit", function () {
    // const workLocation = document.querySelector(
    //   'input[name="workLocation"]:checked'
    // ).value;
    // const jobType = document.querySelector(
    //   'input[name="jobType"]:checked'
    // ).value;
    // const experience = document.querySelector(
    //   'input[name="experience"]:checked'
    // ).value;

    // const newJob = {
    //   id: job.id,
    //   logo: job.logo,
    //   company: job.company,
    //   companyId: job.companyId,
    //   title: jobForm.querySelector("#job-title").value,
    //   location: jobForm.querySelector("#job-location").value,
    //   salary: "$" + jobForm.querySelector("#job-salary").value + "/month",
    //   jobType: jobType,
    //   workMode: workLocation,
    //   skills: uiSkills,
    //   experienceLevel: experience,
    //   postedAt: new Date(),
    //   description: jobForm.querySelector("#job-description").value,
    // };

    // updateJob(newJob);

    // jobForm.reset();
    modal.style.display = "none";
    enableScrolling();
    // location.reload();
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
    enableScrolling();
  });

  closeButton.addEventListener("click", () => {
    hiddenJob.value.remove;
    modal.style.display = "none";
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

function showJobApplicantsModal(job) {
  const modal = document.getElementById("job-applicants-modal");
  const closeButton = modal.querySelector(".close");
  const applicantsList = modal.querySelector(".applicants-list");
  const okButton = modal.querySelector("#close-applicants-modal");

  const applications = getApplicationByJobID(job.id);
  applicantsList.innerHTML = "";

  applications.forEach((application) => {
    const applicant = getApplicationByUserID(application.applicantId);
    const applicationDataHTML = `
    <div class="applicant-card" id="${application.applicantId}">
      <div class="applicant-info">
        <img class="applicant-image" src="../assets/profile.webp" alt="${
          applicant.name
        } image">
        <h3 class="applicant-name">${applicant.name}</h3>
        <p class="applicant-email">${applicant.email}</p>
        <p class="applicant-date">${applicant.applicationDate}</p>
        <select class="applicant-status">
          <option ${
            application.status === "Pending" ? "selected" : ""
          }>Pending</option>
          <option ${
            application.status === "Accepted" ? "selected" : ""
          }>Accepted</option>
          <option ${
            application.status === "Rejected" ? "selected" : ""
          }>Rejected</option>
        </select>
      </div>
      <div class="applicant-actions">
        <a class="button resume-button" href="${
          applicant.resumeUrl
        }" target="_blank">View Resume</a>
        <a class="button profile-button" href="../html/profile.html?userId=${
          applicant.applicantId
        }" target="_blank">View Profile</a>
      </div>
    </div>`;

    

    // <a class="button profile-button" href="../html/profile.html?userId=${  // NOTE: this will be used in the next phase
    //   applicant.applicantId
    // }" target="_blank">View Profile</a>

    const listItem = document.createElement("li");
    listItem.classList.add("applicant-item");
    listItem.innerHTML = applicationDataHTML;
    applicantsList.appendChild(listItem);
  });

  // const viewApplicantProfile = applicantsList.querySelectorAll('.profile-button');
  // viewApplicantProfile.addEventListener("click", () => {
  //   // const applicantInfo = getUserPersonalInfo(applicant.id);
  //   const app = (getProfileById(viewApplicantProfile.id));
  //   // const app2 = getUserPersonalInfo(viewApplicantProfile.id);
  //   console.log(viewApplicantProfile.id);
  //   console.log("app: " + app);
  //   // console.log(app2);
  //   // applicantProfileSetup(app);
  // });

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
    enableScrolling();
  });

  okButton.addEventListener("click", () => {
    modal.style.display = "none";
    enableScrolling();
  });

  const statusSelects = modal.querySelectorAll(".applicant-status");
  statusSelects.forEach((select) => {
    select.addEventListener("change", (event) => {
      const newStatus = event.target.value;
      const applicantId = event.target.closest(".applicant-card").id;

      const applicationId = getApplicationID(parseInt(job.id), applicantId);
      if (applicationId) {
        updateApplicationStatus(applicationId, newStatus);
      }
    });
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
      // jobForm.reset();
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
});

