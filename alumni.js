
document.addEventListener("DOMContentLoaded", function () {

    // 1. Get the HTML elements
    const alumniGrid = document.querySelector(".alumni-grid");
    const searchInput = document.getElementById("searchAlumni");
    const yearFilter = document.getElementById("filterYear");
    const professionFilter = document.getElementById("filterProfession");

    const alumniForm = document.getElementById("alumniForm");
    const editIdInput = document.getElementById("editId");
    const nameInput = document.getElementById("alumniName");
    const yearInput = document.getElementById("alumniYear");
    const professionInput = document.getElementById("alumniProfession");
    const companyInput = document.getElementById("alumniCompany");
    const statusInput = document.getElementById("alumniStatus");

    const saveButton = document.getElementById("saveAlumniBtn");
    const cancelButton = document.getElementById("cancelEditBtn");
    const message = document.getElementById("alumniMessage");

    // Stop if the required HTML elements are missing.
    if (!alumniGrid || !alumniForm) {
        console.error("Alumni directory elements were not found.");
        return;
    }

    // 2. Create the sample alumni records
    const defaultAlumni = [
        {
            id: "1",
            name: "Aditya Sharma",
            year: 2023,
            profession: "Software Engineer",
            company: "Tech Industry",
            status: "Working"
        },
        {
            id: "2",
            name: "Priya Mehta",
            year: 2024,
            profession: "Designer",
            company: "Creative Design",
            status: "Higher Studies"
        },
        {
            id: "3",
            name: "Rahul Kapoor",
            year: 2022,
            profession: "Entrepreneur",
            company: "Business & Startups",
            status: "Working"
        },
        {
            id: "4",
            name: "Ananya Nair",
            year: 2025,
            profession: "Student",
            company: "Technology",
            status: "Higher Studies"
        },
        {
            id: "5",
            name: "Vikram Singh",
            year: 2023,
            profession: "Marketing Executive",
            company: "Marketing & Media",
            status: "Working"
        },
        {
            id: "6",
            name: "Sneha Iyer",
            year: 2024,
            profession: "Data Analyst",
            company: "Data & Analytics",
            status: "Working"
        }
    ];

    // 3. Load saved records, or use the default records.
    let alumni = [];

    try {
        const savedAlumni = localStorage.getItem("schoolAlumni");

        if (savedAlumni === null) {
            alumni = defaultAlumni;
            saveAlumni();
        } else {
            const parsedAlumni = JSON.parse(savedAlumni);

            alumni = Array.isArray(parsedAlumni)
                ? parsedAlumni
                : defaultAlumni;
        }
    } catch (error) {
        alumni = defaultAlumni;
        console.error("Could not load saved alumni records.", error);
    }

    function saveAlumni() {
        try {
            localStorage.setItem("schoolAlumni", JSON.stringify(alumni));
        } catch (error) {
            showMessage("Could not save changes in this browser.", true);
            console.error("Could not save alumni records.", error);
        }
    }

    // 4. Show a message below the form.
    function showMessage(text, isError = false) {
        message.textContent = text;
        message.style.color = isError ? "#c62828" : "#24834a";
    }

    // 5. Create an HTML element safely.
    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    // 6. Display the alumni cards.
    function displayAlumni(records) {
        alumniGrid.replaceChildren();

        if (records.length === 0) {
            const emptyMessage = createElement(
                "p",
                "empty-message",
                "No alumni found. Try changing your search or filters."
            );

            alumniGrid.appendChild(emptyMessage);
            return;
        }

        records.forEach(function (person) {
            const card = createElement("article", "alumni-card");

            const avatar = createElement(
                "div",
                "avatar",
                person.name.charAt(0).toUpperCase()
            );

            const heading = createElement("h3", "", person.name);

            const batch = createElement(
                "p",
                "batch",
                "Graduation Year: " + person.year
            );

            const profession = createElement(
                "p",
                "profession",
                person.profession
            );

            const company = createElement(
                "p",
                "company",
                person.company
            );

            const statusClass =
                person.status === "Higher Studies"
                    ? "status studying"
                    : "status";

            const status = createElement(
                "span",
                statusClass,
                person.status
            );

            const actions = createElement("div", "record-actions");

            const editButton = createElement("button", "edit-btn", "Edit");
            editButton.type = "button";
            editButton.dataset.id = person.id;

            const deleteButton = createElement(
                "button",
                "delete-btn",
                "Delete"
            );

            deleteButton.type = "button";
            deleteButton.dataset.id = person.id;

            actions.append(editButton, deleteButton);

            card.append(
                avatar,
                heading,
                batch,
                profession,
                company,
                status,
                actions
            );

            alumniGrid.appendChild(card);
        });
    }

    // 7. Update the dashboard statistics.
    function updateStatistics() {
        const statNumbers = document.querySelectorAll(".stat-card h2");

        if (statNumbers.length >= 3) {
            statNumbers[0].textContent = alumni.length;

            statNumbers[1].textContent = alumni.filter(function (person) {
                return person.status === "Working";
            }).length;

            statNumbers[2].textContent = alumni.filter(function (person) {
                return person.status === "Higher Studies";
            }).length;
        }
    }

    // 8. Search alumni and apply both filters.
    function applyFilters() {
        const searchText = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        const selectedYear = yearFilter ? yearFilter.value : "";
        const selectedProfession = professionFilter
            ? professionFilter.value
            : "";

        const filteredAlumni = alumni.filter(function (person) {
            const matchesSearch =
                person.name.toLowerCase().includes(searchText) ||
                person.profession.toLowerCase().includes(searchText) ||
                person.company.toLowerCase().includes(searchText);

            const matchesYear =
                selectedYear === "" ||
                String(person.year) === selectedYear;

            const matchesProfession =
                selectedProfession === "" ||
                person.profession === selectedProfession;

            return matchesSearch && matchesYear && matchesProfession;
        });

        displayAlumni(filteredAlumni);
    }

    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    if (yearFilter) {
        yearFilter.addEventListener("change", applyFilters);
    }

    if (professionFilter) {
        professionFilter.addEventListener("change", applyFilters);
    }

    // 9. Add a new record or update an existing one.
    alumniForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const year = Number(yearInput.value);
        const profession = professionInput.value;
        const company = companyInput.value.trim();
        const status = statusInput.value;
        const editingId = editIdInput.value;

        if (!name || !year || !profession || !company || !status) {
            showMessage("Please complete all the fields.", true);
            return;
        }

        if (year < 1950 || year > 2100) {
            showMessage("Enter a valid graduation year.", true);
            return;
        }

        const alumniRecord = {
            id: editingId || String(Date.now()),
            name: name,
            year: year,
            profession: profession,
            company: company,
            status: status
        };

        if (editingId) {
            alumni = alumni.map(function (person) {
                return person.id === editingId ? alumniRecord : person;
            });

            showMessage("Alumni details updated successfully.");
        } else {
            alumni.push(alumniRecord);
            showMessage("New alumni added successfully.");
        }

        saveAlumni();
        alumniForm.reset();
        editIdInput.value = "";
        saveButton.textContent = "Add Alumni";
        cancelButton.hidden = true;

        updateStatistics();
        applyFilters();
    });

    // 10. Handle Edit and Delete button clicks.
    alumniGrid.addEventListener("click", function (event) {
        const clickedButton = event.target.closest("button");

        if (!clickedButton) {
            return;
        }

        const recordId = clickedButton.dataset.id;

        if (!recordId) {
            return;
        }

        // Edit an existing record.
        if (clickedButton.classList.contains("edit-btn")) {
            const person = alumni.find(function (item) {
                return item.id === recordId;
            });

            if (!person) {
                return;
            }

            editIdInput.value = person.id;
            nameInput.value = person.name;
            yearInput.value = person.year;
            professionInput.value = person.profession;
            companyInput.value = person.company;
            statusInput.value = person.status;

            saveButton.textContent = "Update Alumni";
            cancelButton.hidden = false;

            showMessage("Edit the details, then click Update Alumni.");

            document.getElementById("add-alumni").scrollIntoView({
                behavior: "smooth"
            });
        }

        // Delete a record.
        if (clickedButton.classList.contains("delete-btn")) {
            const confirmed = window.confirm(
                "Are you sure you want to delete this alumni record?"
            );

            if (!confirmed) {
                return;
            }

            alumni = alumni.filter(function (person) {
                return person.id !== recordId;
            });

            saveAlumni();
            updateStatistics();
            applyFilters();
            showMessage("Alumni record deleted.");
        }
    });

    // 11. Cancel editing and return to Add mode.
    cancelButton.addEventListener("click", function () {
        alumniForm.reset();
        editIdInput.value = "";
        saveButton.textContent = "Add Alumni";
        cancelButton.hidden = true;

        showMessage("Editing cancelled.");
    });

    // 12. Display the records when the page first opens.
    updateStatistics();
    applyFilters();

});
