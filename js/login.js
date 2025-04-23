import { validateEmail, loginUser, googleAuth } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
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
      alert(`Welcome back, ${user.name}!`);
      window.location.href = "home.html";
    } catch (error) {
      alert(error.message);
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
