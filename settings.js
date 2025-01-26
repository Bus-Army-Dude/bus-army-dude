// settings.js
document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById('theme-toggle');
  const notificationsToggle = document.getElementById('notifications-toggle');
  const languageSelect = document.getElementById('language-select');

  // Check and apply stored settings if available
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
  }
  if (localStorage.getItem('notifications') === 'true') {
    notificationsToggle.checked = true;
  }
  if (localStorage.getItem('language')) {
    languageSelect.value = localStorage.getItem('language');
  }

  // Save settings on toggle
  themeToggle.addEventListener('change', () => {
    const isDarkMode = themeToggle.checked;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
  });

  notificationsToggle.addEventListener('change', () => {
    localStorage.setItem('notifications', notificationsToggle.checked);
  });

  languageSelect.addEventListener('change', () => {
    localStorage.setItem('language', languageSelect.value);
  });

  // Optionally, handle saving settings to apply later (like notifications or language preference)
});
