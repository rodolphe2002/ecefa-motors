// // === Définir l'URL du back-end ===
// const BASE_URL = "https://ecefa-motors.onrender.com";

const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:4000"
  : "https://ecefa-motors.onrender.com";

// === Gestion déconnexion ===
document.getElementById('logoutBtn').addEventListener('click', function () {
  localStorage.removeItem('token');
  window.location.href = '/AuthAdmin.html';
});

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/AuthAdmin.html';
}

function translateProfileType(type) {
  switch (type) {
    case 'learner': return 'Apprenant';
    case 'company': return 'Entreprise';
    case 'recruiter': return 'Recruteur';
    default: return '-';
  }
}

// Choix de la classe CSS du badge selon le type
function getTypeBadgeClass(type) {
  switch (type) {
    case 'learner': return 'type-badge type-learner';
    case 'company': return 'type-badge type-company';
    case 'recruiter': return 'type-badge type-recruiter';
    default: return 'type-badge type-unknown';
  }
}

// === Vanta Background ===
VANTA.WAVES({
  el: "#vanta-bg",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  color: 0x4361ee,
  shininess: 35.00,
  waveHeight: 15.00,
  waveSpeed: 0.75,
  zoom: 0.85
});

// === Hover effects for cards ===
document.querySelectorAll('.stat-card, .data-section').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-8px)';
    card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.12)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = 'var(--shadow)';
  });
});

// === Ripple effect for buttons ===
document.querySelectorAll('.action-btn, .notification-btn, .user-profile').forEach(button => {
  button.addEventListener('click', function (e) {
    let x = e.clientX - e.target.getBoundingClientRect().left;
    let y = e.clientY - e.target.getBoundingClientRect().top;
    let ripples = document.createElement('span');
    ripples.classList.add('ripple');
    ripples.style.left = x + 'px';
    ripples.style.top = y + 'px';
    this.appendChild(ripples);
    setTimeout(() => ripples.remove(), 1000);
  });
});

// === Ripple style ===
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    pointer-events: none;
    animation: rippleEffect 0.6s linear;
  }

  @keyframes rippleEffect {
    0% { width: 0; height: 0; opacity: 0.5; }
    100% { width: 500px; height: 500px; opacity: 0; }
  }
`;
document.head.appendChild(style);

// === Theme toggle (dark mode) ===
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}

// === GSAP animations + chargement des données ===
window.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.header', { y: -100, duration: 0.8, opacity: 0, ease: "power3.out" });
    gsap.from('.sidebar', { x: -100, opacity: 0, duration: 1, ease: "power2.out" });
    gsap.from('.stat-card', {
      opacity: 0, y: 40, duration: 1, stagger: 0.2, ease: "power2.out",
      scrollTrigger: { trigger: '.stats-container', start: 'top 85%' }
    });
    gsap.from('.data-section', {
      opacity: 0, y: 30, duration: 0.8, stagger: 0.2, ease: "power2.out",
      scrollTrigger: { trigger: '.data-section', start: 'top 80%' }
    });
  }

  updateNotificationCount();
  loadContactMessages();
  loadUserProfiles();
  window.setupMarkNotificationsRead?.();
  updateMonthlyGrowth();

  setInterval(updateNotificationCount, 30000);
});

// === Notification count ===
function updateNotificationCount() {
  fetch(`${BASE_URL}/api/notifications/new-users`)
    .then(res => res.json())
    .then(data => {
      const badge = document.getElementById('notificationCount');
      if (!badge) return;
      badge.textContent = data.count;
      badge.style.display = data.count > 0 ? 'inline-block' : 'none';
    })
    .catch(err => console.error("Erreur notification utilisateurs :", err));

  fetch(`${BASE_URL}/api/contact-messages/unread-count`)
    .then(res => res.json())
    .then(data => {
      const messageCard = document.querySelector('.stat-card:nth-child(2) .stat-value');
      if (messageCard) messageCard.textContent = data.count;
    })
    .catch(err => console.error("Erreur notification messages :", err));
}

// === Charger dynamiquement les profils ===
function loadUserProfiles() {
  fetch(`${BASE_URL}/api/profiles?limit=5`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('profilesBody');
      const count = document.getElementById('candidatsCount');
      if (!tbody || !count) return;

      tbody.innerHTML = '';
      count.textContent = data.length;

      data.forEach(profile => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${profile.name || '-'}</td>
          <td>${profile.phone || '-'}</td>
          <td>${profile.email || '-'}</td>
          <td><span class="${getTypeBadgeClass(profile.profileType)}">${translateProfileType(profile.profileType)}</span></td>
          <td>${profile.extraInfo || '-'}</td>
          <td>
            <button class="action-btn"><i class="fas fa-eye"></i></button>
            <button class="action-btn"><i class="fas fa-edit"></i></button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      if (document.body.classList.contains('dark')) {
        tbody.querySelectorAll('tr').forEach(row => row.style.color = '#e0e0e0');
      }
    })
    .catch(err => console.error("Erreur chargement profils :", err));
}

// === Charger les messages de contact ===
function loadContactMessages() {
  fetch(`${BASE_URL}/api/contact-messages?limit=5`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('.data-table.messages tbody');
      if (!tbody) return;

      tbody.innerHTML = '';
      data.forEach(msg => {
        const tr = document.createElement('tr');
        if (!msg.isRead) tr.classList.add('unread');
        tr.innerHTML = `
          <td>${msg.name}</td>
          <td>${translateSubject(msg.subject)}</td>
          <td>${msg.phone}</td>
          <td class="message-preview">${msg.message.slice(0, 60)}...</td>
          <td>${new Date(msg.date).toLocaleDateString()}</td>
          <td>
            <button class="action-btn view-message" data-id="${msg._id}" data-message="${encodeURIComponent(msg.message)}"><i class="fas fa-eye"></i></button>
            <button class="action-btn"><i class="fas fa-reply"></i></button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      if (document.body.classList.contains('dark')) {
        tbody.querySelectorAll('tr').forEach(row => row.style.color = '#e0e0e0');
      }

      setupMessageViewers();
    })
    .catch(err => console.error("Erreur chargement messages :", err));
}

// === Gérer la modale de lecture du message ===
function setupMessageViewers() {
  const modal = document.getElementById('messageModal');
  const content = document.getElementById('fullMessageContent');
  const closeBtn = document.querySelector('.close-btn');

  document.querySelectorAll('.view-message').forEach(button => {
    button.addEventListener('click', () => {
      const messageId = button.getAttribute('data-id');
      const fullMessage = decodeURIComponent(button.getAttribute('data-message'));

      content.textContent = fullMessage;
      modal.style.display = 'flex';

      fetch(`${BASE_URL}/api/contact-messages/mark-read/${messageId}`, { method: 'POST' })
        .then(res => res.json())
        .then(() => {
          loadContactMessages();
          updateNotificationCount();
        })
        .catch(err => console.error("Erreur en marquant le message comme lu :", err));
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
}

// === Croissance mensuelle ===
function updateMonthlyGrowth() {
  fetch(`${BASE_URL}/api/stats/monthly-growth`)
    .then(res => res.json())
    .then(data => {
      const growthElement = document.getElementById('monthlyGrowth');
      if (growthElement) {
        const value = data.growth;
        const prefix = value >= 0 ? '+' : '';
        const icon = value >= 0 ? '⬆️' : '⬇️';
        growthElement.textContent = `${icon} ${prefix}${value}%`;
        growthElement.style.color = value >= 0 ? 'green' : 'red';
      }
    })
    .catch(err => console.error("Erreur chargement croissance mensuelle :", err));
}

// === Traduction du sujet du message ===
function translateSubject(subject) {
  switch (subject) {
    case 'info': return 'Demande d\'information';
    case 'training': return 'Inscription à une formation';
    case 'partnership': return 'Demande de partenariat';
    case 'other': return 'Autre';
    default: return '-';
  }
}


document.querySelectorAll('.view-all').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const section = this.dataset.section;

    switch (section) {
      case 'candidats':
        // Rediriger vers une page avec la liste complète des profils
        window.location.href = '/admin-candidats.html';
        break;
      case 'messages':
        // Rediriger vers une page avec tous les messages
        window.location.href = '/admin-messages.html';
        break;
      default:
        console.warn('Section inconnue :', section);
    }
  });
});
