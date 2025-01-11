<!-- Chatbot Button -->
<button onclick="openChat()">Chat with us!</button>

<!-- Chatbox -->
<div id="chatbox" style="display: none;">
    <div id="chatlog"></div>
    <input type="text" id="userMessage" placeholder="Type your message..." onkeyup="checkInput(event)">
    <button onclick="sendMessage()">Send</button>
</div>

<script>
// Open the chatbox when the user clicks the button
function openChat() {
    const chatBox = document.getElementById("chatbox");
    if (chatBox.style.display === "none") {
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
        document.getElementById("chatlog").innerHTML += "<p><b>You:</b> " + userMessage + "</p>";
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
    document.getElementById("chatlog").innerHTML += "<p><b>Bot:</b> " + botMessage + "</p>";

    // Keep the chat scrolled to the bottom
    document.getElementById("chatlog").scrollTop = document.getElementById("chatlog").scrollHeight;
}
</script>
