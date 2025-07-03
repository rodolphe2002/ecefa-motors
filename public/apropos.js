        // GSAP Animations
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize GSAP with ScrollTrigger
            gsap.registerPlugin(ScrollTrigger);
            
            // Hero content animation
            gsap.to('.hero-content', {
                duration: 1,
                y: 0,
                opacity: 1,
                ease: "power3.out"
            });
            
            // Timeline items animation
            gsap.utils.toArray('.timeline-item').forEach((item, i) => {
                gsap.to(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 90%",
                        toggleActions: "play none none none"
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: i * 0.2,
                    ease: "power3.out"
                });
            });
            
            // Mission cards animation
            gsap.utils.toArray('.mission-card').forEach((card, i) => {
                gsap.to(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                        toggleActions: "play none none none"
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: "power3.out"
                });
            });
            
            // Team cards animation
            gsap.utils.toArray('.team-card').forEach((card, i) => {
                gsap.to(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                        toggleActions: "play none none none"
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: "power3.out"
                });
            });
            
            // Partner logos animation
            gsap.utils.toArray('.partner-logo').forEach((logo, i) => {
                gsap.to(logo, {
                    scrollTrigger: {
                        trigger: logo,
                        start: "top 90%",
                        toggleActions: "play none none none"
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: "power3.out"
                });
            });
            
            // Testimonial card animation
            gsap.to('.testimonial-card', {
                scrollTrigger: {
                    trigger: '.testimonial-card',
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
        });