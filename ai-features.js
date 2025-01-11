<script>
    // Open the chatbox
    function openChat() {
        document.getElementById("chatbox").style.display = "block";
    }

    // Send a message
    function sendMessage() {
        var userMessage = document.getElementById("userMessage").value;
        if (userMessage.trim() !== "") {
            // Display user's message
            document.getElementById("chatlog").innerHTML += "<p><b>You:</b> " + userMessage + "</p>";
            document.getElementById("userMessage").value = "";  // Clear the input field

            // Chatbot response
            getBotResponse(userMessage);
        }
    }

    // Check if the user presses Enter
    function checkInput(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    }

    // Get chatbot's response based on user input
    function getBotResponse(userMessage) {
        let botMessage = "";

        // Simple example of responses based on user input
        if (userMessage.toLowerCase().includes("hello")) {
            botMessage = "Hello! How can I assist you today?";
        } else if (userMessage.toLowerCase().includes("help")) {
            botMessage = "Sure! What do you need help with?";
        } else if (userMessage.toLowerCase().includes("goodbye")) {
            botMessage = "Goodbye! Feel free to reach out anytime.";
        } else {
            botMessage = "I'm sorry, I don't understand. Can you please rephrase?";
        }

        // Display chatbot's response
        document.getElementById("chatlog").innerHTML += "<p><b>Bot:</b> " + botMessage + "</p>";
        document.getElementById("chatlog").scrollTop = document.getElementById("chatlog").scrollHeight;  // Scroll to bottom
    }
</script>
