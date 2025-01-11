// Detecting PrintScreen on Desktop (Windows, Linux)
document.addEventListener('keydown', function(event) {
    if (event.key === 'PrintScreen' || event.key === 'PrtScn') {
        event.preventDefault(); // Prevent the default PrintScreen action

        // Apply blur effect to the page
        document.body.classList.add('blurred');
        
        // Optional: Show a warning alert to the user
        alert("Screenshot detected! Please refrain from taking screenshots.");
        
        // Remove the blur effect after a short delay (e.g., 2 seconds)
        setTimeout(function() {
            document.body.classList.remove('blurred');
        }, 2000); // 2-second delay before removing blur
    }
});

// Detecting touch events (e.g., 3-finger swipe on mobile devices) to simulate screenshot detection
document.addEventListener('touchstart', function(event) {
    if (event.touches.length === 3) {  // Assuming 3-finger touch as a screenshot gesture
        event.preventDefault(); // Prevent the default action
        
        // Apply blur effect to the page
        document.body.classList.add('blurred');
        
        // Optional: Show a warning alert to the user
        alert("Screenshot detected! Please refrain from taking screenshots.");
        
        // Remove the blur effect after a short delay (e.g., 2 seconds)
        setTimeout(function() {
            document.body.classList.remove('blurred');
        }, 2000); // 2-second delay before removing blur
    }
});

// Block right-click on the page to prevent saving images or media
document.addEventListener('contextmenu', function(event) {
    event.preventDefault(); // Disable right-click
    alert("Right-click disabled to prevent saving media.");
});

// Disable dragging of images to prevent saving them
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', function(event) {
        event.preventDefault(); // Prevent dragging of images
    });
});
