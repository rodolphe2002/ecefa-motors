  const BASE_URL = "http://localhost:5000";
//   const BASE_URL = "https://inscription-ecefa.onrender.com";


document.addEventListener('DOMContentLoaded', function () {
    // Vérifie si le profil a déjà été sélectionné
    const savedProfile = localStorage.getItem('userProfile');
    if (!savedProfile) {
        // Si aucun profil enregistré, afficher le popup après 3 secondes
        setTimeout(() => {
            document.querySelector('.profile-modal').classList.remove('hidden');
            document.querySelector('.modal-content').classList.add('active');
        }, 3000);
    } else {
        // Si profil déjà sélectionné, ne pas afficher le popup
        document.querySelector('.profile-modal').classList.add('hidden');
    }

    // GSAP scroll animations
    gsap.registerPlugin(ScrollTrigger);

    gsap.to('.hero-content', {
        duration: 1,
        y: 0,
        opacity: 1,
        ease: "power3.out"
    });

    gsap.to('.badge', {
        duration: 1,
        y: 0,
        opacity: 1,
        stagger: 0.3,
        delay: 0.5,
        ease: "power3.out"
    });

    gsap.utils.toArray('.card').forEach((card, i) => {
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

    window.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Gestion des rôles et champs dynamiques
    const profileOptions = document.querySelectorAll('.profile-option');
    const modalBtn = document.querySelector('.modal-btn');
    const learnerFields = document.getElementById('learner-fields');
    const companyFields = document.getElementById('company-fields');
    const recruiterFields = document.getElementById('recruiter-fields');

    function hideAllFields() {
        learnerFields.classList.add('hidden');
        companyFields.classList.add('hidden');
        recruiterFields.classList.add('hidden');
    }

    profileOptions.forEach(option => {
        option.addEventListener('click', function () {
            profileOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            const selected = this.dataset.profile;
            hideAllFields();

            if (selected === "learner") {
                learnerFields.classList.remove('hidden');
            } else if (selected === "company") {
                companyFields.classList.remove('hidden');
            } else if (selected === "recruiter") {
                recruiterFields.classList.remove('hidden');
            }
        });
    });


    //  gestion de la soumission du choix du profil visteur

modalBtn.addEventListener('click', function () {
    const selected = document.querySelector('.profile-option.active');
    if (!selected) {
        alert("Veuillez choisir un profil.");
        return;
    }

    const profileType = selected.dataset.profile;
    let name = "", phone = "", email = "", extraInfo = "";

    if (profileType === "learner") {
        const fields = document.querySelectorAll('#learner-fields input');
        name = fields[0].value;
        phone = fields[1].value;
        email = fields[2].value;
    } else if (profileType === "company") {
        const fields = document.querySelectorAll('#company-fields input');
        name = fields[0].value;
        phone = fields[1].value;
        email = fields[2].value;
    } else if (profileType === "recruiter") {
        const fields = document.querySelectorAll('#recruiter-fields input');
        name = fields[0].value;
        extraInfo = fields[1].value;
        email = fields[2].value;
        phone = fields[3].value;
    }

    fetch( `${BASE_URL}/api/save-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileType, name, phone, email, extraInfo })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        localStorage.setItem('userProfile', profileType);
        document.querySelector('.profile-modal').classList.add('hidden');
    })
    .catch(err => {
        alert("Une erreur est survenue.");
        console.error(err);
    });
});


    const swiper = new Swiper('.swiper', {
        loop: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        autoplay: {
            delay: 5000,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    gsap.to('.floating-element', {
        y: 20,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: "power1.inOut"
    });
});
