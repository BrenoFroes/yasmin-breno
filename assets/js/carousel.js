document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.carousel-container');
    if (!container) return;

    const inner = document.querySelector('.carousel-inner');
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');

    const AUTO_INTERVAL = 6000;
    const ARROW_SCROLL = 296;
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

    inner.style.left = '0px';
    resetAuto();
});
