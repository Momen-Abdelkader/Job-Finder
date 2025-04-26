import { authValidation } from "./login.js";

import {
  successMessage,
  failMessage,
} from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
  authValidation();

  const emailInput = document.getElementById("email");
  const resetBtn = document.getElementById("create_button");
  const newPasswordSection = document.getElementById("new-password-section");
  const confirmPasswordSection = document.getElementById(
    "confirm-password-section"
  );

  emailInput.addEventListener("blur", () => {
    const email = emailInput.value.trim();

    if (email) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const matchedUser = users.find((user) => user.email === email);

      if (matchedUser) {
        newPasswordSection.style.display = "block";
        confirmPasswordSection.style.display = "block";
      } else {
        newPasswordSection.style.display = "none";
        confirmPasswordSection.style.display = "none";
        failMessage("No user found with this email.");
      }
    }
  });

  resetBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    if (!email || !newPassword || !confirmPassword) {
      failMessage("Please fill in all fields.");
      return;
    }

    const passwordRegex = /^[a-zA-Z0-9]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      failMessage(
        "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      failMessage("Passwords do not match.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const matchedUser = users.find((user) => user.email === email);

    if (matchedUser) {
      matchedUser.password = newPassword;
      localStorage.setItem("users", JSON.stringify(users));
      successMessage("Your password has been reset successfully!");
      window.location.href = "login.html";
    } else {
      failMessage("No user found with this email.");
    }
  });
});
