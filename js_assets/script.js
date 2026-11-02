// Handle both the Enquiries and Contact forms

function setupForm(formId, errorId, successId) {

    const form = document.getElementById(formId);

    // Stop if this form does not exist on the current page
    if (!form) return;

    const errorMessage = document.getElementById(errorId);
    const successMessage = document.getElementById(successId);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    form.addEventListener("submit", async function(event) {

        event.preventDefault();

        errorMessage.textContent = "";
        successMessage.textContent = "";

        // Check HTML5 validation
        if (!form.checkValidity()) {
            form.reportValidity();
            errorMessage.textContent =
                "Please complete all required fields correctly.";
            return;
        }

        // Validate phone number
        const phone = form.querySelector('input[type="tel"]');

        if (phone && !/^[0-9]{9,15}$/.test(phone.value)) {
            errorMessage.textContent =
                "Please enter a valid phone number containing 9 to 15 digits.";
            phone.focus();
            return;
        }

        // Validate message length
        const message = form.querySelector("textarea");

        if (message && message.value.trim().length < 10) {
            errorMessage.textContent =
                "Your message must contain at least 10 characters.";
            message.focus();
            return;
        }

        // Prepare form data
        const formData = new FormData(form);

        try {

            // Disable button while sending
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";

            // Submit information using AJAX
            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Submission failed.");
            }

            successMessage.textContent =
                "Thank you! Your form has been submitted successfully.";

            form.reset();

        } catch (error) {

            errorMessage.textContent =
                "Your form could not be submitted. Please try again later.";

        } finally {

            // Re-enable button after submission
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;

        }

    });

    // Clear messages when the form is reset
    form.addEventListener("reset", function() {
        errorMessage.textContent = "";
        successMessage.textContent = "";
    });

}

// Set up the Enquiries form
setupForm("enquiryForm", "errorMessage", "successMessage");

// Set up the Contact form
setupForm("contactForm", "contactError", "contactSuccess");