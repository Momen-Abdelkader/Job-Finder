// import { validateEmail, loginUser, googleAuth, isUserAdmin, isUserLoggedIn } from './auth.js';
// import { successMessage, failMessage } from './main.js';

const domElements = {
  loginForm: document.getElementById("login-form"),
  emailInput: document.getElementById("email"),
  passwordInput: document.getElementById("password"),
  loginButton: document.querySelector(".confirm-button"),
  googleButton: document.querySelector(".google-account"),
  formFooterLink: document.querySelector(".form-footer-link"),
};

const appState = {
  isLoading: false,
};

function validateLoginForm(email, password) {
  if (!email || !password) {
    throw new Error("Please fill in both email and password");
  }

  if (!validateEmail(email)) {
    throw new Error("Please enter a valid email address");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
}

async function handleLogin(event) {
  event.preventDefault();

  if (appState.isLoading) return;
  appState.isLoading = true;

  try {
    const email = domElements.emailInput.value.trim();
    const password = domElements.passwordInput.value.trim();

    validateLoginForm(email, password);

    domElements.loginButton.textContent = "Logging in...";
    domElements.loginButton.disabled = true;

    const user = await loginUser(email, password);

    const redirectUrl = isUserAdmin(user) ? "admin.html" : "home.html";
    window.location.href = redirectUrl;
  } catch (error) {
    console.error("Login error:", error);
    failMessage(error.message || "Login failed. Please try again.");
  } finally {
    appState.isLoading = false;
    domElements.loginButton.textContent = "Login";
    domElements.loginButton.disabled = false;
  }
}

async function handleGoogleLogin(event) {
  failMessage("Google authentication not implemented yet");
}

function checkAuthStatus() {
  if (isUserLoggedIn()) {
    const redirectUrl = isUserAdmin() ? "admin.html" : "home.html";
    window.location.href = redirectUrl;
  }
}

function initEventListeners() {
  domElements.loginForm.addEventListener("submit", handleLogin);
  domElements.loginButton.addEventListener("click", handleLogin);
  domElements.googleButton.addEventListener("click", handleGoogleLogin);

  domElements.emailInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });
  domElements.passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });
}

function initApp() {
  checkAuthStatus();
  initEventListeners();
}

document.addEventListener("DOMContentLoaded", initApp);
