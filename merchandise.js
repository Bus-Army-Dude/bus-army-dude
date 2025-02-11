document.addEventListener('DOMContentLoaded', () => {
    // Update footer year
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;
});
