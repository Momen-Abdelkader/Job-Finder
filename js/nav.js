function createNav(isLoggedIn = false, isAdmin = false) {
    let navHtml = `
    <nav class="main-nav">
        <ul class="nav-list">   
            <a href="Home.html" class="logo">Job Finder</a>
            <li><a href="Home.html">Home</a></li>
            ${isAdmin ? `<li><a href="admin.html">Dashboard</a></li>` : `<li><a href="jobs.html">Jobs</a></li> <li>`}
        </ul>
        ${isLoggedIn ? `
        <div class="profile" id="profile-nav">
            <img src="../assets/temp-profile.webp" class="profile-image">
        </div>
        ` : `
        <div class="auth-buttons">
            <a href="Log_in.html" class="login">Login</a>
            <a href="Signup.html" class="signup">Sign Up</a>
        </div>`}
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
}