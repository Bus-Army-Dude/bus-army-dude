// AI-Based User Behavior Analytics
function trackUserAction(actionType, actionDetails) {
    const userActions = JSON.parse(localStorage.getItem('userActions')) || [];
    const timestamp = new Date().toISOString();
    userActions.push({ actionType, actionDetails, timestamp });
    localStorage.setItem('userActions', JSON.stringify(userActions));
}

// Track button clicks example
document.getElementById("someButton").addEventListener("click", function() {
    trackUserAction("ButtonClick", "Clicked on the 'Submit' button");
});

// AI-Powered Accessibility
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function adjustTextSize(size) {
    document.body.style.fontSize = size + "px";
}

function saveAccessibilityPreferences() {
    const preferences = {
        darkMode: document.body.classList.contains("dark-mode"),
        fontSize: document.body.style.fontSize
    };
    localStorage.setItem("accessibilityPreferences", JSON.stringify(preferences));
}

function loadAccessibilityPreferences() {
    const preferences = JSON.parse(localStorage.getItem("accessibilityPreferences"));
    if (preferences) {
        if (preferences.darkMode) {
            document.body.classList.add("dark-mode");
        }
        document.body.style.fontSize = preferences.fontSize || "16px";
    }
}

loadAccessibilityPreferences();

// Advanced AI Security Alerts
let refreshCount = 0;
const maxRefreshCount = 5;
const refreshLimitTime = 10000; // 10 seconds

setInterval(function() {
    refreshCount++;
    if (refreshCount >= maxRefreshCount) {
        alert("Suspicious behavior detected! Multiple page refreshes.");
        refreshCount = 0;  // Reset counter
    }
}, refreshLimitTime);

// AI-Powered Legal Compliance
function showCookieConsent() {
    const consentBanner = document.createElement("div");
    consentBanner.innerHTML = `
        <p>This website uses cookies to enhance your experience. <button id="acceptCookies">Accept</button></p>
    `;
    document.body.appendChild(consentBanner);

    document.getElementById("acceptCookies").addEventListener("click", function() {
        localStorage.setItem("cookiesAccepted", "true");
        consentBanner.style.display = "none"; // Hide banner after acceptance
    });
}

if (!localStorage.getItem("cookiesAccepted")) {
    showCookieConsent();
}

// AI-Powered Media Protection
document.querySelectorAll("img").forEach(function(image) {
    image.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        alert("Right-click is disabled to protect media.");
    });
});
