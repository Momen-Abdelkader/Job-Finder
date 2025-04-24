import { getCurrentUser, isUserLoggedIn, isUserAdmin } from "./auth.js";

if (!isUserLoggedIn()) {
  alert("You are not logged in. Redirecting to login page.");
  window.location.href = "/login.html";
}

if (isUserAdmin()) {
  alert("You are an admin. Redirecting to admin page.");
  window.location.href = "../html/admin.html";
}
