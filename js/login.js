import {
  validateEmail,
  loginUser,
  googleAuth,
  isUserAdmin,
  getCurrentUser,
  isUserLoggedIn,
} from "./auth.js";

import { failMessage } from "./main.js";

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
      failMessage(error.message);
    } finally {
    }
  });

  // google auth
  useGoogleBtn.addEventListener("click", () => {
    try {
      googleAuth();
      failMessage("Google login coming soon!");
    } catch (error) {
      failMessage(error.message);
    }
  });
});

function authValidation() {
  if (isUserLoggedIn()) {
    failMessage("You are already logged in.");
    if (isUserAdmin()) {
      window.location.href = "admin.html";
    } else {
      window.location.href = "home.html";
    }
  }
}
