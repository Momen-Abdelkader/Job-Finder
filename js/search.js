const searchBarHTML = `
    <div class="search">
        <div class="search-left">
            <div class="search-icon"><img src="../assets/search.png"></div>
            <input type="text" class="search-input" placeholder="Search for jobs, companies, or keywords...">
        </div>
        <a class="find-button">Find</a>
    </div>
`;

const searchContainer = document.getElementById("search");
if (searchContainer) {
  searchContainer.innerHTML = searchBarHTML;
}

const searchInput = document.querySelector(".search-input");
const findButton = document.querySelector(".find-button");

function handleSearch() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    localStorage.setItem("searchTerm", searchTerm);
    window.location.href = "jobs.html";
  }
}

findButton.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});
