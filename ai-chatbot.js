document.addEventListener('DOMContentLoaded', function () {
    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatPopup = document.getElementById('chat-popup');
    const chatInput = document.getElementById('chat-input');
    const chatLog = document.getElementById('chat-log');

    const responses = [
        { keywords: ["hello", "hi"], response: "Hi there! How can I assist you today?" },
        { keywords: ["how are you"], response: "I'm just a computer program, so I don't have feelings, but thanks for asking!" },
        { keywords: ["what is your name"], response: "I am an AI chat assistant created to help you." },
        { keywords: ["bye", "goodbye"], response: "Goodbye! Have a great day!" },
        { keywords: ["what can you do"], response: "I can assist you with basic questions and provide information about Bus Army Dude. How can I help you?" },
        { keywords: ["tell me a joke"], response: "Why don't scientists trust atoms? Because they make up everything!" },
        { keywords: ["who is bus army dude"], response: "Bus Army Dude is a content creator focusing on gaming, tech reviews, AFO journey documentation, and lifestyle content." },
        { keywords: ["contact", "support"], response: "You can contact support via the contact form on the website or email support@busarmydude.com." },
        { keywords: ["social media"], response: "You can follow Bus Army Dude on TikTok, YouTube, Snapchat, Twitter, Twitch, Facebook, Steam, Discord, Instagram, and more." },
        { keywords: ["merchandise"], response: "Check out the Merch Store for exclusive Bus Army Dude merchandise at https://riverkritzar-shop.fourthwall.com/" },
        { keywords: ["current president"], response: "The current president is Donald J. Trump, serving from 2025 to 2029." },
        { keywords: ["vice president"], response: "The current vice president is James David Vance." },
        { keywords: ["presidential term"], response: "Donald J. Trump's presidential term is from January 20, 2025, to January 20, 2029." },
        { keywords: ["birthday", "born"], response: "Donald J. Trump was born on June 14, 1946." },
        { keywords: ["height"], response: "Donald J. Trump's height is 6'3\" (190.5 cm)." },
        { keywords: ["political party"], response: "Donald J. Trump is a member of the Republican Party." },
        { keywords: ["discord server"], response: "Join the Bus Army Dude's Community Discord Server at https://discord.gg/NjMtuZYc52." },
        { keywords: ["website status"], response: "Check the website status at https://bus-army-dude.instatus.com/." },
        { keywords: ["countdown"], response: "Countdown to Spring 2025 is available on the website." },
        { keywords: ["discord username"], response: "Bus Army Dude's Discord username is busarmydude." },
        { keywords: ["youtube channel"], response: "Bus Army Dude's YouTube channel is https://www.youtube.com/@BusArmyDude." },
        { keywords: ["tiktok account"], response: "Bus Army Dude's TikTok account is https://www.tiktok.com/@officalbusarmydude." },
        { keywords: ["snapchat username"], response: "Bus Army Dude's Snapchat username is riverkritzar." },
        { keywords: ["twitter handle"], response: "Bus Army Dude's Twitter handle is KritzarRiver." },
        { keywords: ["twitch channel"], response: "Bus Army Dude's Twitch channel is https://m.twitch.tv/BusArmyDude." },
        { keywords: ["facebook profile"], response: "Bus Army Dude's Facebook profile is https://www.facebook.com/profile.php?id=61569972389004." },
        { keywords: ["steam profile"], response: "Bus Army Dude's Steam profile is https://steamcommunity.com/profiles/76561199283946668." },
        { keywords: ["instagram account"], response: "Bus Army Dude's Instagram account is https://www.instagram.com/busarmydude/." },
        { keywords: ["threads account"], response: "Bus Army Dude's Threads account is https://www.threads.net/@busarmydude." },
        { keywords: ["bluesky profile"], response: "Bus Army Dude's Bluesky profile is https://bsky.app/profile/busarmydude.bsky.social." },
        { keywords: ["youtube music account"], response: "Bus Army Dude's YouTube Music account is https://music.youtube.com/@BusArmyDude." },
        { keywords: ["default"], response: "I'm sorry, I don't understand that. Can you please rephrase?" }
    ];

    const defaultResponses = [
        "I'm here to help! Can you please provide more details or ask a different question?",
        "I'm not sure about that. Maybe try asking in a different way?",
        "I'm here to assist you. Can you please clarify your question?",
        "I'm sorry, I don't have the information you're looking for. Can you ask something else?"
    ];

    openChatBtn.addEventListener('click', function () {
        chatPopup.style.display = 'block';
    });

    closeChatBtn.addEventListener('click', function () {
        chatPopup.style.display = 'none';
    });

    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const userMessage = chatInput.value.toLowerCase();
            chatLog.innerHTML += `<p class="user"><strong>You:</strong> ${chatInput.value}</p>`;
            chatInput.value = '';

            let aiResponse = responses.find(response => response.keywords.some(keyword => userMessage.includes(keyword)))?.response 
                             || defaultResponses[Math.floor(Math.random() * defaultResponses.length)];

            // Check for specific commands and update settings
            if (userMessage.includes("turn off dark mode")) {
                aiResponse = "Dark mode has been turned off.";
                document.body.classList.remove('dark-mode');
                if (document.getElementById('darkModeToggle')) {
                    document.getElementById('darkModeToggle').checked = false;
                }
                localStorage.setItem('darkMode', 'disabled');
            } else if (userMessage.includes("turn on dark mode")) {
                aiResponse = "Dark mode has been turned on.";
                document.body.classList.add('dark-mode');
                if (document.getElementById('darkModeToggle')) {
                    document.getElementById('darkModeToggle').checked = true;
                }
                localStorage.setItem('darkMode', 'enabled');
            } else if (userMessage.includes("disable focus outline")) {
                aiResponse = "Focus outline has been disabled.";
                document.body.classList.add('focus-outline-disabled');
                if (document.getElementById('focusOutlineToggle')) {
                    document.getElementById('focusOutlineToggle').checked = false;
                }
                localStorage.setItem('focusOutline', 'disabled');
            } else if (userMessage.includes("enable focus outline")) {
                aiResponse = "Focus outline has been enabled.";
                document.body.classList.remove('focus-outline-disabled');
                if (document.getElementById('focusOutlineToggle')) {
                    document.getElementById('focusOutlineToggle').checked = true;
                }
                localStorage.setItem('focusOutline', 'enabled');
            } else if (userMessage.includes("set text size default")) {
                aiResponse = "Text size has been set to default.";
                document.body.classList.remove('text-size-large', 'text-size-larger');
                document.body.classList.add('text-size-default');
                if (document.getElementById('textSizeSelect')) {
                    document.getElementById('textSizeSelect').value = 'default';
                }
                localStorage.setItem('textSize', 'default');
            } else if (userMessage.includes("set text size large")) {
                aiResponse = "Text size has been set to large.";
                document.body.classList.remove('text-size-default', 'text-size-larger');
                document.body.classList.add('text-size-large');
                if (document.getElementById('textSizeSelect')) {
                    document.getElementById('textSizeSelect').value = 'large';
                }
                localStorage.setItem('textSize', 'large');
            } else if (userMessage.includes("set text size larger")) {
                aiResponse = "Text size has been set to larger.";
                document.body.classList.remove('text-size-default', 'text-size-large');
                document.body.classList.add('text-size-larger');
                if (document.getElementById('textSizeSelect')) {
                    document.getElementById('textSizeSelect').value = 'larger';
                }
                localStorage.setItem('textSize', 'larger');
            }

            chatLog.innerHTML += `<p class="ai"><strong>AI:</strong> ${aiResponse}</p>`;
            chatLog.scrollTop = chatLog.scrollHeight;
        }
    });

    // Load initial settings
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        if (document.getElementById('darkModeToggle')) {
            document.getElementById('darkModeToggle').checked = true;
        }
    }

    if (localStorage.getItem('focusOutline') === 'enabled') {
        document.body.classList.remove('focus-outline-disabled');
        if (document.getElementById('focusOutlineToggle')) {
            document.getElementById('focusOutlineToggle').checked = true;
        }
    } else {
        document.body.classList.add('focus-outline-disabled');
        if (document.getElementById('focusOutlineToggle')) {
            document.getElementById('focusOutlineToggle').checked = false;
        }
    }

    const textSize = localStorage.getItem('textSize');
    if (textSize) {
        document.body.classList.add(`text-size-${textSize}`);
        if (document.getElementById('textSizeSelect')) {
            document.getElementById('textSizeSelect').value = textSize;
        }
    }
});
