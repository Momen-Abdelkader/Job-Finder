import {
  validateEmail,
  loginUser,
  googleAuth,
  isUserAdmin,
  getCurrentUser,
  isUserLoggedIn,
} from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  authValidation();
  // DOM
  const loginBtn = document.getElementById("create_button");
  const useGoogleBtn = document.getElementById("use_button");
  const emailInput = document.querySelector(
    'input[placeholder="Enter your email"]'
  );
  const passwordInput = document.querySelector(
    'input[placeholder="Enter your password"]'
  );

  // login
  loginBtn.addEventListener("click", () => {
    try {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password)
        throw new Error("Please fill in both email and password.");
      if (!validateEmail(email))
        throw new Error("Please enter a valid email address.");

      const user = loginUser(email, password);
      if (isUserAdmin(user)) {
        window.location.href = "admin.html";
      } else {
        window.location.href = "home.html";
      }
    } catch (error) {
      alert(error.message);
    } finally {
    }
  });

  // google auth
  useGoogleBtn.addEventListener("click", () => {
    try {
      googleAuth();
      alert("Google login coming soon!");
    } catch (error) {
      alert(error.message);
    }
  });
});

export function authValidation() {
  if (isUserLoggedIn()) {
    alert("You are already logged in.");
    if (isUserAdmin()) {
      window.location.href = "admin.html";
    } else {
      window.location.href = "home.html";
    }
  }
}
