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
    const card = createJobCard(job);
    jobCardsContainer.appendChild(card);
});


const filterData = [
    {
        category: 'Type Of Employment',
        filters: [
            { id: 'full-time', label: 'Full Time', count: 54 },
            { id: 'part-time', label: 'Part Time', count: 12 },
            { id: 'internship', label: 'Internship', count: 5 },
            { id: 'remote', label: 'Remote', count: 2 },
            { id: 'onsite', label: 'On-Site', count: 40 }
        ]
    },
    {
        category: 'Level',
        filters: [
            { id: 'senior', label: 'Senior', count: 4 },
            { id: 'midlevel', label: 'Mid-Level', count: 54 },
            { id: 'junior', label: 'Junior', count: 1 },
            { id: 'fresh-grad', label: 'Fresh Graduate', count: 54 },
            { id: 'student', label: 'Student', count: 2 }
        ]
    }
];

function generateFilters() {
    const filtersContainer = document.getElementById('filters');

    filterData.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('filter-category');

        const categoryHeading = document.createElement('h2');
        categoryHeading.textContent = category.category;
        categoryDiv.appendChild(categoryHeading);

        category.filters.forEach(filter => {
            const filterDiv = document.createElement('div');
            filterDiv.classList.add('filter');

            const inputWrapper = document.createElement('div');
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = filter.id;
            checkbox.name = filter.id;
            checkbox.value = filter.label;
            
            const label = document.createElement('label');
            label.setAttribute('for', filter.id);
            label.textContent = filter.label;
            
            inputWrapper.appendChild(checkbox);
            inputWrapper.appendChild(label);
            filterDiv.appendChild(inputWrapper);

            const count = document.createElement('a');
            count.id = `${filter.id}-count`;
            count.classList.add('count');
            count.textContent = filter.count;
            filterDiv.appendChild(count);

            categoryDiv.appendChild(filterDiv);
        });

        filtersContainer.appendChild(categoryDiv);
    });
}

generateFilters();

let jobCount = document.getElementById('job-count');
jobCount.textContent = jobData.length;