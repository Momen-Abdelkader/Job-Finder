import {createNewProfile} from "./profile-interface.js";

// constants
const NAME_REGEX = /^[a-zA-Z ]{2,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^[a-zA-Z0-9]{8,}$/;
const PHONE_REGEX = /^(?:(?:\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|01[0125]\d{8})$/;
const URL_REGEX = /^(https?|ftp):\/\/(?:www\.)?(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(?::\d+)?(?:\/[^\s?#]*)?(?:\?[^\s#]*)?(?:#\S*)?$/i;
const VALID_TLDS = [
  'com', 'org', 'net', 'edu', 'gov', 'io', 'co', 'me', 'info', 'biz', 'app',
  'dev', 'ai', 'tech', 'uk', 'ca', 'au', 'de', 'fr', 'jp', 'cn', 'ru', 'in',
  'br', 'it', 'es', 'nl', 'eu', 'us', 'xyz', 'online', 'store', 'shop', 'blog'
];

// storage Functions
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function setUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}

function isUserLoggedIn() {
  const user = getCurrentUser();
  return user !== null && user !== undefined && user !== "";
}

function isUserAdmin() {
  const user = getCurrentUser();
  return isUserLoggedIn() && user.role === "Admin";
}

// validation
function validateName(name) {
  return NAME_REGEX.test(name);
}

function validateEmail(email) {
  return EMAIL_REGEX.test(email) && isValidTLD(email);
}

function isValidTLD(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const domain = email.split('@')[1];
  if (!domain) {
    return false;
  }
  
  const tld = domain.split('.').pop().toLowerCase();
  return VALID_TLDS.includes(tld);
}

function validatePassword(password) {
  return PASSWORD_REGEX.test(password);
}

function isValidPhoneNumber(phoneNumber) {
  return PHONE_REGEX.test(phoneNumber);
}

function isValidURL(url) {
  return URL_REGEX.test(url);
}

// auth operations
function registerUser({ name, email, password, role, companyName }) {
  const users = getUsers();

  if (users.some((user) => user.email === email)) {
    throw new Error("User with this email already exists.");
  }

  let id = 1;

  users.forEach((user) => {
    if (user.id >= id) {
      id = Number(user.id) + 1;
    }
  });

  const newUser = {
    id,
    name,
    email,
    password,
    role,
    companyName: role === "Admin" ? companyName : null,
  };

  createNewProfile(newUser);
  setUsers([...users, newUser]);
  return newUser;
}

function loginUser(email, password) {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Incorrect email or password.");
  }

  setCurrentUser(user);
  return user;
}

function logoutUser() {
  clearCurrentUser();
}

// google Auth placeholder
function googleAuth() {
  throw new Error("Google authentication is not yet implemented.");
}

export {
  getCurrentUser,
  isUserAdmin,
  isUserLoggedIn,
  validateName,
  validateEmail,
  validatePassword,
  isValidPhoneNumber,
  isValidURL,
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
};
