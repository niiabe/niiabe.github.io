// Custom scripts
// Smooth scrolling is handled by CSS in style.css

document.addEventListener('DOMContentLoaded', () => {
    const scrollContainers = document.querySelectorAll('.project-scroll-container');

    scrollContainers.forEach(container => {
        const scrollContent = container.querySelector('.scroll-content');
        const leftBtn = container.querySelector('.scroll-left');
        const rightBtn = container.querySelector('.scroll-right');

        if (!scrollContent || !leftBtn || !rightBtn) return;

        // Scroll amount
        const scrollAmount = 300;

        // Click handlers
        leftBtn.addEventListener('click', () => {
            scrollContent.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        rightBtn.addEventListener('click', () => {
            scrollContent.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        // Visibility logic
        const updateArrows = () => {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContent;

            // Show left arrow if scrolled past start
            if (scrollLeft > 0) {
                leftBtn.classList.add('visible');
            } else {
                leftBtn.classList.remove('visible');
            }

            // Show right arrow if not at end (allow 1px buffer)
            if (scrollLeft < scrollWidth - clientWidth - 1) {
                rightBtn.classList.add('visible');
            } else {
                rightBtn.classList.remove('visible');
            }
        };

        // Initial check
        updateArrows();

        // Scroll listener
        scrollContent.addEventListener('scroll', updateArrows);

        // Resize listener
        window.addEventListener('resize', updateArrows);
    });

    // Truncate descriptions on load
    const truncateDescriptions = () => {
        const cardTexts = document.querySelectorAll('.card-text');
        const maxLength = 100;

        cardTexts.forEach(textElement => {
            // Get the first text node (ignoring the link element for now)
            const firstChild = textElement.firstChild;

            if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
                const originalText = firstChild.textContent.trim();

                // Store full text for modal
                textElement.setAttribute('data-full-description', originalText);

                if (originalText.length > maxLength) {
                    firstChild.textContent = originalText.substring(0, maxLength) + '... ';
                }
            }
        });
    };

    truncateDescriptions();

    // Modal Logic
    const projectCards = document.querySelectorAll('.card');
    const modalTitle = document.getElementById('projectModalLabel');
    const modalImage = document.getElementById('projectModalImage');
    const modalDescription = document.getElementById('projectModalDescription');
    const modalLink = document.getElementById('projectModalLink');

    projectCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // Allow default link behavior if the actual link is clicked
            // But if they want the modal, they should click the card body/image
            if (e.target.tagName === 'A') {
                return;
            }

            const titleElement = this.querySelector('.card-title');
            const imageElement = this.querySelector('.card-img-top');
            const textElement = this.querySelector('.card-text');
            const linkElement = this.querySelector('a');

            if (!titleElement || !imageElement || !textElement || !linkElement) {
                return;
            }

            const title = titleElement.innerText;
            const imageSrc = imageElement.src;

            // Robust description extraction: use data attribute if available, else clone method
            let description;
            if (textElement.hasAttribute('data-full-description')) {
                description = textElement.getAttribute('data-full-description');
            } else {
                const textClone = textElement.cloneNode(true);
                const linkInClone = textClone.querySelector('a');
                if (linkInClone) linkInClone.remove();
                description = textClone.textContent.trim();
            }

            const linkHref = linkElement.href;

            modalTitle.textContent = title;
            modalImage.src = imageSrc;
            modalDescription.textContent = description;
            modalLink.href = linkHref;

            // Show modal using jQuery (Bootstrap 4 dependency)
            if (typeof $ !== 'undefined' && typeof $.fn.modal === 'function') {
                $('#projectModal').modal('show');
            }
        });
    });
});
