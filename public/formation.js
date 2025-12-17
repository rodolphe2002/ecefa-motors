        document.addEventListener('DOMContentLoaded', function() {
    // GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Hero content animation
    gsap.to('.hero-content', {
        duration: 1,
        y: 0,
        opacity: 1,
        ease: 'power3.out'
    });

    // Training cards animation
    gsap.utils.toArray('.training-card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.2,
            ease: 'power3.out'
        });
    });

    // Advantages animation
    gsap.utils.toArray('.advantage-card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });

    // Process animation
    gsap.utils.toArray('.process-card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.2,
            ease: 'power3.out'
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Swiper: testimonials
    new Swiper('.testimonials-container .swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: { delay: 5000 },
        navigation: {
            nextEl: '.testimonials-container .swiper-button-next',
            prevEl: '.testimonials-container .swiper-button-prev'
        }
    });

    // Swiper: trainings
    new Swiper('.training-swiper', {
        loop: true,
        centeredSlides: false,
        slidesPerView: 1.1,
        spaceBetween: 20,
        autoplay: { delay: 4500, disableOnInteraction: false },
        navigation: {
            nextEl: '.training-next',
            prevEl: '.training-prev'
        },
        pagination: { el: '.training-pagination', clickable: true },
        breakpoints: {
            640: { slidesPerView: 1.3, spaceBetween: 24 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 28 }
        }
    });
});