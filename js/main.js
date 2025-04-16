function createJobCard(job, role = 'user') {
    const isAdmin = role === 'admin';

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
                ${job.tags.map(tag => `<li><a class="tag">${tag}</a></li>`).join('')}
                <li><a class="tag">${job.salary}</a></li>
            </ul>
            <div class="buttons">
                ${isAdmin ? `
                    <a href="#" class="edit-button button">Edit</a>
                    <a href="#" class="applicants-button button">Applicants</a>
                    <a href="#" class="delete-button button">Delete</a>
                ` : `
                    <a href="#" class="apply-button button">Apply Now</a>
                    <a href="#" class="details-button button">Details</a>
                `}
            </div>
        </div>
    `;

    const template = document.createElement('template');
    template.innerHTML = html.trim();

    const element = template.content.firstChild;

    if (!(element instanceof HTMLElement)) {
        throw new Error('createJobCard did not return a valid DOM element');
    }

    return element;
}
