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
            
            // Cards animation
            gsap.utils.toArray('.training-card').forEach((card, i) => {
                gsap.to(card, {
                    scrollTrigger: {
                        trigger: card,
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
            
            // Advantages animation
            gsap.utils.toArray('.advantage-card').forEach((card, i) => {
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
            
            // Process animation
            gsap.utils.toArray('.process-card').forEach((card, i) => {
                gsap.to(card, {
                    scrollTrigger: {
                        trigger: card,
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
            
            // Initialize Swiper
            const swiper = new Swiper('.swiper', {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 30,
                autoplay: {
                    delay: 5000,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    768: {
                        slidesPerView: 1,
                    },
                    992: {
                        slidesPerView: 1,
                    }
                }
            });
        });