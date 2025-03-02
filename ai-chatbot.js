document.addEventListener('DOMContentLoaded', function () {
    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatPopup = document.getElementById('chat-popup');
    const chatInput = document.getElementById('chat-input');
    const chatLog = document.getElementById('chat-log');

    const responses = {
        "hello": "Hi there! How can I assist you today?",
        "how are you": "I'm just a computer program, so I don't have feelings, but thanks for asking!",
        "what is your name": "I am an AI chat assistant created to help you.",
        "bye": "Goodbye! Have a great day!",
        "default": "I'm sorry, I don't understand that. Can you please rephrase?"
    };

    openChatBtn.addEventListener('click', function () {
        chatPopup.style.display = 'block';
    });

    closeChatBtn.addEventListener('click', function () {
        chatPopup.style.display = 'none';
    });

    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const userMessage = chatInput.value.toLowerCase();
            chatLog.innerHTML += `<p><strong>You:</strong> ${chatInput.value}</p>`;
            chatInput.value = '';

            let aiResponse = responses["default"];
            for (const key in responses) {
                if (userMessage.includes(key)) {
                    aiResponse = responses[key];
                    break;
                }
            }

            chatLog.innerHTML += `<p><strong>AI:</strong> ${aiResponse}</p>`;
            chatLog.scrollTop = chatLog.scrollHeight;
        }
    });
});
