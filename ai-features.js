// Prevent Print Screen and Print (for Windows, macOS, and Linux)
document.addEventListener('keydown', function(event) {
    // Block PrintScreen key for all devices (Windows, macOS, Linux)
    if (event.key === 'PrintScreen' || event.key === 'PrtScn') {
        event.preventDefault();
        alert("Screenshots are disabled on this page.");
    }

    // Block printing (Ctrl+P or Cmd+P)
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        alert("Printing is disabled on this page.");
    }

    // Block copy (Ctrl+C or Cmd+C)
    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        event.preventDefault();
        alert("Copying is disabled on this page.");
    }

    // Block cut (Ctrl+X or Cmd+X)
    if ((event.ctrlKey || event.metaKey) && event.key === 'x') {
        event.preventDefault();
        alert("Cutting is disabled on this page.");
    }

    // Block paste (Ctrl+V or Cmd+V)
    if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        event.preventDefault();
        alert("Pasting is disabled on this page.");
    }
});

// Disable right-click for all devices (Windows, macOS, Android, iOS)
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    alert("Right-click is disabled on this page.");
});

// Disable drag and drop for images
document.querySelectorAll('img').forEach(function(img) {
    img.style.pointerEvents = 'none';
    img.setAttribute('draggable', false);  // Disable drag for all images
});

// Prevent text selection for all devices
document.body.style.userSelect = 'none';
document.body.style.webkitUserSelect = 'none';
document.body.style.mozUserSelect = 'none';
document.body.style.msUserSelect = 'none';

// Prevent zoom and pinch gestures on mobile
document.body.style.touchAction = 'none';

// Prevent right-click on images and other elements
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// Prevent saving images on touch devices by disabling touch actions
document.querySelectorAll('img').forEach(function(img) {
    img.style.pointerEvents = 'none';
    img.setAttribute('draggable', false); // Disable drag for all images
});

// Prevent video controls for mobile devices
if (window.innerWidth <= 768) {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.setAttribute('controls', false); // Disable controls for videos
    });
}

// Disable image right-click on touch devices
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('touchstart', function(event) {
        event.preventDefault();  // Prevent touch actions like saving images
    });
});
