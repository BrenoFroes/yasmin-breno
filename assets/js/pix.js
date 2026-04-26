document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('pix-btn');
    const dialog = document.getElementById('pix-dialog');
    if (!btn || !dialog) return;

    const closeBtn = dialog.querySelector('.pix-dialog-close');

    function open() {
        if (typeof dialog.showModal === 'function') {
            dialog.showModal();
        } else {
            dialog.setAttribute('open', '');
        }
    }

    function close() {
        if (typeof dialog.close === 'function') {
            dialog.close();
        } else {
            dialog.removeAttribute('open');
        }
    }

    btn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);

    dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect();
        const inside =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;
        if (!inside) close();
    });
});
