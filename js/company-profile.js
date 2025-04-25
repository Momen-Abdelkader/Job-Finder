import { getCurrentUser, isUserLoggedIn, isUserAdmin } from "./auth.js";
import { 
  getProfileById, 
  updateCompanyProfile,
} from "./profile-interface.js";

import {
  enableScrolling,
  disableScrolling,
  successMessage,
  failMessage,
} from "./main.js";

if (!isUserLoggedIn()) {
  alert("You are not logged in. Redirecting to login page.");
  window.location.href = "../html/login.html";
}

if (!isUserAdmin()) {
  alert("You are not an admin. Redirecting to user profile.");
  window.location.href = "../html/user-profile.html";
}

const user = getCurrentUser();
const profileId = user.id;
const companyProfile = getProfileById(profileId);

// Company Info DOM elements
const companyInfoTab = document.getElementById('personal-info');
const emailInput = document.getElementById('email');
const companyNameInput = document.getElementById('company-name');
const adminNameInput = document.getElementById('admin-name');
const phoneInput = document.getElementById('phone');

// Modal DOM elements
const saveProfileInfoModal = document.getElementById('save-modal');
const confirmSavingBtn = document.getElementById('confirm-saving');
const cancelSavingBtn = document.getElementById('cancel-saving');
const closeModalBtn = saveProfileInfoModal.querySelector('.close');

function init() {
  updateCompanyInfoDisplay();
  populateCompanyInfo();
  initializeEventListeners();
}

function updateCompanyInfoDisplay() {
  const companyNameDisplay = document.querySelector('.user-name');
  const emailDisplay = document.querySelector('.user-email');
  
  if (companyNameDisplay) companyNameDisplay.textContent = companyProfile.companyName || "Company";
  if (emailDisplay) emailDisplay.textContent = companyProfile.email || "";
}

function populateCompanyInfo() {
  emailInput.value = companyProfile.email || "";
  companyNameInput.value = companyProfile.companyName || "";
  adminNameInput.value = companyProfile.adminName || "";
  phoneInput.value = companyProfile.phone || "";
}

function showSaveModal() {
  saveProfileInfoModal.style.display = 'flex';
  disableScrolling();
}

function saveCompanyInfo() {
  showSaveModal();
}

function processConfirmedSave() {
  const updatedData = {
    companyName: companyNameInput.value.trim(),
    adminName: adminNameInput.value.trim(),
    phone: phoneInput.value.trim(),
  };

  updateCompanyProfile(profileId, updatedData);
  updateCompanyInfoDisplay();
  successMessage("Company information saved successfully!");
  closeModal();
}

function closeModal() {
  saveProfileInfoModal.style.display = 'none';
  enableScrolling();
}

function initializeEventListeners() {
  // Save button
  companyInfoTab.querySelector('.btn').addEventListener('click', saveCompanyInfo);

  // Modal buttons
  confirmSavingBtn.addEventListener('click', processConfirmedSave);
  cancelSavingBtn.addEventListener('click', () => {
    closeModal();
    failMessage("Changes discarded.");
  });
  closeModalBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === saveProfileInfoModal) {
      closeModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", init);