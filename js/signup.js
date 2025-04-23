createNav();

function doTheThing() {
    alert("Account is created successfully !");
}

function doTheThing2() {
    alert("Google Account is selected successfully !");
}

document.getElementById("use_button").addEventListener("click", doTheThing2);

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".toggle-button");
    const companySection = document.querySelector(".Company_name");
    const createButton = document.getElementById("create_button");
    const adminBtn = document.getElementById("AdminBtn");
    const userBtn = document.getElementById("UserBtn");
    const useButton = document.getElementById("use_button");

    let role = "Admin";

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            if (button.id === "AdminBtn") {
                role = "Admin";
                companySection.style.display = "block";
            } else {
                role = "User";
                companySection.style.display = "none";
            }
        });
    });

    createButton.addEventListener("click", () => {
        const name = document.querySelector('input[placeholder="Enter your name"]').value.trim();
        const email = document.querySelector('input[placeholder="Enter your email"]').value.trim();
        const password = document.querySelector('input[placeholder="Enter your password"]').value.trim();
        const confirmPassword = document.querySelector('input[placeholder="Confirm password"]').value.trim();
        const companyName = document.querySelector('input[placeholder="Enter your company name"]').value.trim();

        const nameRegex = /^[a-zA-Z ]{2,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^[a-zA-Z0-9]{8,}$/;


        if (!nameRegex.test(name)) {
            alert("Please enter a valid name (only letters, min 2 characters).");
            return;
        }

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!passwordRegex.test(password)) {
            alert("Password must be at least 6 characters, include letters and numbers.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (role === "Admin" && companyName.trim() === "") {
            alert("Please enter a company name.");
            return;
        }

        const userData = {
            name,
            email,
            password,
            role,
            companyName: role === "Admin" ? companyName : null
        };

        let users = JSON.parse(localStorage.getItem("users")) || [];
        const emailExists = users.some(user => user.email === email);
        if (emailExists) {
            alert("User with this email already exists.");
            return;
        }

        users.push(userData);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Account created successfully!");
        window.location.href = "login.html";
    });

    useButton.addEventListener("click", () => {
        alert("Google Account is selected successfully !");
    });
});


    
