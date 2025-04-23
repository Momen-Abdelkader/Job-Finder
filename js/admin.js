import {
  getJobData,
  getJobById,
  updateJob,
  addJob,
  deleteJob,
} from "./job-data.js";

import {
  getApplications,
  getApplicationByJobID,
  getApplicationByUserID,
  getApplicationByID,
  addApplication,
  updateApplicationStatus,
  deleteApplication,
  deleteApplicationsByJobID,
  deleteApplicationsByUserID,
  getApplicationCountByJobID,
  getApplicationCountByUserID,
  getApplicationCount,
  getApplicationID,
} from "./app-data.js";

function showAddJobModal() {
  const modal = document.querySelector('#add-job-modal');
  const closeButton = document.querySelector('#add-job-modal .close');
  const jobForm = document.querySelector('.job-form');

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
    enableScrolling();
  });

  jobForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const workLocation = document.querySelector('input[name="workLocation"]:checked').value;
    const jobType = document.querySelector('input[name="jobType"]:checked').value;
    const experience = document.querySelector('input[name="experience"]:checked').value;

    const salaryInput = document.getElementById('job-salary');
    const salaryError = document.getElementById('salary-error');
    const salaryValue = salaryInput.value.trim();
  
    if (!/^\d+$/.test(salaryValue)) {
      salaryError.style.display = 'block';
      salaryInput.style.borderColor = 'red';
      salaryInput.focus();
      return; 
    } else {
      salaryError.style.display = 'none';
    }

    const jobArr = getJobData();
    let maxID = 0;
    for(let i = 0; i < jobArr.length; i++){
      if(maxID < jobArr[i].id)
          maxID = jobArr[i].id;
    }
    
    const newJob = {
      id: (maxID + 1),
      logo: jobForm.querySelector("#logo").value,
      company: jobForm.querySelector("#company-name").value,
      title: jobForm.querySelector('#job-title').value,
      location: jobForm.querySelector('#job-location').value,
      salary:  "$" + salaryValue + "/month",
      jobType: jobType,
      workMode: workLocation,
      skills: ["C++", "Debugging", "Batates Soury"], // <-- Temp Skills
      experienceLevel: experience,
      postedAt: new Date(),
      description: jobForm.querySelector("#job-description"),
    };
    
    addJob(newJob);

    jobForm.reset();
    modal.style.display = 'none';
    enableScrolling();
    location.reload();

  });

  modal.style.display = "flex";
  disableScrolling();

}

function showEditJobModal(job) {
  // TODO: implement
}

function showDeleteJobModal(job) {
  const modal = document.getElementById("delete-job-modal");
  const confirmButton = modal.querySelector("#confirm-delete");
  const cancelButton = modal.querySelector("#cancel-delete");
  const closeButton = modal.querySelector(".close");

  confirmButton.addEventListener("click", () => {
    deleteJob(job.id);
    deleteApplicationsByJobID(job.id);
    location.reload();
  });

  cancelButton.addEventListener("click", () => {
    modal.style.display = "none";
    enableScrolling();
  });

  closeButton.addEventListener("click", () => {
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

function showJobApplicantsModal(job) {
  const modal = document.getElementById("job-applicants-modal");
  const closeButton = modal.querySelector(".close");
  const applicantsList = modal.querySelector(".applicants-list");
  const okButton = modal.querySelector("#close-applicants-modal");

  const applications = getApplicationByJobID(job.id);
  applicantsList.innerHTML = "";

  applications.forEach((application) => {
    const applicant = getApplicationByID(application.applicantId);
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
        <a class="button profile-button" href="../profile.html?userId=${
          applicant.applicantId
        }" target="_blank">View Profile</a>
      </div>
    </div>`;

    const listItem = document.createElement("li");
    listItem.classList.add("applicant-item");
    listItem.innerHTML = applicationDataHTML;
    applicantsList.appendChild(listItem);
  });

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


document.addEventListener('DOMContentLoaded', function() {
  const addButton = document.querySelector("#add-button");

  if(addButton){
    addButton.addEventListener("click", () => {
      showAddJobModal();
    });
  }
});


function setupCardEventHandlers(card, jobId) {
  // const addButton = card.querySelector("#add-button");
  const editButton = card.querySelector(".edit-button");
  const deleteButton = card.querySelector(".delete-button");
  const applicantsButton = card.querySelector(".applicants-button");

  // if(addButton){
  //   addButton.addEventListener("click", () => {
  //     showAddJobModal();
  //   });
  // }

  if (editButton) {
    editButton.addEventListener("click", () => {
      const job = getJobById(jobId);
      showEditJobModal(job);
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      const job = getJobById(jobId);
      showDeleteJobModal(job);
    });
  }

  if (applicantsButton) {
    applicantsButton.addEventListener("click", () => {
      const job = getJobById(jobId);
      showJobApplicantsModal(job);
    });
  }
}

function init() {
  createNav(true, true);
  const jobData = getJobData();
  const jobCardsContainer = document.querySelector(".job-cards");

  jobData.forEach((job) => {
    const card = createJobCard(job, "admin");
    jobCardsContainer.appendChild(card);
    setupCardEventHandlers(card, job.id);
  });
}

init();


// document.addEventListener('DOMContentLoaded', function() {
    // const addButton = document.querySelector('#add-button');
    // const modal = document.querySelector('.modal');
    // const closeBtn = document.querySelector('.close');
    // const jobForm = document.querySelector('.job-form');
//     // const editButton = document.querySelectorAll('.edit-button button');
//     let isEdit = false;

    // const workLocation = document.querySelector('input[name="workLocation"]:checked').value;
    // const jobType = document.querySelector('input[name="jobType"]:checked').value;
    // const experience = document.querySelector('input[name="experience"]:checked').value;
    
//     addButton.addEventListener('click', function() {
//       modal.style.display = 'block';
//     });
    
//     closeBtn.addEventListener('click', function() {
//       modal.style.display = 'none';
//     });

//     // editButton.addEventListener('click', function() {
//     //   modal.style.display = 'block';
//     //   isEdit = true;
//     //   //document.querySelector("#logo").value = document.querySelector()
//     // });

//     document.querySelectorAll('.edit-button').forEach(button => {
//       button.addEventListener('click', function() {
//         var jobCard = this.closest('.job-card'); 
//         console.log(jobCard); 
//         let jobTags = jobCard.querySelectorAll('.tag'); 
//         const jobEdit = {
//           logo: jobCard.querySelector('.company-logo').src,
//           company: jobCard.querySelector('.company-name').innerHTML,
//           title: jobCard.querySelector('.job-title').innerHTML,
//           location: jobCard.querySelector('.job-location').innerHTML,
//           tags: [jobTags[0].innerHTML, jobTags[1].innerHTML, jobTags[2].innerHTML],
//           salary: jobCard[3].innerHTML
//         };

//         for (const job of jobData) {
//           if(job.logo == jobEdit.logo
//             && job.company == jobEdit.company
//             && job.location == jobEdit.location
//             && job.title == jobEdit.title
//             && job.tags == jobEdit.tags
//             && job.salary == jobEdit.salary){
//               break;
//           }
//         }

//       });
//     });

    
    // jobForm.addEventListener('submit', function(e) {
    //   e.preventDefault();
      
    //   const newJob = {
    //     logo: document.querySelector("#logo").value,
    //     company: document.querySelector("#company-name").value,
    //     title: document.querySelector('#job-title').value,
    //     location: document.querySelector('#job-location').value,
    //     tags: [workLocation, jobType, experience],
    //     salary:  "$" + document.querySelector('#job-salary').value  + "/month",
    //   };
      
    //   jobData.push(newJob);
    //   renderJobs();

    //   jobForm.reset();
    //   modal.style.display = 'none';
    // });

//   });