        // Animation au défilement pour la page détail Formation Chariot Élévateur
document.addEventListener('DOMContentLoaded', function () {
    // Observer pour faire apparaître les sections en douceur
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        },
        {
            threshold: 0.1,
        }
    );

    document.querySelectorAll('section').forEach((section) => {
        observer.observe(section);
    });

    // Cartes métiers : l’animation principale se fait au scroll (active/inactive)
    const metierCards = Array.from(document.querySelectorAll('.metier-card'));

    // Animation des cartes métiers au survol (on exclut les avantages qui sont gérés au scroll)
    metierCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.08)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Animation au scroll pour les cartes métiers : carte la plus proche du centre agrandie
    if (metierCards.length) {
        let tickingMetier = false;

        const updateActiveMetierCard = () => {
            const viewportCenter = window.innerHeight / 2;
            let bestCard = null;
            let bestDistance = Infinity;

            metierCards.forEach((card) => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.top + rect.height / 2;
                const distance = Math.abs(cardCenter - viewportCenter);

                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestCard = card;
                }
            });

            metierCards.forEach((card) => {
                card.classList.remove('metier-card--active', 'metier-card--inactive');
            });

            if (bestCard) {
                bestCard.classList.add('metier-card--active');
                metierCards
                    .filter((card) => card !== bestCard)
                    .forEach((card) => card.classList.add('metier-card--inactive'));
            }
        };

        const onScrollMetier = () => {
            if (!tickingMetier) {
                window.requestAnimationFrame(() => {
                    updateActiveMetierCard();
                    tickingMetier = false;
                });
                tickingMetier = true;
            }
        };

        // Initialisation et écoute du scroll pour les métiers
        updateActiveMetierCard();
        window.addEventListener('scroll', onScrollMetier);
        window.addEventListener('resize', onScrollMetier);
    }

    // Animation des boutons CTA
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach((button) => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = button.classList.contains('primary')
                ? 'translateY(-8px) scale(1.08)'
                : 'translateY(-8px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });

    // Animation des icônes flottantes
    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach((icon) => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.5)';
            icon.style.opacity = '1';
        });

        icon.addEventListener('mouseleave', () => {
            icon.style.transform = '';
            icon.style.opacity = '0.7';
        });
    });

    // Animation au scroll pour les cartes d'avantages : une seule carte visible à la fois
    const avantageCards = Array.from(document.querySelectorAll('.avantage-card'));
    if (avantageCards.length) {
        let ticking = false;

        const updateActiveAdvantageCard = () => {
            const viewportCenter = window.innerHeight / 2;
            let bestIndex = -1;
            let bestDistance = Infinity;

            // Trouver l'index de la carte la plus proche du centre de l'écran
            avantageCards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.top + rect.height / 2;
                const distance = Math.abs(cardCenter - viewportCenter);

                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestIndex = index;
                }
            });

            // Réinitialiser les classes
            avantageCards.forEach((card) => {
                card.classList.remove(
                    'avantage-card--before',
                    'avantage-card--active',
                    'avantage-card--after'
                );
            });

            if (bestIndex !== -1) {
                avantageCards.forEach((card, index) => {
                    if (index < bestIndex) {
                        card.classList.add('avantage-card--before');
                    } else if (index === bestIndex) {
                        card.classList.add('avantage-card--active');
                    } else {
                        card.classList.add('avantage-card--after');
                    }
                });
            }
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateActiveAdvantageCard();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Initialisation et écoute du scroll pour les avantages
        updateActiveAdvantageCard();
        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onScroll);
    }
});