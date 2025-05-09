// import { loginUser, logoutUser } from "./auth.js";

function createNav(isLoggedIn = false, isAdmin = false) {
  let navHtml = `
    <nav class="main-nav">
        <div class="nav-left">
            <a href="${
              isAdmin ? `admin.html` : `home.html`
            }" class="logo">Job Finder</a>
            <button id="theme-switch" type="button">
              <svg class="light-mode-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z"/></svg>
              <svg class="dark-mode-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z"/></svg>
            </button>
        </div>
        <div class="nav-content">
            <ul class="nav-list">   
                ${isAdmin ? `` : `<li><a href="home.html">Home</a></li>`}
                ${
                  isAdmin
                    ? '<li><a href="admin.html">Dashboard</a></li>'
                    : '<li><a href="jobs.html">Jobs</a></li>'
                }
            </ul>
            ${
              isLoggedIn
                ? `<div class="profile" id="profile-nav">
                <a href="${
                  isAdmin ? `company-profile.html` : `user-profile.html`
                }">
                    <img src="../assets/temp-profile.webp" class="profile-image">
                </a>
                <a class="signout-button" id="signout-button">Sign Out</a>
            </div>`
                : `<div class="auth-buttons">
                <a href="login.html" class="login">Login</a>
                <a href="signup.html" class="signup">Sign Up</a>
            </div>`
            }
        </div>
        <div class="menu-toggle">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </nav>`;

  document.getElementById("nav").innerHTML = navHtml;
  const currentPath = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll("#nav a");
  links.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const authButtons = document.querySelector(".auth-buttons");
  const navContent = document.querySelector(".nav-content");
  const signoutButton = document.getElementById("signout-button");
  const themeSwitch = document.getElementById("theme-switch");
  const body = document.body;

  // Initialize theme
  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      body.classList.add('darkmode');
    } else {
      body.classList.remove('darkmode');
    }
  }

  // Theme switch click handler
  function toggleTheme() {
    body.classList.toggle('darkmode');
    const currentTheme = body.classList.contains('darkmode') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
  }

  // Initialize theme on page load
  initializeTheme();

  // Add click event listener to theme switch, Yes I write a comment Wallahi
  if (themeSwitch) {
    themeSwitch.addEventListener('click', toggleTheme);
  }

  menuToggle.addEventListener("click", () => {
    navContent.classList.toggle("active");
    if (authButtons) authButtons.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });

  if (signoutButton) {
    signoutButton.addEventListener("click", () => {
      logoutUser();
      window.location.href = "login.html";
    });
  }
}
