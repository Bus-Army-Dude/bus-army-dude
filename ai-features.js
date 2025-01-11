// Open the chatbox when the user clicks the button
function openChat() {
    const chatBox = document.getElementById("chatbox");
    if (chatBox.style.display === "none" || chatBox.style.display === "") {
        chatBox.style.display = "block";  // Show the chatbox
    } else {
        chatBox.style.display = "none";  // Hide the chatbox if already open
    }
}

// Send message when the user presses the send button
function sendMessage() {
    var userMessage = document.getElementById("userMessage").value;
    if (userMessage.trim() !== "") {
        // Display the user's message
        addMessageToChatLog("You", userMessage);

        // Save the chat history to localStorage
        saveChatHistory();

        document.getElementById("userMessage").value = "";  // Clear the input field

        // Get bot's response
        getBotResponse(userMessage);
    }
}

// Check if the user presses 'Enter' to send a message
function checkInput(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Simple response logic based on user input
function getBotResponse(userMessage) {
    let botMessage = "";

    // Lowercase the input to handle cases like "Hello" or "HELLO"
    userMessage = userMessage.toLowerCase();

    // Define simple responses based on keywords in the user's message
    if (userMessage.includes("hello") || userMessage.includes("hi")) {
        botMessage = "Hello! How can I assist you today?";
    } else if (userMessage.includes("help")) {
        botMessage = "Sure! How can I help you? What do you need assistance with?";
    } else if (userMessage.includes("bye")) {
        botMessage = "Goodbye! Have a great day!";
    } else if (userMessage.includes("your name")) {
        botMessage = "I'm your friendly chatbot, here to help!";
    } else {
        botMessage = "I'm sorry, I didn't quite understand that. Could you rephrase?";
    }

    // Display the bot's response
    addMessageToChatLog("Bot", botMessage);

    // Keep the chat scrolled to the bottom
    document.getElementById("chatlog").scrollTop = document.getElementById("chatlog").scrollHeight;
}

// Add a message to the chat log
function addMessageToChatLog(sender, message) {
    document.getElementById("chatlog").innerHTML += "<p><b>" + sender + ":</b> " + message + "</p>";
}

// Save the chat history to localStorage
function saveChatHistory() {
    const chatHistory = document.getElementById("chatlog").innerHTML;
    localStorage.setItem("chatHistory", chatHistory);  // Store chat history in localStorage
}

// Load the chat history from localStorage when the page is loaded
function loadChatHistory() {
    const chatHistory = localStorage.getItem("chatHistory");
    if (chatHistory) {
        document.getElementById("chatlog").innerHTML = chatHistory;  // Display saved chat history
    }
}

// Load chat history on page load
window.onload = loadChatHistory;
