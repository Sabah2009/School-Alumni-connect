
document.addEventListener("DOMContentLoaded", function () {

    // Read saved accounts
    function getUsers() {
        try {
            const users = JSON.parse(localStorage.getItem("schoolUsers"));
            return Array.isArray(users) ? users : [];
        } catch (error) {
            return [];
        }
    }

    // Save accounts
    function saveUsers(users) {
        localStorage.setItem("schoolUsers", JSON.stringify(users));
    }

    // -----------------------------
    // REGISTRATION
    // -----------------------------

    const registrationForm = document.getElementById("registration-form");

    if (registrationForm) {

        registrationForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("fullname").value.trim();
            const email = document.getElementById("newemail").value.trim().toLowerCase();
            const role = document.getElementById("newrole").value;
            const password = document.getElementById("newpassword").value;

            const message = document.getElementById("registrationMessage");

            if (!name || !email || !role || !password) {
                message.textContent = "Please complete all fields.";
                return;
            }

            if (password.length < 6) {
                message.textContent = "Password must contain at least 6 characters.";
                return;
            }

            const users = getUsers();

            // Check for an existing email
            const existingUser = users.find(function (user) {
                return user.email === email;
            });

            if (existingUser) {
                message.textContent =
                    "An account with this email already exists. Please sign in.";
                return;
            }

            // Save profile details only.
            // Passwords are deliberately not stored in Local Storage.
            const newUser = {
                id: "USER-" + Date.now(),
                name: name,
                email: email,
                role: role
            };

            users.push(newUser);
            saveUsers(users);

            // Start a demo session
            localStorage.setItem("alumniCurrentUser", JSON.stringify(newUser));
            localStorage.setItem("alumniDemoLoggedIn", "true");

            message.textContent = "Registration successful! Opening dashboard...";

            registrationForm.reset();

            // Redirect to Dashboard
            window.location.href = "dashboard.html";
        });
    }


    // -----------------------------
    // LOGIN
    // -----------------------------

    const loginForm = document.getElementById("login-form");

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("identifier").value.trim().toLowerCase();
            const password = document.getElementById("password").value;
            const selectedRole = document.querySelector(
                'input[name="role"]:checked'
            );

            const message = document.getElementById("loginMessage");

            if (!email || !password || !selectedRole) {
                message.textContent = "Please enter your login details.";
                return;
            }

            const users = getUsers();

            const user = users.find(function (account) {
                return account.email === email &&
                       account.role === selectedRole.value;
            });

            if (!user) {
                message.textContent =
                    "No registered account was found for this email and role. Please register first.";
                return;
            }

            // Start a demo session
            localStorage.setItem("alumniCurrentUser", JSON.stringify(user));
            localStorage.setItem("alumniDemoLoggedIn", "true");

            window.location.href = "dashboard.html";
        });
    }


    // -----------------------------
    // DASHBOARD USER INFORMATION
    // -----------------------------

    const currentUserData = localStorage.getItem("alumniCurrentUser");

    if (currentUserData) {

        try {
            const currentUser = JSON.parse(currentUserData);

            const userName = document.getElementById("currentUserName");
            const userRole = document.getElementById("currentUserRole");

            if (userName) {
                userName.textContent = currentUser.name;
            }

            if (userRole) {
                userRole.textContent =
                    currentUser.role.charAt(0).toUpperCase() +
                    currentUser.role.slice(1);
            }

        } catch (error) {
            console.error("Unable to load user information.");
        }
    }


    // -----------------------------
    // LOGOUT
    // -----------------------------

    document.querySelectorAll(".logout").forEach(function (link) {

        link.addEventListener("click", function () {
            localStorage.removeItem("alumniDemoLoggedIn");
            localStorage.removeItem("alumniCurrentUser");
        });

    });

});

