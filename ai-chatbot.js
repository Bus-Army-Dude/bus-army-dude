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
        { keywords: ["contact", "support"], response: "You can contact support via discord at busarmydude or email busarmydude@gmail.com." },
        { keywords: ["social media"], response: "You can follow Bus Army Dude on TikTok, YouTube, Snapchat, Twitter, Twitch, Facebook, Steam, Discord, Instagram, and more." },
        { keywords: ["merchandise"], response: "Check out the Merch Store for exclusive Bus Army Dude merchandise at https://riverkritzar-shop.fourthwall.com/" },
        { keywords: ["current president", "president"], response: "The current president is Donald J. Trump, serving from 2025 to 2029." },
        { keywords: ["vice president"], response: "The current vice president is James David Vance." },
        { keywords: ["presidential term"], response: "Donald J. Trump's presidential term is from January 20, 2025, to January 20, 2029." },
        { keywords: ["birthday", "born"], response: "Donald J. Trump was born on June 14, 1946." },
        { keywords: ["height"], response: "Donald J. Trump's height is 6'3\" (190.5 cm)." },
        { keywords: ["political party"], response: "Donald J. Trump is a member of the Republican Party." },
        { keywords: ["discord server", "server"], response: "Join the Bus Army Dude's Community Discord Server at https://discord.gg/NjMtuZYc52." },
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
        { keywords: ["content schedule"], response: "Bus Army Dude posts new content every Monday, Wednesday, and Friday." },
        { keywords: ["latest video"], response: "You can watch Bus Army Dude's latest video on YouTube at https://www.youtube.com/@BusArmyDude." },
        { keywords: ["favorite game"], response: "Bus Army Dude's favorite game is currently Farming Simulator 2025." },
        { keywords: ["gaming setup"], response: "Bus Army Dude's gaming setup includes a 2023 Mac Mini M2, a Razer keyboard and a dell mouse, and a 4K Hisense Roku TV." },
        { keywords: ["collaboration"], response: "Bus Army Dude is open to collaborations. Please contact busarmydude@gmail.com." },
        { keywords: ["events"], response: "Bus Army Dude is currently not hosting any events right now." },
        { keywords: ["streaming schedule"], response: "Bus Army Dude streams coming soon." },
        { keywords: ["features", "website features"], response: "The website includes sections for videos, blogs, merchandise, social media links, and a contact form." },
        { keywords: ["video section", "videos"], response: "The video section includes all of Bus Army Dude's latest videos on YouTube." },
        { keywords: ["blog section", "blogs"], response: "The blog section coming soon." },
        { keywords: ["social media links"], response: "The social media links section provides quick access to all of Bus Army Dude's social media profiles." },
        { keywords: ["security features","security"], response: "This website has the following security features: Context menu prevention, Text selection prevention, copy prevention, drag-and-drop prevention, printing prevention." },
        { keywords: ["merch store"], response: "The merch store features exclusive Bus Army Dude merchandise, available at https://riverkritzar-shop.fourthwall.com/." },
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
        if (e.key === 'Enter' && chatInput.value.trim() !== '') {
            const userMessage = chatInput.value.toLowerCase().trim();
            chatLog.innerHTML += `<p class="user"><strong>You:</strong> ${chatInput.value}</p>`;
            chatInput.value = '';

            let aiResponse = responses.find(response => response.keywords.some(keyword => userMessage.includes(keyword)))?.response 
                             || defaultResponses[Math.floor(Math.random() * defaultResponses.length)];

            chatLog.innerHTML += `<p class="ai"><strong>AI:</strong> ${aiResponse}</p>`;
            chatLog.scrollTop = chatLog.scrollHeight;
        }
    });
});
