// AI-Based User Behavior Analytics
let startTime = Date.now();

document.addEventListener('mousemove', function(e) {
    console.log(`Mouse moved to X: ${e.pageX}, Y: ${e.pageY}`);
});

document.addEventListener('click', function(e) {
    console.log(`User clicked on element: ${e.target.tagName}`);
});

window.addEventListener('beforeunload', function() {
    let timeSpent = Date.now() - startTime;
    console.log(`User spent ${timeSpent / 1000} seconds on the page.`);
});

// AI-Powered Accessibility
function speakText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
}

document.getElementById("accessibility-toggle").addEventListener("click", function() {
    document.body.style.fontSize = "18px"; // Larger text
    speakText("Accessibility mode activated.");
});

// Advanced AI Security Alerts
function detectSecurityBreach() {
    let failedAttempts = 3;
    if (failedAttempts >= 3) {
        alert("Warning: Multiple failed login attempts detected!");
    }
}

// AI-Powered Legal Compliance
function checkLegalCompliance() {
    let consent = window.confirm("We use cookies to enhance your experience. Do you consent to data collection?");
    if (!consent) {
        alert("You have declined data collection.");
    } else {
        alert("You have agreed to data collection.");
    }
}

checkLegalCompliance();

// AI-Powered Media Protection
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    alert("Right-click is disabled for media protection.");
});

document.addEventListener("keydown", function(event) {
    if (event.key === "PrintScreen") {
        alert("Screenshots are disabled.");
        event.preventDefault();
    }
});

// AI Chatbot Features
document.getElementById("chatbot-send").addEventListener("click", function() {
    const userInput = document.getElementById("chatbot-input").value;
    if (userInput.trim()) {
        const userMessage = document.createElement("div");
        userMessage.classList.add("user-message");
        userMessage.innerText = userInput;
        document.getElementById("chatbot-messages").appendChild(userMessage);
        document.getElementById("chatbot-input").value = "";

        fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer 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`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: userInput,
                max_tokens: 150
            })
        })
        .then(response => response.json())
        .then(data => {
            const botResponse = data.choices[0].text;
            const botMessage = document.createElement("div");
            botMessage.classList.add("bot-message");
            botMessage.innerText = botResponse.trim();
            document.getElementById("chatbot-messages").appendChild(botMessage);
        })
        .catch(error => {
            console.error("Error:", error);
            const botMessage = document.createElement("div");
            botMessage.classList.add("bot-message");
            botMessage.innerText = "Sorry, I couldn't understand that.";
            document.getElementById("chatbot-messages").appendChild(botMessage);
        });
    }
});
