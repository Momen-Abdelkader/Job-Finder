// import { getCurrentUser } from "./auth.js";

function handleUnauthUser() {
  const user = getCurrentUser();
  if (user?.role === "Admin") {
    alert("You are not authorized to view this page.");
    window.location.href = "admin.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  handleUnauthUser();

  const searchInput = document.querySelector(".search-input");
  const findButton = document.querySelector(".find-button");

  function handleSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      localStorage.setItem("searchTerm", searchTerm);
      window.location.href = "jobs.html";
    }
  }

  if (findButton) {
    findButton.addEventListener("click", handleSearch);
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    });
  }
});
