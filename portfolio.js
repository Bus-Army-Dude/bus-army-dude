// portfolio.js

// Auto-update the footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Future interactive features can be added here.
// Example: simple scroll reveal for sections
const sections = document.querySelectorAll('.section');
const options = {
  threshold: 0.1,
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, options);

sections.forEach(section => {
  revealOnScroll.observe(section);
});
