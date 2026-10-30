
document.addEventListener("DOMContentLoaded", function () {

    function getSavedData(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    // Read alumni saved by alumni.js
    const alumni = getSavedData("schoolAlumni");

    // Read requests saved by requests.js
    const requests = getSavedData("schoolRequests");

    // Read event interests saved by requests.js
    const registrations = getSavedData("schoolInterests");

    // Update alumni count
    document.getElementById("communityCount").textContent =
        alumni.length;

    // Update event registration count
    document.getElementById("registrationCount").textContent =
        registrations.length;

    // Update pending requests count
    const pendingRequests = requests.filter(function (request) {
        return String(request.status || "Pending").toLowerCase() === "pending";
    });

    document.getElementById("pendingCount").textContent =
        pendingRequests.length;

    // Count announcements displayed in the HTML
    const announcements = document.querySelectorAll(".announcement");

    document.getElementById("announcementCount").textContent =
        announcements.length;

});

