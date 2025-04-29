// import { validateName, validateEmail, validatePassword, registerUser } from './auth.js';
// import { successMessage, failMessage } from './main.js';

const domElements = {
  toggleContainer: document.querySelector(".toggle-container"),
  toggleOptions: document.querySelectorAll(".toggle-container a"),
  nameInput: document.querySelector("#name"),
  emailInput: document.querySelector("#email"),
  passwordInput: document.querySelector("#password"),
  confirmPasswordInput: document.querySelector("#confirm-password"),
  signupButton: document.querySelector(".confirm-button"),
  googleButton: document.querySelector(".google-account"),
  companyNameInput: null,
};

const appState = {
  role: "User",
};

function initToggleSwitch() {
  const indicator = document.createElement("div");
  indicator.className = "toggle-indicator";
  domElements.toggleContainer.prepend(indicator);

  const activeOption = document.querySelector(".toggle-container a.active");
  if (activeOption) {
    appState.role = activeOption.classList.contains("admin") ? "Admin" : "User";
  }

  domElements.toggleOptions.forEach((option) => {
    option.addEventListener("click", function (e) {
      e.preventDefault();

      domElements.toggleOptions.forEach((opt) =>
        opt.classList.remove("active")
      );
      this.classList.add("active");

      appState.role = this.classList.contains("admin") ? "Admin" : "User";

      updateToggleIndicator();

      toggleCompanyField();
    });
  });

  updateToggleIndicator();
}

function updateToggleIndicator() {
  const indicator = document.querySelector(".toggle-indicator");
  const activeOption = document.querySelector(".toggle-container a.active");
  const optionIndex = Array.from(domElements.toggleOptions).indexOf(
    activeOption
  );
  const optionWidth = 100 / domElements.toggleOptions.length;

  indicator.style.width = `calc(${optionWidth}% - 0.3em)`;
  indicator.style.transform = `translateX(${optionIndex * 100}%)`;
}

function toggleCompanyField() {
  if (appState.role === "Admin") {
    if (!domElements.companyNameInput) {
      const companyContainer = document.createElement("div");
      companyContainer.className = "input-container";
      companyContainer.innerHTML = `
        <label for="company-name">Company Name</label>
        <input
          type="text"
          id="company-name"
          name="company-name"
          placeholder="Enter your company name"
          required
        />
      `;
      domElements.signupButton.parentNode.insertBefore(
        companyContainer,
        domElements.signupButton
      );
      domElements.companyNameInput = document.querySelector("#company-name");
    }
  } else if (domElements.companyNameInput) {
    domElements.companyNameInput.parentNode.remove();
    domElements.companyNameInput = null;
  }
}

function validateForm() {
  const name = domElements.nameInput.value.trim();
  const email = domElements.emailInput.value.trim();
  const password = domElements.passwordInput.value.trim();
  const confirmPassword = domElements.confirmPasswordInput.value.trim();
  const companyName = domElements.companyNameInput?.value.trim();

  if (!name) throw new Error("Please enter your name");
  if (!validateName(name)) {
    throw new Error(
      "Name must be at least 2 characters and contain only letters"
    );
  }

  if (!email) throw new Error("Please enter your email");
  if (!validateEmail(email)) {
    throw new Error("Please enter a valid email address");
  }

  if (!password) throw new Error("Please enter a password");
  if (!validatePassword(password)) {
    throw new Error(
      "Password must be at least 8 characters and contain letters and numbers"
    );
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  if (appState.role === "Admin" && (!companyName || companyName.length < 2)) {
    throw new Error("Please enter a valid company name (min 2 characters)");
  }

  return { name, email, password, role: appState.role, companyName };
}

async function handleSignup() {
  try {
    const userData = validateForm();

    await registerUser(userData);
    await loginUser(userData.email, userData.password);

    successMessage("Account created successfully!");
    window.location.href =
      appState.role === "Admin" ? "admin.html" : "home.html";
  } catch (error) {
    failMessage(error.message);
    console.error("Signup error:", error);
  }
}

function handleGoogleAuth() {
  failMessage("Google auth have not yet been implemented...");
}

function initApp() {
  if (isUserLoggedIn()) {
    failMessage("You are already logged in.");
    window.location.href = isUserAdmin() ? "admin.html" : "home.html";
    return;
  }

  initToggleSwitch();

  domElements.signupButton.addEventListener("click", handleSignup);
  domElements.googleButton.addEventListener("click", handleGoogleAuth);

  window.addEventListener("resize", updateToggleIndicator);
}

document.addEventListener("DOMContentLoaded", initApp);
