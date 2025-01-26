document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Check if the user has a saved preference, otherwise default to light mode
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  } else {
    body.classList.remove("dark-mode");
    darkModeToggle.checked = false;
  }

  // When the toggle is changed
  darkModeToggle.addEventListener("change", () => {
    if (darkModeToggle.checked) {
      body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled"); // Save the preference
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled"); // Save the preference
    }
  });
});
