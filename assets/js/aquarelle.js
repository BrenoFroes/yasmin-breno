(function () {
    const canvas = document.querySelector('canvas.salao-aquarela');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    const mask = new Image();

    const imageSrc = canvas.dataset.src || 'assets/img/salao-aquarela.jpeg';
    const maskSrc = canvas.dataset.mask || 'assets/img/cloud-texture.png';

    let speed = 0;
    let rafId = null;
    let isRunning = false;
    let assetsLoaded = 0;

    function draw() {
        speed += 24;

        const w = 70 + speed;
        const h = 40 + speed;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(mask, x, y, w, h);
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const maxDim = Math.max(canvas.width, canvas.height) * 1.6;
        if (w < maxDim) {
            rafId = window.requestAnimationFrame(draw);
        } else {
            isRunning = false;
        }
    }

    function start() {
        if (isRunning) return;
        isRunning = true;
        speed = 0;
        if (rafId) window.cancelAnimationFrame(rafId);
        draw();
    }

    function onAssetReady() {
        assetsLoaded += 1;
        if (assetsLoaded < 2) return;

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.classList.add('is-ready');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            start();
                            observer.disconnect();
                        }
                    });
                },
                { threshold: 0.15 }
            );
            observer.observe(canvas);
        } else {
            start();
        }
    }

    img.onload = onAssetReady;
    mask.onload = onAssetReady;

    img.src = imageSrc;
    mask.src = maskSrc;
})();
