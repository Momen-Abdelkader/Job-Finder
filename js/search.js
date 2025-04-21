// Create search bar HTML
const searchBarHTML = `
    <div class="search">
        <div class="search-left">
            <div class="search-icon"><img src="../assets/search.png"></div>
            <input type="text" class="search-input" placeholder="Search for jobs, companies, or keywords...">
        </div>
        <a class="find-button">Find</a>
    </div>
`;

// Insert search bar into the page
const searchContainer = document.getElementById("search");
if (searchContainer) {
  searchContainer.innerHTML = searchBarHTML;
}
