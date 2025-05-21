document.addEventListener("DOMContentLoaded", function() {
  const domElements = {
    toggleContainer: document.querySelector(".toggle-container"),
    toggleOptions: document.querySelectorAll(".toggle-container a"),
    userTypeInput: document.querySelector("#user_type"),
    confirmButton: document.querySelector(".confirm-button"),
    companyNameInput: null,
    form: document.querySelector("form.form")  // Get reference to the form
  };

  function initToggleSwitch() {
    domElements.toggleOptions.forEach((option) => {
      option.addEventListener("click", function(e) {
        e.preventDefault();
        domElements.toggleOptions.forEach((opt) => opt.classList.remove("active"));
       
        this.classList.add("active");
        if (this.classList.contains("admin")) {
          domElements.userTypeInput.value = "company";
          addCompanyField();
        } else {
          domElements.userTypeInput.value = "normal";
          removeCompanyField();
        }
        updateToggleIndicator();
      });
    });
    updateToggleIndicator();
   
    const activeOption = document.querySelector(".toggle-container a.active");
    if (activeOption && activeOption.classList.contains("admin")) {
      addCompanyField();
    }
  }

  function updateToggleIndicator() {
    const indicator = document.querySelector(".toggle-indicator");
    const activeOption = document.querySelector(".toggle-container a.active");
    const optionIndex = Array.from(domElements.toggleOptions).indexOf(activeOption);
    const optionWidth = 100 / domElements.toggleOptions.length;
    indicator.style.width = `calc(${optionWidth}% - 0.3em)`;
    indicator.style.transform = `translateX(${optionIndex * 100}%)`;
  }
 
  function addCompanyField() {
    if (!domElements.companyNameInput) {
      const companyContainer = document.createElement("div");
      companyContainer.className = "input-container company-field";
      companyContainer.innerHTML = `
        <label for="company_name">Company Name</label>
        <input
          type="text"
          id="company_name"
          name="company_name"
          placeholder="Enter your company name"
          required
        />
      `;
     
      domElements.confirmButton.parentNode.insertBefore(
        companyContainer,
        domElements.confirmButton
      );
     
      domElements.companyNameInput = document.querySelector("#company_name");
    }
  }
 
  function removeCompanyField() {
    if (domElements.companyNameInput) {
      domElements.companyNameInput.parentNode.remove();
      domElements.companyNameInput = null;
    }
  }

  // Add submit event listener to ensure form data is properly collected
  if (domElements.form) {
    domElements.form.addEventListener("submit", function(e) {
      // Ensure user_type is properly included
      if (!domElements.userTypeInput.value) {
        domElements.userTypeInput.value = "normal"; // Default value
      }
      
      // If company mode is selected but no company name is provided
      const isCompanyMode = domElements.userTypeInput.value === "company";
      if (isCompanyMode && (!domElements.companyNameInput || !domElements.companyNameInput.value)) {
        e.preventDefault();
        alert("Please enter a company name");
        return false;
      }
      
      // For debugging - you can remove this in production
      console.log("Submitting form with data:", {
        user_type: domElements.userTypeInput.value,
        company_name: isCompanyMode && domElements.companyNameInput ? domElements.companyNameInput.value : "N/A"
      });
    });
  }

  initToggleSwitch();
  window.addEventListener("resize", updateToggleIndicator);
});