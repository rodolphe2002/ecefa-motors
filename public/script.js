// // const BASE_URL = "http://localhost:5000";
// const BASE_URL = "https://ecefa-motors.onrender.com";


const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:4000"
  : "https://ecefa-motors.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
  // Perf: lazy-load non-critical images and set decoding
  const imgs = document.querySelectorAll('img');
  imgs.forEach((img) => {
    const isHighPriority = img.getAttribute('fetchpriority') === 'high';
    if (!isHighPriority) {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    }
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
  });

  // Animations GSAP
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

  // Header style au scroll
  window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  // Menu hamburger
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    function toggleMenu() {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      const next = !expanded;
      hamburger.setAttribute('aria-expanded', String(next));
      hamburger.classList.toggle('active', next);
      navLinks.classList.toggle('active', next);
    }

    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  // Profils : ouverture popup + affichage des champs
  const profileCards = document.querySelectorAll('.profile-card');
  const popup = document.getElementById('popupForm');
  const closeBtn = document.querySelector('.close-popup');

  const learnerFields = document.getElementById('learner-fields');
  const companyFields = document.getElementById('company-fields');
  const recruiterFields = document.getElementById('recruiter-fields');

  function hideAllFields() {
    learnerFields.classList.add('hidden');
    companyFields.classList.add('hidden');
    recruiterFields.classList.add('hidden');
  }

  profileCards.forEach(card => {
    card.addEventListener('click', () => {
      const profile = card.dataset.profile;
      localStorage.setItem('userProfile', profile);

      hideAllFields();
      popup.classList.remove('hidden');

      if (profile === 'learner') learnerFields.classList.remove('hidden');
      else if (profile === 'company') companyFields.classList.remove('hidden');
      else if (profile === 'recruiter') recruiterFields.classList.remove('hidden');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      popup.classList.add('hidden');
      hideAllFields();
    });
  }

  // Enregistrement des données
  const submitBtn = document.getElementById('submit-profile');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const profileType = localStorage.getItem('userProfile');
      let name = "", phone = "", email = "", extraInfo = "";

      if (!profileType) {
        alert("Veuillez choisir un profil.");
        return;
      }

      if (profileType === "learner") {
        name = document.getElementById('learner-name')?.value.trim();
        phone = document.getElementById('learner-phone')?.value.trim();
        const whatsapp = document.getElementById('learner-whatsapp')?.value.trim();
        if (!name || !phone || !whatsapp) {
          alert("Veuillez remplir tous les champs pour l'apprenant.");
          return;
        }
        email = whatsapp;
        extraInfo = "WhatsApp: " + whatsapp;
      }

      else if (profileType === "company") {
        const companyName = document.getElementById('company-name')?.value.trim();
        const companyPhone = document.getElementById('company-phone')?.value.trim();
        const contactName = document.getElementById('company-contact-name')?.value.trim();
        const contactPhone = document.getElementById('company-contact-phone')?.value.trim();
        const employeeCount = document.getElementById('company-employee-count')?.value.trim();
        const trainingType = document.getElementById('company-training-type')?.value;
        const educationLevel = document.getElementById('company-employee-level')?.value.trim();

        if (!companyName || !companyPhone || !contactName || !contactPhone || !employeeCount || !trainingType || !educationLevel) {
          alert("Veuillez remplir tous les champs pour l'entreprise.");
          return;
        }

        name = companyName;
        phone = companyPhone;
        email = contactPhone;
        extraInfo = `Responsable: ${contactName}, Employés: ${employeeCount}, Formation: ${trainingType}, Niveau: ${educationLevel}`;
      }

      else if (profileType === "recruiter") {
        const companyName = document.getElementById('recruiter-company-name')?.value.trim();
        const companyPhone = document.getElementById('recruiter-company-phone')?.value.trim();
        const contactName = document.getElementById('recruiter-contact-name')?.value.trim();
        const contactPhone = document.getElementById('recruiter-contact-phone')?.value.trim();
        const profileDesc = document.getElementById('recruiter-profile-description')?.value.trim();

        if (!companyName || !companyPhone || !contactName || !contactPhone || !profileDesc) {
          alert("Veuillez remplir tous les champs pour le recruteur.");
          return;
        }

        name = companyName;
        phone = companyPhone;
        email = contactPhone;
        extraInfo = `Contact: ${contactName}, Profil recherché: ${profileDesc}`;
      }

      // Envoi des données
      fetch(`${BASE_URL}/api/save-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileType, name, phone, email, extraInfo })
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || "Inscription réussie !");
          popup.classList.add('hidden');
          hideAllFields();
        })
        .catch(err => {
          alert("Une erreur est survenue.");
          console.error(err);
        });
    });
  }

  // Swiper (carrousel)
  const swiper = new Swiper('.swiper', {
    loop: true,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    autoplay: { delay: 5000 },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  // Animation flottante
  gsap.to('.floating-element', {
    y: 20,
    repeat: -1,
    yoyo: true,
    duration: 3,
    ease: "power1.inOut"
  });
});




document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('welcome-popup');
  const closeBtn = document.getElementById('close-welcome-btn');
  const closeIcon = document.querySelector('.close-welcome');

  if (!popup) return;

  // Afficher uniquement au tout premier chargement
  const hasShown = localStorage.getItem('welcomePopupShown') === 'true';
  if (!hasShown) {
    popup.classList.remove('hidden');
    // Mémoriser pour ne plus le réafficher aux prochaines visites
    localStorage.setItem('welcomePopupShown', 'true');
    // Gérer le focus initial dans le popup
    popup.setAttribute('aria-hidden', 'false');
    const focusTarget = closeIcon || closeBtn || popup;
    focusTarget.focus && focusTarget.focus();
  }

  function closePopup() {
    popup.classList.add('hidden');
    popup.setAttribute('aria-hidden', 'true');
  }

  closeBtn && closeBtn.addEventListener('click', closePopup);
  closeIcon && closeIcon.addEventListener('click', closePopup);
  document.addEventListener('keydown', (e) => {
    if (popup && !popup.classList.contains('hidden') && e.key === 'Escape') {
      closePopup();
    }
  });
});
