// Services navigation functionality
var servicesTab = document.getElementById("services-tab");
var servicesPanel = document.getElementById("services-panel");
var closeNav = document.getElementById("closeNav");

if (servicesTab && servicesPanel) {
    servicesTab.addEventListener("click", function (e) {
        e.preventDefault();
        if (servicesPanel.style.display === "none" || servicesPanel.style.display === "") {
            servicesPanel.style.display = "block";
            servicesPanel.setAttribute("aria-hidden", "false");
            servicesTab.setAttribute("aria-expanded", "true");
        } else {
            servicesPanel.style.display = "none";
            servicesPanel.setAttribute("aria-hidden", "true");
            servicesTab.setAttribute("aria-expanded", "false");
        }
    });
}

// Close navigation with Escape key
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        if (servicesPanel && servicesPanel.style.display === "block") {
            servicesPanel.style.display = "none";
            servicesPanel.setAttribute("aria-hidden", "true");
            servicesTab.setAttribute("aria-expanded", "false");
        }
    }
});

if (closeNav) {
    closeNav.addEventListener("click", function (e) {
        e.preventDefault();
        servicesPanel.style.display = "none";
        servicesPanel.setAttribute("aria-hidden", "true");
        servicesTab.setAttribute("aria-expanded", "false");
    });
}

// Copy functionality
document.addEventListener("DOMContentLoaded", function () {
    const copyButtons = document.querySelectorAll(".copy-btn");

    copyButtons.forEach(button => {
        button.addEventListener("click", function () {
            const targetId = this.getAttribute("data-copy-target");
            const codeElement = document.getElementById(targetId);
            
            if (!codeElement) {
                console.error("Target element not found:", targetId);
                return;
            }

            const textToCopy = codeElement.innerText || codeElement.textContent;

            if (!textToCopy) {
                console.error("No text content found in target element");
                return;
            }

            // Try modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        showCopySuccess(this);
                    })
                    .catch(err => {
                        console.error("Failed to copy text using clipboard API:", err);
                        // Fallback to older method
                        fallbackCopyTextToClipboard(textToCopy, this);
                    });
            } else {
                // Fallback for older browsers or non-secure contexts
                fallbackCopyTextToClipboard(textToCopy, this);
            }
        });
    });
});

// Fallback copy method for older browsers
function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(button);
        } else {
            console.error("Fallback copy command failed");
            showCopyError(button);
        }
    } catch (err) {
        console.error("Fallback copy failed:", err);
        showCopyError(button);
    }
    
    document.body.removeChild(textArea);
}

// Show success message
function showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = "Copied!";
    button.classList.add("govuk-button--success");
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("govuk-button--success");
    }, 2000);
}

// Show error message
function showCopyError(button) {
    const originalText = button.textContent;
    button.textContent = "Copy failed";
    button.classList.add("govuk-button--warning");
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("govuk-button--warning");
    }, 2000);
}
