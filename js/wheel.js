document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('slot-display');
    const spinBtn = document.getElementById('spin-btn');
    const lights = document.querySelectorAll('.light');
    const resultMessage = document.getElementById('result-message');
    let options = [];

    // Cooldown Logic
    const lastSpinKey = 'lastSpinTime';
    const cooldownMs = 24 * 60 * 60 * 1000; // 24 hours

    // Load Options from Global Scope (wheel_data.js)
    if (typeof window.WHEEL_OPTIONS !== 'undefined') {
        options = window.WHEEL_OPTIONS;
    } else {
        console.error("WHEEL_OPTIONS not found! Check wheel_data.js loading.");
        options = [];
    }

    // Fallback or Empty Check
    if (!Array.isArray(options) || options.length === 0) {
        options = [{ text: "Error: No prizes found!", rarity: "common" }];
    }

    // Audio Elements
    const spinSound = new Audio('../assets/spin.mp3');
    const winSound = new Audio('../assets/win.mp3');

    // Check Cooldown on Load
    checkCooldown();

    // Lever Logic
    const lever = document.querySelector('.lever-arm');
    lever.addEventListener('click', () => {
        if (!spinBtn.disabled) {
            lever.classList.add('pulled');
            setTimeout(() => lever.classList.remove('pulled'), 500); // Reset animation
            spin();
        }
    });

    spinBtn.addEventListener('click', () => {
        // Animate lever even if button clicked
        lever.classList.add('pulled');
        setTimeout(() => lever.classList.remove('pulled'), 500);
        spin();
    });

    function checkCooldown() {
        const lastSpin = localStorage.getItem(lastSpinKey);
        if (lastSpin) {
            const now = Date.now();
            const elapsed = now - parseInt(lastSpin, 10);

            if (elapsed < cooldownMs) {
                const remaining = cooldownMs - elapsed;
                const hoursLeft = Math.floor(remaining / (1000 * 60 * 60));
                const minsLeft = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

                disableSpin(`Cooldown: ${hoursLeft}:${minsLeft}`);
                return false;
            }
        }
        enableSpin();
        return true;
    }

    function disableSpin(msg) {
        spinBtn.disabled = true;
        spinBtn.innerText = msg || "Unavailable";
        spinBtn.style.background = "#555";
        spinBtn.style.cursor = "not-allowed";
    }

    function enableSpin() {
        spinBtn.disabled = false;
        spinBtn.innerText = "SPIN!";
        spinBtn.style.background = "var(--color-primary)";
        spinBtn.style.cursor = "pointer";
    }

    // Remove duplicate listener
    // spinBtn.addEventListener('click', spin);

    function spin() {
        if (!checkCooldown()) return;
        if (options.length === 0) return;

        // Set timestamp NOW
        localStorage.setItem(lastSpinKey, Date.now());

        spinBtn.disabled = true;
        resultMessage.innerText = "";
        display.className = 'slot-text'; // reset rarity classes

        // Sound effect
        spinSound.currentTime = 0;
        spinSound.loop = true; // Loop while spinning
        spinSound.play().catch(e => console.log("Audio play failed (user interaction needed first?)", e));

        let spins = 0;
        const maxSpins = 30; // How many times it changes before stopping
        let speed = 50; // Initial speed in ms

        // Visual Effects: Flashing Lights
        const lightInterval = setInterval(flashLights, 200);

        function step() {
            // Show random item during spin
            const randomItem = options[Math.floor(Math.random() * options.length)];
            display.innerText = randomItem.text;

            // Randomize color for "slot machine" blur effect
            const themeColors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-text)', '#fff'];
            display.style.color = themeColors[Math.floor(Math.random() * themeColors.length)];

            spins++;

            if (spins < maxSpins) {
                // Slow down exponentially
                if (spins > maxSpins - 10) speed += 30;
                else speed += 5;

                setTimeout(step, speed);
            } else {
                // Stop!
                clearInterval(lightInterval);
                finishSpin();
            }
        }

        step();
    }

    function finishSpin() {
        // Stop spin sound
        spinSound.loop = false;
        spinSound.pause();
        spinSound.currentTime = 0;

        // Weighted Selection
        const winner = selectWeightedItem();

        display.innerText = winner.text;

        // Apply Rarity Style
        display.classList.add(`rarity-${winner.rarity}`);
        display.style.color = ""; // Remove inline random color

        // Play Win Sound (Always play for any result, or just rare/epic? User asked to "play win.mp3")
        // User said: "play the win.mp3 also" when it stops.
        winSound.currentTime = 0;
        winSound.play().catch(e => console.log("Win audio failed", e));

        // Celebration Lights
        lights.forEach(l => l.classList.add('on'));
        setTimeout(() => lights.forEach(l => l.classList.remove('on')), 2000); // Blink off

        resultMessage.innerText = getRarityMessage(winner.rarity);
        // Do NOT re-enable button immediately. Cooldown takes over.
        disableSpin("Come back tomorrow!");
    }

    function selectWeightedItem() {
        // Weights: Common 60, Rare 30, Epic 10
        const weights = {
            'common': 60,
            'rare': 30,
            'epic': 10
        };

        const totalWeight = options.reduce((sum, item) => sum + (weights[item.rarity] || 50), 0);
        let random = Math.random() * totalWeight;

        for (const item of options) {
            const w = weights[item.rarity] || 50;
            if (random < w) return item;
            random -= w;
        }
        return options[0];
    }

    function getRarityMessage(rarity) {
        if (rarity === 'epic') return "JACKPOT!!! ⭐⭐⭐";
        if (rarity === 'rare') return "Nice win! ⭐";
        return "Enjoy your prize!";
    }

    function flashLights() {
        lights.forEach(l => {
            if (Math.random() > 0.5) l.classList.add('on');
            else l.classList.remove('on');
        });
    }
});
