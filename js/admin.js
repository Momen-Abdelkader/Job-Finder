const jobData = [
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

const jobCardsContainer = document.querySelector('.job-cards');

jobData.forEach(job => {
    const card = createJobCard(job, 'admin');
    jobCardsContainer.appendChild(card);
});