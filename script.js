document.addEventListener('DOMContentLoaded', function() {
    // Load the initial content based on the current URL
    const path = window.location.pathname.split('/').pop();
    loadContent(path || 'home');
});

window.addEventListener('popstate', function(event) {
    // Handle the back/forward buttons
    loadContent(event.state || 'home');
});

function navigate(event, page) {
    event.preventDefault(); // Prevent the default link behavior
    loadContent(page); // Load the content dynamically
    toggleMenu(); // Hide the navigation menu
}

function loadContent(page) {
    const content = document.getElementById('content');
    const pageMap = {
        'home': 'html/home.html',
        'about': 'html/about.html',
        'contact': 'html/contact.html'
    };
    const pagePath = pageMap[page] || 'html/home.html'; // Default to home.html if page not found

    fetch(pagePath)
        .then(response => response.text())
        .then(data => {
            content.innerHTML = data;
            if (page === 'contact') {
                const form = document.querySelector('form');
                form.addEventListener('submit', function(event) {
                    const name = document.getElementById('name').value;
                    const email = document.getElementById('email').value;
                    if (!name || !email) {
                        alert('Please fill out all required fields.');
                        event.preventDefault();
                    }
                });
            }
        })
        .catch(error => console.error('Error loading content:', error));
}

function toggleMenu() {
    var navLinks = document.getElementById('nav-links');
    if (navLinks.style.display === 'block') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'block';
    }
}