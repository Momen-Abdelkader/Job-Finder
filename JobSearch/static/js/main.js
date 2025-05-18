function disableScrolling() {
  document.body.style.overflow = "hidden";
}

function enableScrolling() {
  document.body.style.overflow = "";
}

function successMessage(message) {
  const messageContainer = document.createElement("div");
  messageContainer.className = "message-container success";
  messageContainer.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(messageContainer);

  setTimeout(() => {
    messageContainer.classList.add("hide");
    messageContainer.addEventListener("transitionend", () => {
      messageContainer.remove();
    });
  }, 3000);
}

function failMessage(message) {
  const messageContainer = document.createElement("div");
  messageContainer.className = "message-container fail";
  messageContainer.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(messageContainer);

  setTimeout(() => {
    messageContainer.classList.add("hide");
    messageContainer.addEventListener("transitionend", () => {
      messageContainer.remove();
    });
  }, 3000);
}


document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('darkmode');
    }

    themeSwitch.addEventListener('click', () => {
        body.classList.toggle('darkmode');
        
        const currentTheme = body.classList.contains('darkmode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });

    const menuToggle = document.querySelector(".menu-toggle");
    const authButtons = document.querySelector(".auth-buttons");
    const navContent = document.querySelector(".nav-content");


    menuToggle.addEventListener("click", () => {
      navContent.classList.toggle("active");
      if (authButtons) authButtons.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });
});
