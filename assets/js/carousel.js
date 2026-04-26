document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.carousel-container');
    if (!container) return;

    const track = container.querySelector('.carousel-inner');
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');
    const originals = Array.from(track.querySelectorAll('.period'));
    if (!track || originals.length === 0) return;

    const N = originals.length;
    const AUTO_INTERVAL = 6000;

    let autoTimer = null;
    let userInteracting = false;
    let isJumping = false;

    originals.forEach((p) => {
        const clone = p.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.dataset.clone = 'pre';
        track.insertBefore(clone, originals[0]);
    });
    originals.forEach((p) => {
        const clone = p.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.dataset.clone = 'post';
        track.appendChild(clone);
    });

    const allCards = () => track.querySelectorAll('.period');

    function step() {
        return originals[0].getBoundingClientRect().width;
    }

    function snappedIndex() {
        const center = track.scrollLeft + track.clientWidth / 2;
        const cards = allCards();
        let nearestIdx = -1;
        let minDist = Infinity;
        cards.forEach((c, i) => {
            const cardCenter = c.offsetLeft + c.offsetWidth / 2;
            const dist = Math.abs(cardCenter - center);
            if (dist < minDist) {
                minDist = dist;
                nearestIdx = i;
            }
        });
        return nearestIdx;
    }

    function scrollToCard(card, smooth) {
        const target = card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2;
        track.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'auto' });
    }

    function nudge(direction) {
        track.scrollBy({ left: direction * step(), behavior: 'smooth' });
        resetAuto();
    }

    function autoScroll() {
        if (userInteracting) return;
        track.scrollBy({ left: step(), behavior: 'smooth' });
    }

    function resetAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(autoScroll, AUTO_INTERVAL);
    }

    function rebalance() {
        if (isJumping) return;
        const idx = snappedIndex();
        if (idx === -1) return;

        const cards = allCards();
        if (idx < N) {
            isJumping = true;
            scrollToCard(cards[idx + N], false);
            requestAnimationFrame(() => { isJumping = false; });
        } else if (idx >= 2 * N) {
            isJumping = true;
            scrollToCard(cards[idx - N], false);
            requestAnimationFrame(() => { isJumping = false; });
        }
    }

    if ('onscrollend' in window) {
        track.addEventListener('scrollend', rebalance);
    } else {
        let scrollDebounce = null;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollDebounce);
            scrollDebounce = setTimeout(rebalance, 150);
        });
    }

    prevBtn.addEventListener('click', () => nudge(-1));
    nextBtn.addEventListener('click', () => nudge(1));

    track.addEventListener('pointerdown', () => { userInteracting = true; });
    track.addEventListener('pointerup', () => {
        userInteracting = false;
        resetAuto();
    });
    track.addEventListener('pointercancel', () => {
        userInteracting = false;
        resetAuto();
    });
    track.addEventListener('mouseenter', () => { userInteracting = true; });
    track.addEventListener('mouseleave', () => {
        userInteracting = false;
        resetAuto();
    });

    requestAnimationFrame(() => {
        scrollToCard(originals[0], false);
        resetAuto();
    });
});
