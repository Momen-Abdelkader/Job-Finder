import { isUserAdmin, isUserLoggedIn } from "./auth.js";

if (!isUserLoggedIn()) {
  alert("You are not logged in. Redirecting to login page.");
  window.location.href = "../html/login.html";
}

if (!isUserAdmin()) {
  alert("You are not an admin. Redirecting to user page.");
  window.location.href = "../html/user-profile.html";
}
