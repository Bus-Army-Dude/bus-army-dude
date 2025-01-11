// Detect Print Screen and block it
document.addEventListener('keydown', function(event) {
    if (event.key === 'PrintScreen' || event.key === 'PrtSc') {
        event.preventDefault(); // Prevents screenshot action
        alert('Screenshot detected! Screenshots are not allowed on this page.');
    }
});

// Detect visibility changes (e.g., tab switching)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        alert('We detected you might be trying to capture this content!');
    }
});

// Detect fullscreen mode (user may try to capture content)
document.addEventListener('fullscreenchange', function() {
    if (document.fullscreenElement) {
        alert('Fullscreen mode detected. Screenshots may be taken!');
    }
});

// Disable right-click on the page
document.addEventListener('contextmenu', function(event) {
    event.preventDefault(); // Disable right-click menu
    alert('Right-click is disabled to protect media on this page.');
});

// Block printing of content
window.onbeforeprint = function() {
    alert('Printing is disabled on this page.');
    return false; // Prevents print dialog
};

// Prevent media (images and videos) from being saved
document.addEventListener('touchstart', function(event) {
    if (event.target.tagName === 'IMG') {
        alert('Media protection in place. Screenshots are blocked.');
    }
});
