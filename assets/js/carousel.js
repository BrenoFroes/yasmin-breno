document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.carousel-container');
    if (!container) return;

    const inner = document.querySelector('.carousel-inner');
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');

    const AUTO_INTERVAL = 6000;
    const ARROW_SCROLL = 296;
    const DRAG_THRESHOLD = 6;
    let autoTimer = null;

    function boundItems() {
        const outer = container.getBoundingClientRect();
        const innerRect = inner.getBoundingClientRect();
        const currentLeft = parseInt(inner.style.left) || 0;

        if (currentLeft > 0) {
            inner.style.left = '0px';
        }

        if (innerRect.right < outer.right) {
            inner.style.left = `-${innerRect.width - outer.width}px`;
        }
    }

    function scrollBy(amount) {
        const currentLeft = parseInt(inner.style.left) || 0;
        inner.style.transition = 'left 0.4s ease';
        inner.style.left = `${currentLeft + amount}px`;
        boundItems();
        setTimeout(() => {
            inner.style.transition = '';
            boundItems();
        }, 400);
        resetAuto();
    }

    prevBtn.addEventListener('click', () => scrollBy(ARROW_SCROLL));
    nextBtn.addEventListener('click', () => scrollBy(-ARROW_SCROLL));

    function autoScroll() {
        const currentLeft = parseInt(inner.style.left) || 0;
        const outerWidth = container.getBoundingClientRect().width;
        const innerWidth = inner.getBoundingClientRect().width;
        const maxScroll = -(innerWidth - outerWidth);

        if (currentLeft <= maxScroll + 10) {
            inner.style.transition = 'left 0.6s ease';
            inner.style.left = '0px';
            setTimeout(() => { inner.style.transition = ''; }, 600);
        } else {
            scrollBy(-ARROW_SCROLL);
        }
    }

    function resetAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(autoScroll, AUTO_INTERVAL);
    }

    function centerInitial() {
        const outerWidth = container.getBoundingClientRect().width;
        const innerWidth = inner.getBoundingClientRect().width;
        if (innerWidth < outerWidth) {
            inner.style.left = `${(outerWidth - innerWidth) / 2}px`;
        } else {
            inner.style.left = '0px';
        }
    }

    let isDown = false;
    let didDrag = false;
    let startX = 0;
    let startLeft = 0;
    let activePointerId = null;

    function onPointerDown(e) {
        if (e.button !== undefined && e.button !== 0) return;
        if (e.target.closest('.carousel-arrow')) return;

        isDown = true;
        didDrag = false;
        startX = e.clientX;
        startLeft = parseInt(inner.style.left) || 0;
        activePointerId = e.pointerId;

        inner.style.transition = '';
        clearInterval(autoTimer);

        try { container.setPointerCapture(e.pointerId); } catch (_) {}
    }

    function onPointerMove(e) {
        if (!isDown || e.pointerId !== activePointerId) return;
        const dx = e.clientX - startX;

        if (!didDrag && Math.abs(dx) >= DRAG_THRESHOLD) {
            didDrag = true;
            container.classList.add('is-dragging');
        }

        if (didDrag) {
            inner.style.left = `${startLeft + dx}px`;
            e.preventDefault();
        }
    }

    function onPointerUp(e) {
        if (!isDown) return;
        if (activePointerId !== null && e.pointerId !== activePointerId) return;

        const wasDrag = didDrag;
        isDown = false;
        didDrag = false;
        activePointerId = null;

        try { container.releasePointerCapture(e.pointerId); } catch (_) {}

        if (wasDrag) {
            inner.style.transition = 'left 0.3s ease-out';
            boundItems();
            setTimeout(() => { inner.style.transition = ''; }, 300);

            const swallowClick = (ev) => {
                ev.stopPropagation();
                ev.preventDefault();
            };
            container.addEventListener('click', swallowClick, { capture: true, once: true });

            setTimeout(() => container.classList.remove('is-dragging'), 50);
        }

        resetAuto();
    }

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);

    container.querySelectorAll('img').forEach((img) => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    centerInitial();
    resetAuto();
});
