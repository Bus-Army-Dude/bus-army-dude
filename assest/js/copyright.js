'use strict';

document.addEventListener("DOMContentLoaded", () => {
    // Prevent text selection
    document.addEventListener("selectstart", (event) => {
        event.preventDefault();
    });

    // Prevent right-click context menu
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    // Prevent copying content
    document.addEventListener("copy", (event) => {
        event.preventDefault();
    });

    // Prevent drag and drop for ALL images
    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("dragstart", (event) => {
            event.preventDefault();
        });
    });

    // Prevent drag and drop for ALL elements
    document.addEventListener("dragstart", (event) => {
        event.preventDefault();
    });

    document.addEventListener("drop", (event) => {
        event.preventDefault();
    });
});
