function UserProfile({
  profileId, // Profile ID = User ID
  name,
  email,
  phone = "",
  location = "",
  jobTitle = "",
  skills = [],
  resume = null,
  preferences = {},
  jobApplications = [],
}) {
  this.accountType = "User";
  this.profileId = profileId;
  this.name = name;
  this.email = email;
  this.phone = phone;
  this.location = location;
  this.jobTitle = jobTitle;
  this.skills = skills;
  this.resume = resume;
  this.preferences = preferences;
  this.jobApplications = jobApplications;
}

function CompanyProfile({
  profileId, // Profile ID = User ID
  adminName,
  email,
  companyName,
  phone = "",
  location = "",
  postedJobs = [],
}) {
  this.accountType = "Admin";
  this.profileId = profileId;
  this.adminName = adminName;
  this.email = email;
  this.companyName = companyName;
  this.phone = phone;
  this.location = location;
  this.postedJobs = postedJobs;
}

// --------------------------- PROFILE STORAGE

const PROFILES_KEY = "profiles";

function getProfilesStorage() {
  const profiles = localStorage.getItem(PROFILES_KEY);
  return profiles ? JSON.parse(profiles) : {};
}

function setProfilesStorage(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

// --------------------------- PROFILE OPERATIONS
function getAllProfiles() {
  const profiles = getProfilesStorage();
  return Object.values(profiles);
}

function createNewProfile(user) {
  const profiles = getProfilesStorage();

  if (profiles[user.id]) {
    throw new Error("Profile already exists for this user.");
  }

  let newProfile;
  if (user.role === "Admin") {
    newProfile = new CompanyProfile({
      profileId: user.id,
      adminName: user.name,
      email: user.email,
      companyName: user.companyName,
    });
  } else {
    newProfile = new UserProfile({
      profileId: user.id,
      name: user.name,
      email: user.email,
    });
  }

  profiles[user.id] = newProfile;
  setProfilesStorage(profiles);
}

function getProfileById(profileId) {
  const profiles = getProfilesStorage();
  return profiles[profileId] || null;
}

function deleteProfile(profileId) {
  const profiles = getProfilesStorage();

  if (!profiles[profileId]) {
    throw new Error("Profile not found.");
  }

  delete profiles[profileId];
  setProfilesStorage(profiles);
}

// --------------------------- USER PROFILE UPDATE OPERATIONS
function updateUserProfile(profileId, updatedData) {
  const profiles = getProfilesStorage();

  if (!profiles[profileId]) {
    throw new Error("Profile not found.");
  }

  const updates = { ...updatedData };
  const existingProfile = profiles[profileId];

  // Handle nested preferences object
  if (updates.preferences && typeof updates.preferences === "object") {
    updates.preferences = {
      ...(existingProfile.preferences || {}),
      ...updates.preferences,
    };

    // Prevent duplicate interests if present
    if (
      updates.preferences.interests &&
      Array.isArray(updates.preferences.interests)
    ) {
      updates.preferences.interests = Array.from(
        new Set(updates.preferences.interests)
      );
    }
  }

  // Handle skills updates
  if (updates.skills !== undefined) {
    if (Array.isArray(updates.skills)) {
      updates.skills = Array.from(new Set(updates.skills));
    } else {
      updates.skills = [updates.skills];
    }
  }

  // Handle jobApplications updates
  if (updates.jobApplications !== undefined) {
    if (Array.isArray(updates.jobApplications)) {
      // Keep existing applications and only add new ones
      const existingApps = existingProfile.jobApplications || [];
      const newApps = updates.jobApplications.filter(
        (app) => !existingApps.includes(app)
      );
      updates.jobApplications = [...existingApps, ...newApps];
    } else {
      // If it's a single application, check if it's already there before adding
      const existingApps = existingProfile.jobApplications || [];
      if (!existingApps.includes(updates.jobApplications)) {
        updates.jobApplications = [...existingApps, updates.jobApplications];
      } else {
        updates.jobApplications = existingApps;
      }
    }
  }

  const updatedProfile = { ...existingProfile, ...updates };
  profiles[profileId] = updatedProfile;
  setProfilesStorage(profiles);
}

function updatePreferences(profileId, newPreferences) {
  const profiles = getProfilesStorage();

  if (!profiles[profileId]) {
    throw new Error("Profile not found.");
  }

  const existingProfile = profiles[profileId];
  const updatedPreferences = {
    ...existingProfile.preferences,
    ...newPreferences,
  };

  // Prevent duplicates
  if (updatedPreferences.interests !== undefined) {
    updatedPreferences.interests = Array.from(
      new Set(updatedPreferences.interests)
    );
  }

  updateUserProfile(profileId, { preferences: updatedPreferences });
}

function addSkill(profileId, newSkill) {
  const profiles = getProfilesStorage();

  if (!profiles[profileId]) {
    throw new Error("Profile not found.");
  }

  const existingProfile = profiles[profileId];

  // Only add the skill if it doesn't already exist
  if (!existingProfile.skills || !existingProfile.skills.includes(newSkill)) {
    const updatedSkills = [...(existingProfile.skills || []), newSkill];
    updateUserProfile(profileId, { skills: updatedSkills });
    return true; // Skill was added
  }

  return false; // Skill already exists
}

function removeSkill(profileId, skillToRemove) {
  const profiles = getProfilesStorage();

  if (!profiles[profileId]) {
    throw new Error("Profile not found.");
  }

  const existingProfile = profiles[profileId];
  const updatedSkills = existingProfile.skills.filter(
    (skill) => skill !== skillToRemove
  );
  updateUserProfile(profileId, { skills: updatedSkills });
}

// TODO: Handle Job applications for user and Posted jobs for comapnies with objects instead of ids?
function addJobApplication(profileId, applicationId) {
  const profiles = getProfilesStorage();

  if (!profiles[profileId]) {
    throw new Error("Profile not found.");
  }

  const existingProfile = profiles[profileId];

  if (
    existingProfile.jobApplications &&
    existingProfile.jobApplications.includes(applicationId)
  ) {
    return false;
  }

  const updatedJobApplications = [
    ...(existingProfile.jobApplications || []),
    applicationId,
  ];

  updateUserProfile(profileId, { jobApplications: updatedJobApplications });
  return true; // Application was added
}

function removeJobApplication(profileId, applicationId) {
  const profiles = getProfilesStorage();

  if (!profiles[profileId]) {
    throw new Error("Profile not found.");
  }

  const existingProfile = profiles[profileId];
  const updatedJobApplications = existingProfile.jobApplications.filter(
    (appId) => appId !== applicationId
  );

  updateUserProfile(profileId, { jobApplications: updatedJobApplications });
}

// --------------------------- COMPANY PROFILE UPDATE OPERATIONS
function updateCompanyProfile(profileId, updatedData) {
  const profiles = getProfilesStorage();

  if (!profiles[profileId]) {
    throw new Error("Profile not found.");
  }

  const updates = { ...updatedData };
  const existingProfile = profiles[profileId];

  if (updates.postedJobs !== undefined) {
    if (Array.isArray(updates.postedJobs)) {
      updates.postedJobs = [
        ...(existingProfile.postedJobs || []),
        ...updates.postedJobs,
      ];
    } else {
      updates.postedJobs = [updates.postedJobs];
    }
  }

  profiles[profileId] = { ...profiles[profileId], ...updates };
  setProfilesStorage(profiles);
}

function addPostedJob(profileId, jobId) {
  const profiles = getProfilesStorage();

  if (!profiles[profileId]) {
    throw new Error("Profile not found.");
  }

  const existingProfile = profiles[profileId];

  if (
    existingProfile.postedJobs &&
    existingProfile.postedJobs.includes(jobId)
  ) {
    return false;
  }

  const updatedPostedJobs = [...(existingProfile.postedJobs || []), jobId];

  updateCompanyProfile(profileId, { postedJobs: updatedPostedJobs });
  return true;
}

function removePostedJob(profileId, jobId) {
  const profiles = getProfilesStorage();

  if (!profiles[profileId]) {
    throw new Error("Profile not found.");
  }

  const existingProfile = profiles[profileId];
  const updatedPostedJobs = existingProfile.postedJobs.filter(
    (job) => job !== jobId
  );

  updateCompanyProfile(profileId, { postedJobs: updatedPostedJobs });
}

// --------------------------- USER PROFILE GET OPERATIONS
function getUserPersonalInfo(profileId) {
  const profiles = getProfilesStorage();
  const profile = profiles[profileId];

  if (!profile) {
    throw new Error("Profile not found.");
  }

  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    jobTitle: profile.jobTitle,
    skills: profile.skills,
    resume: profile.resume,
  };
}

function getUserPreferences(profileId) {
  const profiles = getProfilesStorage();
  const profile = profiles[profileId];

  if (!profile) {
    throw new Error("Profile not found.");
  }

  return profile.preferences || {};
}

function getUserJobApplications(profileId) {
  const profiles = getProfilesStorage();
  const profile = profiles[profileId];

  if (!profile) {
    throw new Error("Profile not found.");
  }

  return profile.jobApplications || [];
}

function getUserSkills(profileId) {
  const profiles = getProfilesStorage();
  const profile = profiles[profileId];

  if (!profile) {
    throw new Error("Profile not found.");
  }

  return profile.skills || [];
}

function getUserJobTitle(profileId) {
  const profiles = getProfilesStorage();
  const profile = profiles[profileId];

  if (!profile) {
    throw new Error("Profile not found.");
  }

  return profile.jobTitle || "";
}

function getUserLocation(profileId) {
  const profiles = getProfilesStorage();
  const profile = profiles[profileId];

  if (!profile) {
    throw new Error("Profile not found.");
  }

  return profile.location || "";
}

function getUserResume(profileId) {
  const profiles = getProfilesStorage();
  const profile = profiles[profileId];

  if (!profile) {
    throw new Error("Profile not found.");
  }

  return profile.resume || "";
}

// export {
//     UserProfile,
//     CompanyProfile,
//     getAllProfiles,
//     createNewProfile,
//     getProfileById,
//     getUserPersonalInfo,
//     getUserPreferences,
//     getUserJobApplications,
//     getUserSkills,
//     getUserJobTitle,
//     getUserLocation,
//     getUserResume,
//     deleteProfile,
//     updateUserProfile,
//     updatePreferences,
//     addSkill,
//     removeSkill,
//     addJobApplication,
//     removeJobApplication,
//     updateCompanyProfile,
//     addPostedJob,
//     removePostedJob
// };
