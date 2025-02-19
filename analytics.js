// Google Analytics (moved to external JS file)
window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-E0RSQS1MS7');

// Loading the analytics script dynamically
const analyticsScript = document.createElement('script');
analyticsScript.async = true;
analyticsScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-E0RSQS1MS7';
document.head.appendChild(analyticsScript);
