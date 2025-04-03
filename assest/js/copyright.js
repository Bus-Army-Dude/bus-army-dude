'use strict';

// Prevent right-click context menu
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Prevent text selection
document.addEventListener('selectstart', (event) => {
    event.preventDefault();
});

// Prevent dragging of elements
document.addEventListener('dragstart', (event) => {
    event.preventDefault();
});

// Disable keyboard shortcuts for copying (Ctrl+C, Cmd+C)
document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'x' || event.key === 'a')) {
        event.preventDefault();
    }
});

// Prevent copying via mouse events
document.addEventListener('copy', (event) => {
    event.preventDefault();
});

// Prevent cutting
document.addEventListener('cut', (event) => {
    event.preventDefault();
});
