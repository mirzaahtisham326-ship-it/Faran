document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Switcher ---
    const themeSwitcher = document.getElementById('themeSwitcher');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    const htmlElement = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    setTheme(savedTheme);

    themeSwitcher.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // UI state: Sending
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            formStatus.textContent = '';
            formStatus.style.color = 'var(--accent-color)';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('contact.php', {
                    method: 'POST',
                    body: formData
                });

                const responseText = await response.text();
                
                try {
                    const result = JSON.parse(responseText);
                    if (result.status === 'success') {
                        formStatus.textContent = '✓ ' + result.message;
                        formStatus.style.color = '#10b981'; 
                        contactForm.reset();
                    } else {
                        formStatus.textContent = '✕ ' + result.message;
                        formStatus.style.color = '#ef4444'; 
                    }
                } catch (jsonError) {
                    console.error('Server Response:', responseText);
                    formStatus.textContent = '✕ Server Error. Check console for details.';
                    formStatus.style.color = '#ef4444';
                }
            } catch (error) {
                console.error('Error:', error);
                formStatus.textContent = '✕ An error occurred. Please try again.';
                formStatus.style.color = '#ef4444';
            } finally {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        });
    }

    // --- Simple Scroll Reveal ---
    const sections = document.querySelectorAll('section, .stats');
    const revealOnScroll = () => {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (sectionTop < windowHeight * 0.85) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial styles for reveal
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load
});
