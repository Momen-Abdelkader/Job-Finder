createNav(true, true);

var jobData = [
    {
        logo: "../assets/google.png",
        company: "Google",
        title: "Junior Software Engineer",
        location: "Mountain View, CA",
        tags: ["On-Site", "Full Time", "No Experience"],
        salary: "$4000/month"
    },
    {
        logo: "../assets/microsoft.png",
        company: "Microsoft",
        title: "Intern - Software Developer",
        location: "Redmond, WA",
        tags: ["Remote", "Internship", "Student"],
        salary: "$2000/month"
    },
    {
        logo: "../assets/linkedin.png",
        company: "LinkedIn",
        title: "Fresh - Frontend Developer React.js",
        location: "Imbaba, Giza",
        tags: ["On-Site 💀", "Full-Time", "Fresh Graduate"],
        salary: "$52/month"
    }
];

function renderJobs() {
    const jobCardsContainer = document.querySelector('.job-cards');
    if(jobCardsContainer.innerHTML.trim() !== ''){
        jobCardsContainer.innerHTML = '';
    }
  
    jobData.forEach(job => {
        const card = createJobCard(job, 'admin');
        jobCardsContainer.appendChild(card);
  });
  }

renderJobs();

document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.querySelector('.add_button');
    const modal = document.querySelector('.modal');
    const closeBtn = document.querySelector('.close');
    const jobForm = document.querySelector('.job-form');
    // const editButton = document.querySelectorAll('.edit-button button');
    let isEdit = false;

    const workLocation = document.querySelector('input[name="workLocation"]:checked').value;
    const jobType = document.querySelector('input[name="jobType"]:checked').value;
    const experience = document.querySelector('input[name="experience"]:checked').value;
    
    addButton.addEventListener('click', function() {
      modal.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });

    // editButton.addEventListener('click', function() {
    //   modal.style.display = 'block';
    //   isEdit = true;
    //   //document.querySelector("#logo").value = document.querySelector()
    // });

    document.querySelectorAll('.edit-button').forEach(button => {
      button.addEventListener('click', function() {
        var jobCard = this.closest('.job-card'); 
        console.log(jobCard); 
        let jobTags = jobCard.querySelectorAll('.tag'); 
        const jobEdit = {
          logo: jobCard.querySelector('.company-logo').src,
          company: jobCard.querySelector('.company-name').innerHTML,
          title: jobCard.querySelector('.job-title').innerHTML,
          location: jobCard.querySelector('.job-location').innerHTML,
          tags: [jobTags[0].innerHTML, jobTags[1].innerHTML, jobTags[2].innerHTML],
          salary: jobCard[3].innerHTML
        };

        for (const job of jobData) {
          if(job.logo == jobEdit.logo
            && job.company == jobEdit.company
            && job.location == jobEdit.location
            && job.title == jobEdit.title
            && job.tags == jobEdit.tags
            && job.salary == jobEdit.salary){
              break;
          }
        }

      });
    });

    
    jobForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const newJob = {
        logo: document.querySelector("#logo").value,
        company: document.querySelector("#company-name").value,
        title: document.querySelector('#job-title').value,
        location: document.querySelector('#job-location').value,
        tags: [workLocation, jobType, experience],
        salary:  "$" + document.querySelector('#job-salary').value  + "/month",
      };
      
      jobData.push(newJob);
      renderJobs();

      jobForm.reset();
      modal.style.display = 'none';
    });

  });

function deleteJob(id) {
  jobs = jobs.filter(job => job.id !== id);
  renderJobs();
}