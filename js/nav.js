function createNav(isLoggedIn = false, isAdmin = false) {
    let navHtml = `
    <nav class="main-nav">
        <a href="home.html" class="logo">Job Finder</a>
        <div class="nav-content">
            <ul class="nav-list">   
                <li><a href="home.html">Home</a></li>
                ${isAdmin ? '<li><a href="admin.html">Dashboard</a></li>' : '<li><a href="jobs.html">Jobs</a></li>'}
            </ul>
            ${isLoggedIn ? 
            `<div class="profile" id="profile-nav">
                <img src="../assets/temp-profile.webp" class="profile-image">
            </div>` : 
            `<div class="auth-buttons">
                <a href="login.html" class="login">Login</a>
                <a href="signup.html" class="signup">Sign Up</a>
            </div>`}
        </div>
        <div class="menu-toggle">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </nav>`;

    document.getElementById('nav').innerHTML = navHtml;
    const currentPath = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('#nav a');
    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const authButtons = document.querySelector('.auth-buttons');
    const navContent = document.querySelector('.nav-content');
    menuToggle.addEventListener('click', () => {
        navContent.classList.toggle('active');
        authButtons.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

}