createNav();


document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("create_button");
  const useGoogleBtn = document.getElementById("use_button");

  loginBtn.addEventListener("click", () => {
      const email = document.querySelector('input[placeholder="Enter your email"]').value.trim();
      const password = document.querySelector('input[placeholder="Enter your password"]').value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

      if (!email || !password) {
          alert("Please fill in both email and password.");
          return;
      }

      if (!emailRegex.test(email)) {
          alert("Please enter a valid email address.");
          return;
      }

      if (!passwordRegex.test(password)) {
          alert("Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.");
          return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];

      const matchedUser = users.find(user => user.email === email && user.password === password);

      if (matchedUser) {
          alert(`Welcome back, ${matchedUser.name}!`);
          localStorage.setItem("currentUser", JSON.stringify(matchedUser));
          window.location.href = "home.html";
      } else {
          alert("Incorrect email or password.");
      }
  });

  useGoogleBtn.addEventListener("click", () => {
      alert("Google login coming soon!");
  });
});

