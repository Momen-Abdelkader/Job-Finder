// constants
const NAME_REGEX = /^[a-zA-Z ]{2,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^[a-zA-Z0-9]{8,}$/;

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

// validation Functions
function validateName(name) {
  return NAME_REGEX.test(name);
}

function validateEmail(email) {
  return EMAIL_REGEX.test(email);
}

function validatePassword(password) {
  return PASSWORD_REGEX.test(password);
}

// auth Operations
function registerUser({ name, email, password, role, companyName }) {
  const users = getUsers();

  if (users.some((user) => user.email === email)) {
    throw new Error("User with this email already exists.");
  }

  const newUser = {
    name,
    email,
    password,
    role,
    companyName: role === "Admin" ? companyName : null,
  };

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
  validateName,
  validateEmail,
  validatePassword,
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
};
