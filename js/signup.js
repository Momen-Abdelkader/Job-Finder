import {
  validateName,
  validateEmail,
  validatePassword,
  registerUser,
  googleAuth,
} from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  // DOM
  const buttons = document.querySelectorAll(".toggle-button");
  const companySection = document.querySelector(".Company_name");
  const createButton = document.getElementById("create_button");
  const useButton = document.getElementById("use_button");
  const nameInput = document.querySelector(
    'input[placeholder="Enter your name"]'
  );
  const emailInput = document.querySelector(
    'input[placeholder="Enter your email"]'
  );
  const passwordInput = document.querySelector(
    'input[placeholder="Enter your password"]'
  );
  const confirmPasswordInput = document.querySelector(
    'input[placeholder="Confirm password"]'
  );
  const companyNameInput = document.querySelector(
    'input[placeholder="Enter your company name"]'
  );

  // role
  let role = "Admin";

  // toggle role buttons
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      role = button.id === "AdminBtn" ? "Admin" : "User";
      companySection.style.display = role === "Admin" ? "block" : "none";
    });
  });

  // signup
  createButton.addEventListener("click", () => {
    try {
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const confirmPassword = confirmPasswordInput.value.trim();
      const companyName = companyNameInput.value.trim();

      // validation
      if (!validateName(name))
        throw new Error(
          "Please enter a valid name (only letters, min 2 characters)."
        );
      if (!validateEmail(email))
        throw new Error("Please enter a valid email address.");
      if (!validatePassword(password))
        throw new Error(
          "Password must be at least 8 characters and alphanumeric."
        );
      if (password !== confirmPassword)
        throw new Error("Passwords do not match.");
      if (role === "Admin" && !companyName.trim())
        throw new Error("Please enter a company name.");

      // add user to local storage
      registerUser({ name, email, password, role, companyName });

      alert("Account created successfully!");
      window.location.href = "login.html";
    } catch (error) {
      alert(error.message);
    }
  });

  // google auth
  useButton.addEventListener("click", () => {
    try {
      googleAuth();
      alert("Google Account is selected successfully!");
    } catch (error) {
      alert(error.message);
    }
  });
});
