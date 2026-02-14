// script.js — Adds dark mode toggle, smooth scroll, and form handling

// Toggle Dark Mode: add/remove 'dark-mode' class on <body>
const darkToggle = document.querySelector('#dark-toggle');
const body = document.body;

if (darkToggle) {
  // Initialize button text/aria based on current state
  darkToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-mode');
    darkToggle.setAttribute('aria-pressed', String(isDark));
    // Optional: change button label to reflect state
    darkToggle.textContent = isDark ? 'Toggle Light Mode' : 'Toggle Dark Mode';
  });
}

// Smooth Scroll for nav links
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // prevent default jump
    const href = link.getAttribute('href');
    if (!href || href.charAt(0) !== '#') return;
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Contact form handling (no page reload)
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // prevent page reload

    // Get the name input value
    const nameInput = form.querySelector('#name');
    const name = nameInput ? nameInput.value.trim() : '';

    // Create or update a confirmation message below the form
    let msgEl = document.querySelector('.form-message');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.className = 'form-message';
      form.insertAdjacentElement('afterend', msgEl);
    }

    // Insert message into DOM
    msgEl.textContent = `Halo ${name || 'Teman'}, pesan Anda berhasil terkirim!`;

    // Optionally clear the message after a few seconds
    setTimeout(() => {
      if (msgEl) msgEl.textContent = '';
    }, 4500);

    // Optionally reset the form fields (uncomment if you want this)
    // form.reset();
  });
}
