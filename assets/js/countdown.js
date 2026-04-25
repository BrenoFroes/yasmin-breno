(function () {
    const root = document.getElementById('countdown');
    if (!root) return;

    const target = new Date(root.dataset.target).getTime();
    if (Number.isNaN(target)) return;

    const units = {
        days: root.querySelector('[data-unit="days"]'),
        hours: root.querySelector('[data-unit="hours"]'),
        minutes: root.querySelector('[data-unit="minutes"]'),
        seconds: root.querySelector('[data-unit="seconds"]'),
    };
    const finishedMsg = document.querySelector('.countdown-finished');

    const pad = (n) => String(n).padStart(2, '0');

    function tick() {
        const diff = target - Date.now();

        if (diff <= 0) {
            units.days.textContent = '00';
            units.hours.textContent = '00';
            units.minutes.textContent = '00';
            units.seconds.textContent = '00';
            if (finishedMsg) finishedMsg.hidden = false;
            root.hidden = true;
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        units.days.textContent = pad(days);
        units.hours.textContent = pad(hours);
        units.minutes.textContent = pad(minutes);
        units.seconds.textContent = pad(seconds);

        window.requestAnimationFrame(() => {
            window.setTimeout(tick, 1000 - (Date.now() % 1000));
        });
    }

    tick();
})();
