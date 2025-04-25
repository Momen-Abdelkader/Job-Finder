function UserProfile({
    profileId,
    name,
    email,
    phone = "",
    location = "",
    jobTitle = "",
    skills = [],
    resume = null,
    preferences = {},
    jobApplications = []
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
    profileId,
    adminName,
    email,
    companyName,
    phone = "",
    location = "",
    postedJobs = []
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
            name: user.name,
            email: user.email,
            companyName: user.companyName,
        });
    }
    else {
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

    const updates = {...updatedData};
    const existingProfile = profiles[profileId];
    
    // Handle nested preferences object
    if (updates.preferences && typeof updates.preferences === 'object') {
        updates.preferences = {
            ...existingProfile.preferences || {},
            ...updates.preferences
        };
    }
    
    // Handle skills updates
    if (updates.skills !== undefined) {
        if (Array.isArray(updates.skills)) {
            updates.skills = [...existingProfile.skills || [], ...updates.skills];
        } 
        else {
            updates.skills = [updates.skills];
        }
    }
    
    // Handle jobApplications updates
    if (updates.jobApplications !== undefined) {
        if (Array.isArray(updates.jobApplications)) {
            updates.jobApplications = [...existingProfile.jobApplications || [], ...updates.jobApplications];
        } 
        else{
            updates.jobApplications = [updates.jobApplications];
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
        ...newPreferences
    };
    
    updateUserProfile(profileId, { preferences: updatedPreferences });
}

function addSkill(profileId, newSkill) {
    const profiles = getProfilesStorage();
    
    if (!profiles[profileId]) {
        throw new Error("Profile not found.");
    }
    
    const existingProfile = profiles[profileId];

    if (!existingProfile.skills.includes(newSkill)) {
        const updatedSkills = [...existingProfile.skills, newSkill];
        updateUserProfile(profileId, { skills: updatedSkills });
    }
}

function removeSkill(profileId, skillToRemove) {
    const profiles = getProfilesStorage();
    
    if (!profiles[profileId]) {
        throw new Error("Profile not found.");
    }
    
    const existingProfile = profiles[profileId];
    const updatedSkills = existingProfile.skills.filter(skill => skill !== skillToRemove);
    updateUserProfile(profileId, { skills: updatedSkills });
}

// TODO: Handle Job applications for user and Posted jobs for comapnies with objects instead of ids? 
function addJobApplication(profileId, applicationId) {
    const profiles = getProfilesStorage();
    
    if (!profiles[profileId]) {
        throw new Error("Profile not found.");
    }
    
    const existingProfile = profiles[profileId];
    const updatedJobApplications = [
        ...existingProfile.jobApplications,
        applicationId
    ];
    
    updateUserProfile(profileId, { jobApplications: updatedJobApplications });
}

function removeJobApplication(profileId, applicationId) {
    const profiles = getProfilesStorage();
    
    if (!profiles[profileId]) {
        throw new Error("Profile not found.");
    }
    
    const existingProfile = profiles[profileId];
    const updatedJobApplications = existingProfile.jobApplications.filter(appId => appId !== applicationId);
    
    updateUserProfile(profileId, { jobApplications: updatedJobApplications });
}

// --------------------------- COMPANY PROFILE UPDATE OPERATIONS
function updateCompanyProfile(profileId, updatedData) {
    const profiles = getProfilesStorage();

    if (!profiles[profileId]) {
        throw new Error("Profile not found.");
    }

    const updates = {...updatedData};
    const existingProfile = profiles[profileId];

    if (updates.postedJobs !== undefined) {
        if (Array.isArray(updates.postedJobs)) {
            updates.postedJobs = [...existingProfile.postedJobs || [], ...updates.postedJobs];
        } 
        else {
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
    const updatedPostedJobs = [...existingProfile.postedJobs, jobId];

    updateCompanyProfile(profileId, { postedJobs: updatedPostedJobs });
}

function removePostedJob(profileId, jobId) {
    const profiles = getProfilesStorage();

    if (!profiles[profileId]) {
        throw new Error("Profile not found.");
    }

    const existingProfile = profiles[profileId];
    const updatedPostedJobs = existingProfile.postedJobs.filter(job => job !== jobId);

    updateCompanyProfile(profileId, { postedJobs: updatedPostedJobs });
}

export {
    UserProfile,
    CompanyProfile,
    getAllProfiles,
    createNewProfile,
    getProfileById,
    deleteProfile,
    updateUserProfile,
    updatePreferences,
    addSkill,
    removeSkill,
    addJobApplication,
    removeJobApplication,
    updateCompanyProfile,
    addPostedJob,
    removePostedJob
};