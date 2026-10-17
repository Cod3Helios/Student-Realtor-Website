document.addEventListener("DOMContentLoaded", () => {
    const currentDate = new Date();
    const footerParagraphs = document.querySelectorAll("footer p:last-of-type");
    footerParagraphs.forEach((p) => {
        p.textContent = `© ${currentDate.getFullYear()} Helios & Co. All rights reserved. | Listings verified ${currentDate.toLocaleDateString()}`;
    });

    const tableBody = document.getElementById("comparisonBody");
    if (tableBody) {
        const propertyMap = new Map([
            ["Cortland Nona", { proximity: "8.7 miles", rate: 695, unitLabel: "$695 / room", plan: "4 Bed, 2 Bath", parking: "Open Lot" }],
            ["Ascend Nona West", { proximity: "7.3 miles", rate: 1150, unitLabel: "$1,150 / unit", plan: "1 Bed, 1 Bath", parking: "1-Car Garage" }],
            ["Dwell Nona Place", { proximity: "7.1 miles", rate: 780, unitLabel: "$780 / room", plan: "3 Bed, 2 Bath", parking: "Open Lot" }],
            ["The Village at Science Drive", { proximity: "6.8 miles", rate: 650, unitLabel: "$650 / room", plan: "2 Bed, 2 Bath", parking: "Open Lot" }],
            ["The Verge", { proximity: "6.5 miles", rate: 600, unitLabel: "$600 / room", plan: "2 Bed, 1 Bath", parking: "Open Lot" }],
            ["Current Orlando", { proximity: "5 miles", rate: 1200, unitLabel: "$1,200 / unit", plan: "1 Bed, 2 Bath", parking: "1-Car Garage" }]
        ]);

        function renderComparisonTable(maxBudget = null) {
            tableBody.innerHTML = "";
            for (const [communityName, details] of propertyMap.entries()) {
                const row = document.createElement("tr");
                if (maxBudget !== null) {
                    if (details.rate <= maxBudget) {
                        row.classList.add("budget-match");
                    } else {
                        row.classList.add("over-budget");
                    }
                }

                const columns = [communityName, details.proximity, details.unitLabel, details.plan, details.parking];
                for (let i = 0; i < columns.length; i++) {
                    const cell = document.createElement("td");
                    cell.textContent = columns[i];
                    row.appendChild(cell);
                }
                tableBody.appendChild(row);
            }
        }

        renderComparisonTable();

        const filterBtn = document.getElementById("filterBtn");
        if (filterBtn) {
            filterBtn.addEventListener("click", () => {
                const budgetInput = document.getElementById("budgetInput");
                const feedback = document.getElementById("filterFeedback");
                const value = budgetInput.value.trim();
                const budget = Number(value);

                try {
                    if (value === "" || isNaN(budget) || budget < 0) {
                        throw new Error("Please enter a valid monthly budget of $0 or more.");
                    }

                    renderComparisonTable(budget);
                    feedback.textContent = `Communities at or below $${budget}/month are highlighted.`;
                    feedback.className = "filter-feedback";
                } catch (error) {
                    feedback.textContent = error.message;
                    feedback.className = "filter-feedback filter-feedback--error";
                }
            });
        }
    }

    const inquiryForm = document.getElementById("inquiryForm");
    if (inquiryForm) {
        inquiryForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const rawName = document.getElementById("studentName").value;
            const rawEmail = document.getElementById("studentEmail").value;
            const selectedProperty = document.getElementById("propertySelect").value;
            const message = document.getElementById("studentMessage").value;
            const formFeedback = document.getElementById("formFeedback");

            const cleanName = rawName.trim();
            const cleanEmail = rawEmail.trim().toLowerCase();
            const cleanMessage = message.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            formFeedback.innerHTML = "";
            formFeedback.className = "form-feedback";

            try {
                if (cleanName.length < 2) {
                    throw new Error("Full name is required and must be at least 2 characters.");
                }
                if (!emailPattern.test(cleanEmail)) {
                    throw new Error("Please enter a valid college email address.");
                }
                if (selectedProperty === "") {
                    throw new Error("Please select a community you are interested in.");
                }
                if (cleanMessage.length < 10) {
                    throw new Error("Please include a message of at least 10 characters.");
                }

                const words = cleanName.split(" ");
                const capitalizedWords = [];
                for (let i = 0; i < words.length; i++) {
                    if (words[i].length > 0) {
                        capitalizedWords.push(words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase());
                    }
                }
                const formattedName = capitalizedWords.join(" ");

                const subject = `Housing inquiry (${currentDate.toLocaleDateString()}): ${selectedProperty}`;
                const body = `Name: ${formattedName}\nEmail: ${cleanEmail}\nCommunity: ${selectedProperty}\n\n${cleanMessage}`;

                const emailLink = document.createElement("a");
                emailLink.href = `mailto:contact@heliosco.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                emailLink.textContent = "Open an email draft to send your inquiry";

                formFeedback.append(
                    document.createTextNode(`Thank you, ${formattedName}! Your inquiry is ready. `),
                    emailLink
                );
                formFeedback.classList.add("form-feedback--success");
            } catch (validationError) {
                formFeedback.textContent = validationError.message;
                formFeedback.classList.add("form-feedback--error");
            }
        });
    }
});