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