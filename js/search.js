fetch("../html/search.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("search").innerHTML = data;

    const searchInput = document.querySelector(".search-input");
    const findButton = document.querySelector(".find-button");

    function handleSearch() {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        // Store the search term in localStorage
        localStorage.setItem("searchTerm", searchTerm);
        // Redirect to jobs page
        window.location.href = "jobs.html";
      }
    }

    findButton.addEventListener("click", handleSearch);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    });
  });
