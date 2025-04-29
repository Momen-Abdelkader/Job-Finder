// Import statements (uncomment when you have these modules)
// import { validateEmail, sendPasswordResetEmail } from './auth.js';
// import { successMessage, failMessage } from './main.js';

document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const form = document.getElementById("forgot-password-form");
  const emailInput = document.getElementById("email");
  const submitButton = document.querySelector(".confirm-button");

  // State
  let isProcessing = false;

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();

    if (isProcessing) return;
    isProcessing = true;

    try {
      const email = emailInput.value.trim();

      // Validate email
      if (!email) {
        throw new Error("Please enter your email address");
      }

      if (!validateEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      // Show loading state
      submitButton.textContent = "Sending...";
      submitButton.disabled = true;

      // Send reset email (replace with your actual implementation)
      await sendPasswordResetEmail(email);

      // Show success message
      successMessage("Password reset email sent! Check your inbox.");

      // Optional: Redirect after delay
      setTimeout(() => {
        window.location.href = "./login.html";
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      failMessage(
        error.message || "Failed to send reset email. Please try again."
      );
    } finally {
      // Reset button state
      isProcessing = false;
      submitButton.textContent = "Send a recovery code";
      submitButton.disabled = false;
    }
  }

  // Event listeners
  form.addEventListener("submit", handleSubmit);
  submitButton.addEventListener("click", handleSubmit);
});
