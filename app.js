
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const identifier = document.getElementById("identifier");
        const password = document.getElementById("password");

        if (!identifier || !password) {
            alert("Please check the login form field IDs.");
            return;
        }

        if (
            identifier.value.trim() === "" ||
            password.value.trim() === ""
        ) {
            alert("Please enter your login details.");
            return;
        }

        // Demo login only — this does not authenticate real users.
        localStorage.setItem("alumniDemoLoggedIn", "true");
        window.location.href = "dashboard.html";
    });
}

// Make logout links clear the demo login session.
document.querySelectorAll(".logout").forEach(function (link) {
    link.addEventListener("click", function () {
        localStorage.removeItem("alumniDemoLoggedIn");
    });
});
