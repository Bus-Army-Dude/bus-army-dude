// common.js - Common functionality across all pages
// Version: 2.0.0
// Last Updated: 2025-04-27
// Author: BusArmyDude

document.addEventListener('DOMContentLoaded', () => {
    // Initialize settings from localStorage
    try {
        const settings = JSON.parse(localStorage.getItem('websiteSettings')) || {
            darkMode: true,
            fontSize: 14,
            focusOutline: 'disabled',
            lastUpdate: Date.now()
        };

        // Apply focus outline setting
        if (settings.focusOutline === 'disabled') {
            document.body.classList.add('focus-outline-disabled');
        }

        // Apply dark mode setting
        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        // Apply default settings if there's an error
        document.body.classList.add('focus-outline-disabled');
        document.body.classList.add('dark-mode');
    }

    // Setup navigation menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('show');
            menuToggle.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (navMenu && 
            navMenu.classList.contains('show') && 
            !navMenu.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            navMenu.classList.remove('show');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Update URL without scrolling
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });

    // Back to top button functionality
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Handle external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.hostname.includes(window.location.hostname)) {
            link.setAttribute('rel', 'noopener noreferrer');
            link.setAttribute('target', '_blank');
            
            // Add external link icon if not already present
            if (!link.querySelector('.fa-external-link-alt')) {
                const icon = document.createElement('i');
                icon.className = 'fas fa-external-link-alt';
                icon.style.marginLeft = '0.5em';
                icon.style.fontSize = '0.8em';
                link.appendChild(icon);
            }
        }
    });

    // Initialize tooltips if any
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
            tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
            
            element.addEventListener('mouseleave', () => tooltip.remove());
        });
    });

    // Handle form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });

    // Initialize lazy loading for images
    document.querySelectorAll('img[data-src]').forEach(img => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        observer.observe(img);
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        // ESC key closes any open menus
        if (e.key === 'Escape') {
            if (navMenu && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.message);
    // You could add error reporting here
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const timing = performance.timing;
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    });
}

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// Add custom event for theme changes
const themeChangeEvent = new CustomEvent('themeChange', {
    detail: { timestamp: new Date().toISOString() }
});

// Export any needed functions
export const utils = {
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};
