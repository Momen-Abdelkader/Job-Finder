// import { loginUser, logoutUser } from "./auth.js";

function createNav(isLoggedIn = false, isAdmin = false) {
  let navHtml = `
    <nav class="main-nav">
        <a href="${
          isAdmin ? `admin.html` : `home.html`
        }" class="logo">Job Finder</a>
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
