document.addEventListener('DOMContentLoaded', () => {
    const protectContent = {
        init() {
            // Disable Right Click
            document.addEventListener('contextmenu', e => e.preventDefault());

            // Disable Text Selection
            document.addEventListener('selectstart', e => e.preventDefault());

            // Disable Copy, Cut, and Paste
            document.addEventListener('copy', e => e.preventDefault());
            document.addEventListener('cut', e => e.preventDefault());
            document.addEventListener('paste', e => e.preventDefault());

            // Disable Drag and Drop (Text & Images)
            document.addEventListener('dragstart', e => e.preventDefault());
            document.addEventListener('drop', e => e.preventDefault());

            // Disable Save As (Ctrl+S / Cmd+S)
            document.addEventListener('keydown', e => {
                if (
                    (e.ctrlKey || e.metaKey) && 
                    ['s', 'u', 'c', 'x', 'v'].includes(e.key.toLowerCase()) // Prevent Save, View Source, Copy, Cut, Paste
                ) {
                    e.preventDefault();
                }

                // Disable F12, Ctrl+Shift+I (Dev Tools)
                if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i')) {
                    e.preventDefault();
                }
            });
        }
    };

    // Activate Content Protection
    protectContent.init();
});
