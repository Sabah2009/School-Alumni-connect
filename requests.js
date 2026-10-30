
document.addEventListener("DOMContentLoaded", function () {

    // Find the elements we need from requests.html.
    const requestForm = document.getElementById("requestForm");
    const interestForm = document.getElementById("interestForm");
    const requestTableBody = document.getElementById("requestTableBody");
    const interestList = document.getElementById("interestList");

    // Load previously saved records from this browser.
    function loadData(key) {
        try {
            const saved = localStorage.getItem(key);

            if (!saved) return [];

            const data = JSON.parse(saved);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Could not load " + key, error);
            return [];
        }
    }

    let requests = loadData("schoolRequests");
    let interests = loadData("schoolInterests");

    // Save records to browser storage.
    function saveData(key, records) {
        try {
            localStorage.setItem(key, JSON.stringify(records));
            return true;
        } catch (error) {
            console.error("Could not save " + key, error);
            return false;
        }
    }

    // Create a table cell safely.
    function createCell(text) {
        const cell = document.createElement("td");
        cell.textContent = text;
        return cell;
    }

    // Display submitted requests in the table.
    function displayRequests() {
        requestTableBody.replaceChildren();

        if (requests.length === 0) {
            const row = document.createElement("tr");
            const cell = createCell("No requests submitted yet.");
            cell.colSpan = 4;
            row.appendChild(cell);
            requestTableBody.appendChild(row);
            return;
        }

        requests.forEach(function (request) {
            const row = document.createElement("tr");

            const id = request.id || "REQ-UNKNOWN";
            const type = request.type || request.requestType || "Other";
            const date = request.date || "Date unavailable";
            const statusText = request.status || "Pending";

            const statusCell = document.createElement("td");
            const badge = document.createElement("span");
            badge.className = "badge pending";
            badge.textContent = statusText;
            statusCell.appendChild(badge);

            row.append(
                createCell(id),
                createCell(type),
                createCell(date),
                statusCell
            );

            requestTableBody.appendChild(row);
        });
    }

    // Display submitted event interests.
    function displayInterests() {
        interestList.replaceChildren();

        if (interests.length === 0) {
            interestList.textContent =
                "No event interests submitted yet.";
            return;
        }

        interests.forEach(function (interest) {
            const card = document.createElement("article");
            card.className = "event-interest-card";

            const heading = document.createElement("h3");
            heading.textContent = interest.event || "Event";

            const name = document.createElement("p");
            name.textContent = "Name: " + (interest.name || "Not provided");

            const email = document.createElement("p");
            email.textContent = "Email: " + (interest.email || "Not provided");

            const date = document.createElement("p");
            date.textContent = "Submitted: " + (interest.date || "Unknown");

            card.append(heading, name, email, date);
            interestList.appendChild(card);
        });
    }

    // Update the summary numbers.
    function updateStatistics() {
        document.getElementById("registrationCount").textContent =
            interests.length;

        const pending = requests.filter(function (request) {
            return (request.status || "Pending") === "Pending";
        }).length;

        document.getElementById("pendingCount").textContent = pending;
        document.getElementById("upcomingCount").textContent = "03";
    }

    // Generate a unique request ID.
    function generateRequestId() {
        return "REQ-" + Date.now();
    }

    // Handle Submit Request.
    requestForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("full-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const type = document.getElementById("request-type").value;
        const priority = document.getElementById("priority").value;
        const description = document.getElementById("description").value.trim();
        const message = document.getElementById("requestMessage");

        if (!name || !email || !type || !priority || !description) {
            message.textContent = "Please complete all required fields.";
            return;
        }

        const newRequest = {
            id: generateRequestId(),
            name: name,
            email: email,
            type: type,
            priority: priority,
            details: description,
            status: "Pending",
            date: new Date().toLocaleString()
        };

        requests.unshift(newRequest);

        if (!saveData("schoolRequests", requests)) {
            requests.shift();
            message.textContent =
                "Could not save your request. Please try again.";
            return;
        }

        displayRequests();
        updateStatistics();
        requestForm.reset();

        message.textContent =
            "Request submitted successfully! Your ID is " + newRequest.id + ".";
    });

    // Handle Submit Interest.
    interestForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("attendee-name").value.trim();
        const email = document.getElementById("attendee-email").value.trim();
        const eventName = document.getElementById("event-choice").value;
        const message = document.getElementById("interestMessage");

        if (!name || !email || !eventName) {
            message.textContent =
                "Please enter your name, email, and select an event.";
            return;
        }

        // Avoid registering the same email for the same event twice.
        const alreadyRegistered = interests.some(function (interest) {
            return (
                interest.email &&
                interest.email.toLowerCase() === email.toLowerCase() &&
                interest.event === eventName
            );
        });

        if (alreadyRegistered) {
            message.textContent =
                "This email has already submitted interest in this event.";
            return;
        }

        const newInterest = {
            id: "INT-" + Date.now(),
            name: name,
            email: email,
            event: eventName,
            date: new Date().toLocaleString()
        };

        interests.unshift(newInterest);

        if (!saveData("schoolInterests", interests)) {
            interests.shift();
            message.textContent =
                "Could not save your interest. Please try again.";
            return;
        }

        displayInterests();
        updateStatistics();
        interestForm.reset();

        message.textContent =
            "Your event interest has been saved successfully.";
    });

    // Fill in the event when a card's Register Interest link is clicked.
    document.querySelectorAll(".register-btn[data-event]").forEach(
        function (link) {
            link.addEventListener("click", function () {
                const eventName = link.dataset.event;
                const eventSelect = document.getElementById("event-choice");

                eventSelect.value = eventName;
            });
        }
    );

    // Display saved data when the page opens.
    displayRequests();
    displayInterests();
    updateStatistics();

});

