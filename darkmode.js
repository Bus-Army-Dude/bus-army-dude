// Check for saved user preference on page load
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('theme-toggle');
  
  // Check if dark mode is already enabled in localStorage
  const isDarkMode = localStorage.getItem('dark-mode') === 'true';

  // Apply dark mode class to body
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    darkModeToggle.checked = false;
  }

  // Toggle dark mode when user interacts with the checkbox
  darkModeToggle.addEventListener('change', (event) => {
    const isChecked = event.target.checked;

    // Apply dark mode class to body
    if (isChecked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('dark-mode', 'true');  // Save preference to localStorage
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('dark-mode', 'false'); // Save preference to localStorage
    }
  });
});
