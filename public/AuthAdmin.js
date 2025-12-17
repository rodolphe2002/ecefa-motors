  // // const BASE_URL = "http://localhost:5000";
  // const BASE_URL = "https://inscription-ecefa.onrender.com";
  
const BASE_URL = window.location.hostname === "localhost"
? "http://localhost:4000"
: "https://ecefa-motors.onrender.com";

// Toast helper
function showToast(type = 'info', message = '') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✔️' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Fermer">×</button>
  `;
  toastContainer.appendChild(toast);
  const remove = () => {
    toast.style.animation = 'toast-out 200ms ease forwards';
    setTimeout(() => toast.remove(), 180);
  };
  toast.querySelector('.toast-close').addEventListener('click', remove);
  setTimeout(remove, 3200);
}



// Attendre que le DOM soit prêt avant d'ajouter les écouteurs
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adminLoginForm');


  


  // ✅ Connexion admin
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = form.username.value.trim();
      const password = form.password.value;

      if (!username || !password) {
        showToast('info', 'Veuillez remplir tous les champs.');
        return;
      }
     

      try {
        const res = await fetch(`${BASE_URL}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
          showToast('success', 'Connexion réussie.');
          localStorage.setItem('token', data.token);
          setTimeout(() => { window.location.href = '/admin.html'; }, 700);
        } else {
          showToast('error', data.message || 'Échec de la connexion.');
        }
      } catch (err) {
        showToast('error', 'Erreur de connexion au serveur.');
        console.error(err);
      }
    });
  }
});
