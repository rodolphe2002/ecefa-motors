          const BASE_URL = "http://localhost:5000";
//   const BASE_URL = "https://inscription-ecefa.onrender.com";
        
        
        // GSAP Animations
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize GSAP with ScrollTrigger
            gsap.registerPlugin(ScrollTrigger);



            
            
            // Hero animation
            gsap.to('.contact-hero h1', {
                duration: 1,
                y: 0,
                opacity: 1,
                ease: "power3.out"
            });
            
            gsap.to('.contact-hero p', {
                duration: 1,
                y: 0,
                opacity: 1,
                delay: 0.3,
                ease: "power3.out"
            });
            
            // Form animation
            gsap.to('.contact-form', {
                scrollTrigger: {
                    trigger: '.contact-form',
                    start: "top 90%",
                    toggleActions: "play none none none"
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out"
            });
            
            // Info animation
            gsap.to('.contact-info', {
                scrollTrigger: {
                    trigger: '.contact-info',
                    start: "top 90%",
                    toggleActions: "play none none none"
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.2,
                ease: "power3.out"
            });
            
            // Map animation
            gsap.to('.map-container', {
                scrollTrigger: {
                    trigger: '.map-container',
                    start: "top 90%",
                    toggleActions: "play none none none"
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out"
            });
            
            // Header scroll effect
            window.addEventListener('scroll', function() {
                const header = document.querySelector('header');
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
            
            // Hamburger menu toggle
            const hamburger = document.querySelector('.hamburger');
            const navLinks = document.querySelector('.nav-links');
            
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
            });
            
            // Form validation
            const contactForm = document.getElementById('contactForm');
            const loader = document.querySelector('.form-loader');
            const submitBtn = document.querySelector('.submit-btn span');
            const successMessage = document.querySelector('.success-message');
            
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Reset errors
                document.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('error');
                });
                
                let isValid = true;
                
                // Validate name
                const name = document.getElementById('name');
                if (!name.value.trim()) {
                    name.parentElement.classList.add('error');
                    isValid = false;
                }
                
                // Validate email
                const email = document.getElementById('email');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email.value.trim() || !emailRegex.test(email.value)) {
                    email.parentElement.classList.add('error');
                    isValid = false;
                }
                
                // Validate phone
                const phone = document.getElementById('phone');
                if (!phone.value.trim()) {
                    phone.parentElement.classList.add('error');
                    isValid = false;
                }
                
                // Validate subject
                const subject = document.getElementById('subject');
                if (!subject.value) {
                    subject.parentElement.classList.add('error');
                    isValid = false;
                }
                
                // Validate message
                const message = document.getElementById('message');
                if (!message.value.trim()) {
                    message.parentElement.classList.add('error');
                    isValid = false;
                }
                
                // Validate reCAPTCHA
                // const recaptcha = grecaptcha.getResponse();
                // if (recaptcha.length === 0) {
                //     alert("Veuillez compléter le reCAPTCHA");
                //     isValid = false;
                // }
                
                if (isValid) {
                    // Show loader
                    loader.style.display = 'inline-block';
                    submitBtn.textContent = 'Envoi en cours...';
                 fetch(`${BASE_URL}/api/contact`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: name.value,
    email: email.value,
    phone: phone.value,
    subject: subject.value,
    message: message.value
  })
})
.then(response => response.json())
.then(data => {
  loader.style.display = 'none';
  submitBtn.textContent = 'Envoyer';
  successMessage.style.display = 'block';
  contactForm.reset();
  grecaptcha.reset();

  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 5000);
})
.catch(error => {
  loader.style.display = 'none';
  submitBtn.textContent = 'Envoyer';
  alert("Erreur lors de l'envoi du message. Veuillez réessayer.");
});

                }
            });
        });




        