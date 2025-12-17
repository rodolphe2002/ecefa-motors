// Toast helper
function showToast(type = 'info', message = '') {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <span class="toast-icon">
      ${type === 'success' ? '✔️' : type === 'error' ? '⚠️' : 'ℹ️'}
    </span>
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

const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:4000"
  : "https://ecefa-motors.onrender.com";

const tbody = document.getElementById('messagesBody');
const modal = document.getElementById('messageModal');
const modalContent = document.getElementById('fullMessageContent');
const closeBtn = document.querySelector('.close-btn');
const selectAllMessages = document.getElementById('selectAllMessages');
const bulkDeleteBtn = document.getElementById('bulkDeleteMessages');
const toastContainer = document.getElementById('toastContainer');
let lastFocusedElement = null;

function translateSubject(subject) {
  switch (subject) {
    case 'info': return "Demande d'information";
    case 'training': return "Inscription à une formation";
    case 'partnership': return "Demande de partenariat";
    case 'other': return "Autre";
    default: return '-';
  }
}

function getSelectedMessageIds() {
  return Array.from(document.querySelectorAll('.msg-check:checked')).map(el => el.getAttribute('data-id'));
}

function updateSelectAllState() {
  if (!selectAllMessages) return;
  const all = document.querySelectorAll('.msg-check');
  const checked = document.querySelectorAll('.msg-check:checked');
  selectAllMessages.checked = all.length > 0 && checked.length === all.length;
}

function renderRows(messages) {
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!messages.length) {
    tbody.innerHTML = "<tr><td colspan='7'>Aucun message.</td></tr>";
    return;
  }
  messages.forEach(msg => {
    const tr = document.createElement('tr');
    if (!msg.isRead) tr.classList.add('unread');
    tr.innerHTML = `
      <td><input type="checkbox" class="msg-check" data-id="${msg._id}" aria-label="Sélectionner le message de ${msg.name || 'expéditeur'}"></td>
      <td>${msg.name || '-'}</td>
      <td>${translateSubject(msg.subject)}</td>
      <td>${msg.phone || '-'}</td>
      <td class="message-preview">${(msg.message || '').slice(0, 60)}${(msg.message || '').length > 60 ? '...' : ''}</td>
      <td>${msg.date ? new Date(msg.date).toLocaleDateString() : '-'}</td>
      <td>
        <button class="action-btn view-message" data-id="${msg._id}" data-message="${encodeURIComponent(msg.message || '')}" aria-label="Voir le message complet de ${msg.name || 'cet expéditeur'}">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn danger small delete-message" data-id="${msg._id}" aria-label="Supprimer le message de ${msg.name || 'cet expéditeur'}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.view-message').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const fullMessage = decodeURIComponent(btn.getAttribute('data-message') || '');
      modalContent.textContent = fullMessage;

      openModal();

      fetch(`${BASE_URL}/api/contact-messages/mark-read/${id}`, { method: 'POST' })
        .then(r => r.json())
        .then(() => loadAllMessages())
        .catch(err => console.error('Erreur marquage lu:', err));
    });
  });

  // Single delete handlers
  tbody.querySelectorAll('.delete-message').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (!id) return;
      if (!confirm('Confirmer la suppression de ce message ?')) return;
      try {
        const resp = await fetch(`${BASE_URL}/api/contact-messages/${id}`, { method: 'DELETE' });
        if (!resp.ok) throw new Error('Suppression échouée');
        showToast('success', 'Message supprimé.');
        loadAllMessages();
      } catch (e) {
        console.error(e);
        showToast('error', 'Erreur lors de la suppression.');
      }
    });
  });

  // Update select-all state
  updateSelectAllState();
}

function loadAllMessages() {
  fetch(`${BASE_URL}/api/contact-messages`)
    .then(res => res.json())
    .then(renderRows)
    .catch(err => {
      console.error('Erreur chargement messages:', err);
      if (tbody) tbody.innerHTML = "<tr><td colspan='7'>Erreur de chargement.</td></tr>";
      showToast('error', 'Erreur de chargement des messages.');
    });
}

// Select all toggle
if (selectAllMessages) {
  selectAllMessages.addEventListener('change', () => {
    document.querySelectorAll('.msg-check').forEach(chk => {
      chk.checked = selectAllMessages.checked;
    });
  });
}

// Keep select-all in sync when individual boxes change
if (tbody) {
  tbody.addEventListener('change', (e) => {
    if (e.target && e.target.classList.contains('msg-check')) {
      updateSelectAllState();
    }
  });
}

// Bulk delete
if (bulkDeleteBtn) {
  bulkDeleteBtn.addEventListener('click', async () => {
    const ids = getSelectedMessageIds();
    if (!ids.length) {
      showToast('info', 'Sélectionnez au moins un message.');
      return;
    }
    if (!confirm(`Supprimer ${ids.length} message(s) sélectionné(s) ?`)) return;
    try {
      const resp = await fetch(`${BASE_URL}/api/contact-messages/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      if (!resp.ok) throw new Error('Suppression multiple échouée');
      showToast('success', 'Messages supprimés.');
      loadAllMessages();
    } catch (e) {
      console.error(e);
      showToast('error', 'Erreur lors de la suppression multiple.');
    }
  });
}

function getFocusableElements(container) {
  return container.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
}

function handleKeyDownTrap(e) {
  if (e.key === 'Escape') {
    closeModal();
    return;
  }
  if (e.key !== 'Tab') return;
  const focusables = getFocusableElements(modal);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function openModal() {
  lastFocusedElement = document.activeElement;
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  const focusables = getFocusableElements(modal);
  const target = closeBtn || modal;
  target.focus();
  document.addEventListener('keydown', handleKeyDownTrap);
}

function closeModal() {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.removeEventListener('keydown', handleKeyDownTrap);
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

if (closeBtn) closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

document.addEventListener('DOMContentLoaded', loadAllMessages);