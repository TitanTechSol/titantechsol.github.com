document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        if (!name || !email) {
            alert('Please fill out all required fields.');
            event.preventDefault();
        }
    });
});