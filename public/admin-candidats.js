// Sélections DOM
const tableBody = document.getElementById("candidatTableBody");
const searchInput = document.getElementById("searchInput");
const filterSexe = document.getElementById("filterSexe");

// Correspondance entre type en anglais (base de données) et français (affichage + filtre)
const typeMap = {
  learner: "Apprenant",
  recruiter: "Recruteur",
  company: "Entreprise"
};

let candidats = []; // Liste des profils récupérés dynamiquement

// === Récupération des données depuis le backend ===
async function chargerCandidats() {
  try {
    const response = await fetch('/api/profiles');
    if (!response.ok) throw new Error('Erreur lors du chargement des candidats');

    const data = await response.json();

    // Adaptation des champs avec traduction du type
    candidats = data.map(profile => {
      const typeFr = typeMap[profile.profileType] || "Inconnu";
      return {
        nom: profile.name || "N/A",
        telephone: profile.phone || "N/A",
        email: profile.email || "N/A",
        type: typeFr,
        typeOriginal: profile.profileType, // Pour les filtres internes si besoin
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
    tableBody.innerHTML = "<tr><td colspan='5'>Aucun candidat trouvé.</td></tr>";
    return;
  }

  liste.forEach(candidat => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${candidat.nom}</td>
      <td>${candidat.telephone}</td>
      <td>${candidat.email}</td>
      <td>${candidat.type}</td>
      <td>${candidat.infos}</td>
    `;
    tableBody.appendChild(row);
  });
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

// === Lancement initial ===
chargerCandidats();
