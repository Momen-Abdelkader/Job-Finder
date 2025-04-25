import { getCurrentUser, isUserLoggedIn, isUserAdmin } from "./auth.js";
import { 
  getProfileById, 
  updateUserProfile, 
  updatePreferences, 
} from "./profile-interface.js";

import {
  createJobCard,
  enableScrolling,
  disableScrolling,
  successMessage,
  failMessage,
} from "./main.js";

if (!isUserLoggedIn()) {
  alert("You are not logged in. Redirecting to login page.");
  window.location.href = "../html/login.html";
}

if (isUserAdmin()) {
  alert("You are an admin. Redirecting to admin page.");
  window.location.href = "../html/admin.html";
}

const user = getCurrentUser();
const profileId = user.id;
const userProfile = getProfileById(profileId);

// Track UI-only changes that haven't been saved yet
let uiSkills = [];
let uiInterests = [];

// Tabs DOM elements
const personalInfoTab = document.getElementById('personal-info');
const preferencesTab = document.getElementById('preferences');
const jobApplicationsTab = document.getElementById('job-applications');

// Personal Info DOM elements
const emailInput = document.getElementById('email');
const fullNameInput = document.getElementById('fullname');
const phoneInput = document.getElementById('phone');
const locationInput = document.getElementById('location');
const jobTitleInput = document.getElementById('job-title');
const resumeInput = document.getElementById('resume');
const skillsContainer = document.getElementById('skills-tags');
const newSkillInput = personalInfoTab.querySelector('.add-tag-input');

// Preferences DOM elements
const experienceLevelSelect = document.getElementById('experience-level');
const workModeSelect = preferencesTab.querySelectorAll('select')[1];
const employmentTypeSelect = preferencesTab.querySelectorAll('select')[2];
const interestsContainer = document.getElementById('interests-tags');
const newInterestInput = preferencesTab.querySelector('.add-tag-input');

// Modal DOM elements
const saveProfileInfoModal = document.getElementById('save-modal');
const confirmSavingBtn = document.getElementById('confirm-saving');
const cancelSavingBtn = document.getElementById('cancel-saving');
const closeModalBtn = saveProfileInfoModal.querySelector('.close');
let currentSaveAction = null; // Tracks which save action to perform when confirmed

// Initialization
function init() {
  updateUserInfoDisplay();
  populatePersonalInfo();
  populatePreferences();
  populateJobApplications();
  initializeEventListeners();
}

function updateUserInfoDisplay() {
  const userNameDisplay = document.querySelector('.user-name');
  const userEmailDisplay = document.querySelector('.user-email');
  
  if (userNameDisplay) userNameDisplay.textContent = userProfile.name || "User";
  if (userEmailDisplay) userEmailDisplay.textContent = userProfile.email || "";
}

function populatePersonalInfo() {
  emailInput.value = userProfile.email || "";
  fullNameInput.value = userProfile.name || "";
  phoneInput.value = userProfile.phone || "";
  locationInput.value = userProfile.location || "";
  jobTitleInput.value = userProfile.jobTitle || "";
  resumeInput.value = userProfile.resume || "";
  
  uiSkills = [...(userProfile.skills || [])];
  
  refreshSkillTags();
}

function populatePreferences() {
  const preferences = userProfile.preferences || {};
  
  if (preferences.experienceLevel) {
    selectOptionByText(experienceLevelSelect, preferences.experienceLevel);
  }
  
  if (preferences.workMode) {
    selectOptionByText(workModeSelect, preferences.workMode);
  }
  
  if (preferences.employmentType) {
    selectOptionByText(employmentTypeSelect, preferences.employmentType);
  }
  
  uiInterests = [...(preferences.interests || [])];
  
  refreshInterestTags();
}

function populateJobApplications() {
  // TODO: implement
}

// Helper Functions
function selectOptionByText(selectElement, optionText) {
  for (let i = 0; i < selectElement.options.length; i++) {
    if (selectElement.options[i].text === optionText) {
      selectElement.selectedIndex = i;
      break;
    }
  }
}

function refreshSkillTags() {
  skillsContainer.innerHTML = "";
  uiSkills.forEach(skill => {
    const skillTag = document.createElement('span');
    skillTag.className = 'skill-tag';
    skillTag.innerHTML = `${skill} <span class="tag-remove">x</span>`;
    
    // Add event listener to remove button (UI only)
    skillTag.querySelector('.tag-remove').addEventListener('click', () => {
      uiSkills = uiSkills.filter(s => s !== skill);
      refreshSkillTags();
    });
    
    skillsContainer.appendChild(skillTag);
  });
}

function refreshInterestTags() {
  interestsContainer.innerHTML = "";
  uiInterests.forEach(interest => {
    const interestTag = document.createElement('span');
    interestTag.className = 'interest-tag';
    interestTag.innerHTML = `${interest} <span class="tag-remove">x</span>`;
    
    // Add event listener to remove button (UI only)
    interestTag.querySelector('.tag-remove').addEventListener('click', () => {
      uiInterests = uiInterests.filter(i => i !== interest);
      refreshInterestTags();
    });
    
    interestsContainer.appendChild(interestTag);
  });
}

function showSaveModal(saveType) {
  currentSaveAction = saveType;
  saveProfileInfoModal.style.display = 'flex';
  disableScrolling(); 
}

function savePersonalInfo() {
  showSaveModal('personal');
}

function savePreferences() {
  showSaveModal('preferences');
}

function processConfirmedSave() {
  if (currentSaveAction === 'personal') {
    const updatedData = {
      name: fullNameInput.value.trim(),
      phone: phoneInput.value.trim(),
      location: locationInput.value.trim(),
      jobTitle: jobTitleInput.value.trim(),
      resume: resumeInput.value.trim(),
      skills: [...uiSkills]
    };
    
    updateUserProfile(profileId, updatedData);
    updateUserInfoDisplay();
    successMessage("Personal information saved successfully!");
  } 
  else if (currentSaveAction === 'preferences') {
    const newPreferences = {};
    
    // Only add preferences that have actual selections (not the placeholder)
    if (experienceLevelSelect.selectedIndex > 0) {
      newPreferences.experienceLevel = experienceLevelSelect.options[experienceLevelSelect.selectedIndex].text;
    }
    
    if (workModeSelect.selectedIndex > 0) {
      newPreferences.workMode = workModeSelect.options[workModeSelect.selectedIndex].text;
    }
    
    if (employmentTypeSelect.selectedIndex > 0) {
      newPreferences.employmentType = employmentTypeSelect.options[employmentTypeSelect.selectedIndex].text;
    }
    
    newPreferences.interests = [...uiInterests];
    
    updatePreferences(profileId, newPreferences);
    successMessage("Preferences saved successfully!");
  }
  

  closeModal();
}

function closeModal() {
  saveProfileInfoModal.style.display = 'none';
  currentSaveAction = null;
  enableScrolling();
}

function initializeEventListeners() {
  // Save buttons for both tabs
  personalInfoTab.querySelector('.btn').addEventListener('click', savePersonalInfo);
  preferencesTab.querySelector('.btn').addEventListener('click', savePreferences);

  // Modal buttons
  confirmSavingBtn.addEventListener('click', processConfirmedSave);
  cancelSavingBtn.addEventListener('click', function() {
    closeModal();
    failMessage("Changes discarded.");
  });
  closeModalBtn.addEventListener('click', closeModal);
  
  // Close modal when clicking outside of it
  window.addEventListener('click', function(event) {
    if (event.target === saveProfileInfoModal) {
      closeModal();
    }
  });

  // Tags input listeners
  newSkillInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && this.value.trim() !== '') {
      const newSkill = this.value.trim();
      
      if (!uiSkills.includes(newSkill)) {
        uiSkills.push(newSkill);
        refreshSkillTags();
      }
      
      this.value = '';
    }
  });

  newInterestInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && this.value.trim() !== '') {
      const newInterest = this.value.trim();
      
      if (!uiInterests.includes(newInterest)) {
        uiInterests.push(newInterest);
        refreshInterestTags();
      }
      
      this.value = '';
    }
  });
}

document.addEventListener("DOMContentLoaded", init);