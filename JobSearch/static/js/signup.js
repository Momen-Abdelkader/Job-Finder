document.addEventListener("DOMContentLoaded", function() {
  const domElements = {
    toggleContainer: document.querySelector(".toggle-container"),
    toggleOptions: document.querySelectorAll(".toggle-container a"),
    userTypeInput: document.querySelector("#user_type"),
    confirmButton: document.querySelector(".confirm-button"),
    companyNameInput: null
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

  initToggleSwitch();

  window.addEventListener("resize", updateToggleIndicator);
});