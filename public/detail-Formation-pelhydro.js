        // Animation au défilement
        document.addEventListener('DOMContentLoaded', function() {
            // Observer pour les animations au scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    }
                });
            }, {
                threshold: 0.1
            });

            // Observer chaque section
            document.querySelectorAll('section').forEach(section => {
                observer.observe(section);
            });

            // Animation des cartes au survol
            const cards = document.querySelectorAll('.avantage-card, .metier-card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = card.classList.contains('avantage-card') 
                        ? 'translateY(-15px)' 
                        : 'scale(1.08)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                });
            });

            // Animation des boutons CTA
            const buttons = document.querySelectorAll('.cta-button');
            buttons.forEach(button => {
                button.addEventListener('mouseenter', () => {
                    button.style.transform = button.classList.contains('primary') 
                        ? 'translateY(-8px) scale(1.08)' 
                        : 'translateY(-8px)';
                });
                
                button.addEventListener('mouseleave', () => {
                    button.style.transform = '';
                });
            });
        });