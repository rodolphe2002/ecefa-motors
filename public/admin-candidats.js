
const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:4000"
  : "https://ecefa-motors.onrender.com";

// Sélections DOM
const tableBody = document.getElementById("candidatTableBody");
const searchInput = document.getElementById("searchInput");
const filterSexe = document.getElementById("filterSexe");
const selectAll = document.getElementById("selectAll");
const bulkDeleteBtn = document.getElementById("bulkDeleteBtn");
const printAllBtn = document.getElementById('printAllBtn');
const printByTypeBtn = document.getElementById('printByTypeBtn');
const printTypeSelect = document.getElementById('printTypeSelect');
const printSelectedBtn = document.getElementById('printSelectedBtn');

// Correspondance entre type en anglais (base de données) et français (affichage + filtre)
const typeMap = {
  learner: "Apprenant",
  recruiter: "Recruteur",
  company: "Entreprise"
};

// Classe CSS badge selon type (aligné avec admin.css)
function getTypeBadgeClass(typeOriginal) {
  switch (typeOriginal) {
    case 'learner': return 'type-badge type-learner';
    case 'recruiter': return 'type-badge type-recruiter';
    case 'company': return 'type-badge type-company';
    default: return 'type-badge type-unknown';
  }
}

// === Helpers export PDF (jsPDF + autoTable) ===
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = Array.from(document.scripts).find(s => s.src === src);
    if (existing) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Echec chargement script: ${src}`));
    document.head.appendChild(s);
  });
}

async function ensurePdfLibs() {
  if (window.jspdf && window.jspdf.jsPDF && window.jspdf.jsPDF instanceof Function) {
    return true;
  }
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
    await loadScript('https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js');
    return !!(window.jspdf && window.jspdf.jsPDF);
  } catch (e) {
    console.error(e);
    return false;
  }
}

function exportRowsToPDF(rows, title = 'Liste des inscrits') {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    // tenter un chargement dynamique puis relancer
    ensurePdfLibs().then(ok => {
      if (!ok) {
        alert('Librairie jsPDF non chargée. Vérifiez votre connexion internet.');
        return;
      }
      exportRowsToPDF(rows, title);
    });
    return;
  }
  const doc = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  doc.setFontSize(14);
  doc.text(title, 40, 40);

  const head = [[ 'Nom', 'Téléphone', 'Email', 'Type', 'Infos' ]];
  const body = rows.map(r => [r.nom, r.telephone, r.email, r.type, r.infos]);

  // autoTable plugin
  if (typeof doc.autoTable !== 'function') {
    // tenter de charger puis relancer
    ensurePdfLibs().then(ok => {
      if (!ok || typeof doc.autoTable !== 'function') {
        alert('Plugin autoTable non chargé.');
        return;
      }
      exportRowsToPDF(rows, title);
    });
    return;
  }
  doc.autoTable({
    head,
    body,
    startY: 60,
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [67, 97, 238], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] }
  });

  const fileName = `${title.replace(/\s+/g, '_').toLowerCase()}.pdf`;
  doc.save(fileName);
}
let candidats = []; // Liste des profils récupérés dynamiquement

// === Récupération des données depuis le backend ===
async function chargerCandidats() {
  try {
    const response = await fetch(`${BASE_URL}/api/profiles`);
    if (!response.ok) throw new Error('Erreur lors du chargement des candidats');

    const data = await response.json();

    // Adapter les champs avec conservation de l'id pour actions
    candidats = data.map(profile => {
      const typeFr = typeMap[profile.profileType] || "Inconnu";
      return {
        id: profile._id,
        nom: profile.name || "N/A",
        telephone: profile.phone || "N/A",
        email: profile.email || "N/A",
        type: typeFr,
        typeOriginal: profile.profileType, // Pour filtrage interne
        infos: profile.extraInfo || "-"
      };
    });

    filtrerEtRechercher(); // Affichage initial
  } catch (error) {
    console.error("❌ Erreur :", error);
    tableBody.innerHTML = "<tr><td colspan='5'>Impossible de charger les candidats.</td></tr>";
  }
}

// === Affichage HTML ===
function afficherCandidats(liste) {
  tableBody.innerHTML = "";

  if (liste.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='7'>Aucun candidat trouvé.</td></tr>";
    return;
  }

  liste.forEach(c => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="row-check" data-id="${c.id}" aria-label="Sélectionner ${c.nom}"></td>
      <td>${c.nom}</td>
      <td>${c.telephone}</td>
      <td>${c.email}</td>
      <td><span class="${getTypeBadgeClass(c.typeOriginal)}">${c.type}</span></td>
      <td>${c.infos}</td>
      <td>
        <button class="btn danger btn-delete-one" data-id="${c.id}" aria-label="Supprimer ${c.nom}"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Gérer l'état du selectAll après rendu
  updateSelectAllState();
}

// === Filtrage + recherche combinée ===
function filtrerEtRechercher() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedType = filterSexe.value;

  const filtered = candidats.filter(candidat => {
    const matchType = selectedType === "" || candidat.type === selectedType;
    const matchSearch =
      candidat.nom.toLowerCase().includes(searchTerm) ||
      candidat.email.toLowerCase().includes(searchTerm) ||
      candidat.telephone.toLowerCase().includes(searchTerm) ||
      candidat.infos.toLowerCase().includes(searchTerm);

    return matchType && matchSearch;
  });

  afficherCandidats(filtered);
}

// === Événements sur les filtres ===
searchInput.addEventListener("input", filtrerEtRechercher);
filterSexe.addEventListener("change", filtrerEtRechercher);

// === Gestion des suppressions ===
function getSelectedIds() {
  return Array.from(document.querySelectorAll('.row-check:checked')).map(chk => chk.dataset.id);
}

function updateSelectAllState() {
  const checks = document.querySelectorAll('.row-check');
  const checked = document.querySelectorAll('.row-check:checked');
  if (selectAll) selectAll.checked = checks.length > 0 && checked.length === checks.length;
}

// Délégué pour lignes: toggle selectAll et suppression unitaire
tableBody.addEventListener('change', (e) => {
  if (e.target.classList.contains('row-check')) {
    updateSelectAllState();
  }
});

tableBody.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btn-delete-one');
  if (!btn) return;
  const id = btn.dataset.id;
  if (!id) return;
  if (!confirm('Confirmer la suppression de ce candidat ?')) return;
  try {
    const resp = await fetch(`${BASE_URL}/api/profiles/${id}`, { method: 'DELETE' });
    if (!resp.ok) throw new Error('Suppression échouée');
    await chargerCandidats();
    alert('Candidat supprimé');
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la suppression");
  }
});

// Select all
selectAll && selectAll.addEventListener('change', () => {
  document.querySelectorAll('.row-check').forEach(chk => {
    chk.checked = selectAll.checked;
  });
});

// Suppression multiple
bulkDeleteBtn && bulkDeleteBtn.addEventListener('click', async () => {
  const ids = getSelectedIds();
  if (ids.length === 0) {
    alert('Sélectionnez au moins un candidat.');
    return;
  }
  if (!confirm(`Supprimer ${ids.length} candidat(s) sélectionné(s) ?`)) return;
  try {
    const resp = await fetch(`${BASE_URL}/api/profiles/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    if (!resp.ok) throw new Error('Suppression multiple échouée');
    await chargerCandidats();
    alert('Suppression multiple effectuée');
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la suppression multiple");
  }
});

// === Impression: tout ===
printAllBtn && printAllBtn.addEventListener('click', () => {
  console.log('[PDF] Imprimer tout - click');
  if (!candidats.length) {
    alert('Aucune donnée à imprimer.');
    return;
  }
  exportRowsToPDF(candidats, 'Liste des inscrits - Tous');
});

// === Impression: par type ===
printByTypeBtn && printByTypeBtn.addEventListener('click', () => {
  console.log('[PDF] Imprimer par type - click');
  const type = printTypeSelect ? printTypeSelect.value : '';
  if (!type) {
    alert('Choisissez un type à imprimer.');
    return;
  }
  const rows = candidats.filter(c => c.type === type);
  if (!rows.length) {
    alert('Aucun enregistrement pour ce type.');
    return;
  }
  exportRowsToPDF(rows, `Liste des inscrits - ${type}`);
});

// === Impression: sélection ===
printSelectedBtn && printSelectedBtn.addEventListener('click', () => {
  console.log('[PDF] Imprimer sélection - click');
  const ids = getSelectedIds();
  if (!ids.length) {
    alert('Sélectionnez au moins un candidat.');
    return;
  }
  const rows = candidats.filter(c => ids.includes(c.id));
  exportRowsToPDF(rows, 'Liste des inscrits - Sélection');
});

// === Lancement initial ===
chargerCandidats();
