document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('main-timer');
    const statsDisplay = document.getElementById('funny-stats');

    // Use global config from config.js
    const config = window.LOVE_CONFIG;

    if (config) {
        const startDateStr = config.date; // "01.05.23"
        const startDate = parseDate(startDateStr);
        startTimer(startDate, config);
    } else {
        console.error('Config not found!');
        timerDisplay.innerText = 'Could not load config :(';
    }

    function parseDate(str) {
        // format DD.MM.YY or DD.MM.YYYY
        const parts = str.split('.');
        // 20xx for year if YY, else YYYY
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-11

        let year = parseInt(parts[2], 10);
        if (year < 100) year += 2000;

        return new Date(year, month, day, 0, 0, 0); // 00:00 start
    }

    function startTimer(startDate, config) {
        function update() {
            const now = new Date();
            const diff = now - startDate;

            // Basic Time Breakdown
            // Precise Date Difference Calculation
            let years = now.getFullYear() - startDate.getFullYear();
            let months = now.getMonth() - startDate.getMonth();
            let days = now.getDate() - startDate.getDate();

            const hours = now.getHours() - startDate.getHours();
            const minutes = now.getMinutes() - startDate.getMinutes();
            const seconds = now.getSeconds() - startDate.getSeconds();

            // Adjust for negative time/days/months to "borrow" from higher unit
            let adjSeconds = seconds;
            let adjMinutes = minutes;
            let adjHours = hours;
            let adjDays = days;
            let adjMonths = months;
            let adjYears = years;

            if (adjSeconds < 0) {
                adjSeconds += 60;
                adjMinutes--;
            }
            if (adjMinutes < 0) {
                adjMinutes += 60;
                adjHours--;
            }
            if (adjHours < 0) {
                adjHours += 24;
                adjDays--;
            }
            if (adjDays < 0) {
                // Get days in previous month
                const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                adjDays += prevMonth.getDate();
                adjMonths--;
            }
            if (adjMonths < 0) {
                adjMonths += 12;
                adjYears--;
            }

            // Extract Weeks from remaining Days
            let finalDays = adjDays;
            let weeks = Math.floor(finalDays / 7);
            finalDays = finalDays % 7;

            // Total days for stats (still useful)
            const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));

            // Pad zeros for time
            const p = (n) => n.toString().padStart(2, '0');

            timerDisplay.innerHTML = `
                <div class="timer-grid">
                    <div class="timer-item"><span class="timer-val">${adjYears}</span><span class="timer-label">Years</span></div>
                    <div class="timer-item"><span class="timer-val">${adjMonths}</span><span class="timer-label">Months</span></div>
                    <div class="timer-item"><span class="timer-val">${weeks}</span><span class="timer-label">Weeks</span></div>
                    <div class="timer-item"><span class="timer-val">${finalDays}</span><span class="timer-label">Days</span></div>
                </div>
                <div class="timer-sub">
                    <span class="time-part">${p(adjHours)}h</span> 
                    <span class="time-part">${p(adjMinutes)}m</span> 
                    <span class="time-part">${p(adjSeconds)}s</span>
                </div>
                <div style="font-size: 0.8rem; margin-top: 15px; opacity: 0.6; color: var(--color-text);">
                    ${Math.floor(diff / 1000).toLocaleString()} Total Seconds
                </div>
            `;

            // Funny Stats Logic
            updateFunnyStats(diff, totalDays, config.people);
        }

        setInterval(update, 1000);
        update(); // initial call
    }

    function updateFunnyStats(diffMs, days, people) {
        // Define time units for calculations
        const years = days / 365.25;
        const months = days / 30.44;
        const weeks = days / 7;

        // Missing Variables (Restored)
        const dogYears = (years * 7).toFixed(2);
        const hamsterLives = (years / 2.5).toFixed(2);
        const travelHours = (weeks * 5.2).toFixed(1);
        const travelDistanceKm = Math.floor(weeks * 196);

        // --- CALCULATIONS FOR 50+ STATS ---

        // TIME & ASTRONOMY
        const minutesTotal = Math.floor(diffMs / 1000 / 60);
        const hoursTotal = Math.floor(minutesTotal / 60);
        const secondsTotal = Math.floor(diffMs / 1000);
        const fortnights = (days / 14).toFixed(1);
        const earthRotations = days;
        const earthDistanceKm = (days * 2570000).toLocaleString(); // Earth travels ~2.57m km a day
        const moonOrbits = (days / 27.3).toFixed(1);
        const issOrbits = (days * 15.5).toLocaleString(); // ISS orbits Earth ~15.5 times/day
        const lightTraveledKm = (secondsTotal * 300000).toLocaleString(); // c = 300,000 km/s

        // BIOLOGY (Combined for 2 people)
        const heartbeats = (minutesTotal * 80 * 2).toLocaleString(); // 80bpm * 2
        const breaths = (minutesTotal * 16 * 2).toLocaleString(); // 16 breaths/min * 2
        const blinks = (minutesTotal * 15 * 2).toLocaleString(); // 15 blinks/min * 2
        const skinCells = (minutesTotal * 35000 * 2).toLocaleString(); // ~35k cells/min * 2
        const hairGrowthCm = (years * 15 * 2).toFixed(1); // ~15cm/year * 2
        const nailGrowthCm = (months * 0.35 * 2).toFixed(1); // ~3.5mm/month * 2
        const sleepHours = (days * 8 * 2).toLocaleString(); // 8h sleep * 2
        const dreams = (days * 5 * 2).toLocaleString(); // ~5 dreams/night * 2
        const bloodPumpedL = (days * 7000 * 2).toLocaleString(); // ~7000L/day * 2

        // CONSUMPTION (Combined)
        const waterLiters = (days * 2 * 2).toLocaleString(); // 2L/day * 2
        const mealsEaten = (days * 3 * 2).toLocaleString(); // 3 meals * 2
        const calories = (days * 1500 * 2).toLocaleString(); // 2200 kcal * 2

        // LIFE & TECH (Combined)
        const phoneUnlocks = (days * 100 * 2).toLocaleString(); // ~100 unlocks/day * 2
        const messages = (days * 50 * 2).toLocaleString(); // 50 msgs/day * 2
        const memes = (days * 5 * 2).toLocaleString(); // 5 memes/day * 2
        const songs = (days * 10 * 2).toLocaleString(); // 10 songs/day * 2
        const netflixHours = (days * 1.5 * 2).toLocaleString(); // 1.5h/day * 2
        const gamingHours = (days * 1 * 2).toLocaleString(); // 1h/day * 2

        // RELATIONSHIP / FUNNY
        const hugs = (days * 2 * 2).toLocaleString(); // 5 hugs/day each?
        const kisses = (days * 2 * 2).toLocaleString(); // 5 kisses/day each?
        const loveYous = (days * 2 * 2).toLocaleString(); // 3 times/day each?
        const argumentsWonAnni = Math.floor(days * 0.05); // 5% chance? ;)
        const argumentsWonNils = Math.floor(days * 0.05);
        const whatToEat = days; // Once a day?
        const fiveMoreMins = (days * 2).toLocaleString(); // Every morning?

        // SAVINGS & TRAVEL
        const savings = days; // $1/day
        const flightsThai = (savings / 900).toFixed(1);
        const flightsJapan = (savings / 1200).toFixed(1);

        const stats = [
            // --- CLASSICS ---
            `Together for <b>${fortnights}</b> Fortnights! 🏰`,
            `Roughly <b>${dogYears}</b> Dog Years! 🐶`,
            `Approx <b>${hamsterLives}</b> Hamster Lifetimes! 🐹`,
            `Combined heartbeats: <b>${heartbeats}</b> 💓`,
            `Combined breaths taken: <b>${breaths}</b> �️`,

            // --- TRAVEL & SAVINGS ---
            `Traveled <b>${travelHours}</b> hours to see each other! 🚆`,
            `Covered approx <b>${travelDistanceKm.toLocaleString()}</b> KM! 🌍`,
            `Saved $1/day: <b>$${savings.toLocaleString()}</b> 💰`,
            `That's <b>${flightsThai}</b> tickets to Thailand! 🐘`,
            `Or <b>${flightsJapan}</b> tickets to Japan! 🍣`,

            // --- BIOLOGY & BODY ---
            `You've blinked <b>${blinks}</b> times! 👁️`,
            `Grew <b>${hairGrowthCm} cm</b> of hair (combined)! 💇‍♀️`,
            `Grew <b>${nailGrowthCm} cm</b> of fingernails! 💅`,
            `Shed <b>${skinCells}</b> skin cells (gross but true)! 🦠`,
            `Pumped <b>${bloodPumpedL} L</b> of blood! 🩸`,
            `Slept for <b>${sleepHours}</b> hours together (or apart)! 😴`,
            `Had approx <b>${dreams}</b> dreams! �`,

            // --- CONSUMPTION ---
            `Drank <b>${waterLiters} L</b> of water! 💧`,
            `Eaten <b>${mealsEaten}</b> meals! 🍽️`,
            `Burned <b>${calories}</b> calories! 🔥`,

            // --- TECH & LIFE ---
            `Unlocked phones <b>${phoneUnlocks}</b> times! 📱`,
            `Sent approx <b>${messages}</b> messages! 💬`,
            `Shared <b>${memes}</b> memes! 🐸`,
            `Listened to <b>${songs}</b> songs! 🎵`,
            `Watched <b>${netflixHours}</b> hours of Netflix/YouTube! 📺`,
            `Played <b>${gamingHours}</b> hours of games! 🎮`,

            // --- COSMIC ---
            `Earth rotated <b>${earthRotations}</b> times! 🌎`,
            `Earth traveled <b>${earthDistanceKm} km</b> through space! 🚀`,
            `Moon orbited <b>${moonOrbits}</b> times! 🌕`,
            `ISS orbited <b>${issOrbits}</b> times! 🛰️`,
            // Light traveled removed (too big)

            // --- FIT & CUTE ---
            `Walked approx <b>${(days * 8000 * 2).toLocaleString()}</b> steps together! 👣`,
            `Burned <b>${(days * 15 * 2).toLocaleString()}</b> calories kissing! 😘`,
            `Shared <b>${(days * 20).toLocaleString()}</b> laughs! 😂`,
            `Sent <b>${days}</b> "Good Morning" texts! ☀️`,
            `Sent <b>${days}</b> "Good Night" texts! 🌙`,
            `Watched approx <b>${(weeks * 150).toLocaleString()}</b> TikToks! 📱`,

            // --- RELATIONSHIP FUN ---
            `Shared <b>${hugs}</b> hugs! 🫂`,
            `Exchanged <b>${kisses}</b> kisses! 💋`,
            `Said "I love you" <b>${loveYous}</b> times! 💖`,
            `Asked "What should we eat?" <b>${whatToEat}</b> times! 🍔`,
            `Smashed alarm ("5 more mins") <b>${fiveMoreMins}</b> times! ⏰`,
            `Anni won <b>${argumentsWonAnni}</b> arguments! 🏆`,
            `Nils won <b>${argumentsWonNils}</b> arguments! ...maybe? 🤔`,
            `You are <b>100%</b> cuter together! ✨`
        ];

        // NEW: Life Percentage Logic per person
        if (people) {
            for (const [name, bdayStr] of Object.entries(people)) {
                const bdayParts = bdayStr.split('.');
                const bday = new Date(bdayParts[2], bdayParts[1] - 1, bdayParts[0]);
                const now = new Date();
                const ageMs = now - bday;

                if (ageMs > 0) {
                    const percentage = ((diffMs / ageMs) * 100).toFixed(4);
                    stats.push(`<b>${name}</b> spent <b>${percentage}%</b> of life together! 💍`);
                }
            }
        }

        // CAROUSEL LOGIC: Only show one at a time
        if (!window.currentStatIndex) window.currentStatIndex = 0;

        // Helper to switch stat with animation
        const switchStat = () => {
            window.currentStatIndex = (window.currentStatIndex + 1) % stats.length;
            statsDisplay.style.opacity = 0;
            setTimeout(() => {
                const newStat = stats[window.currentStatIndex % stats.length];
                statsDisplay.innerHTML = `<div class="stat-box carousel-active">${newStat}</div>`;
                statsDisplay.setAttribute('data-current-stat', newStat);
                statsDisplay.style.opacity = 1;
            }, 500);
        };

        // Auto-cycle index every 8 seconds
        if (!window.statCycleInterval) {
            window.statCycleInterval = setInterval(switchStat, 8000);
            // Click to skip
            statsDisplay.addEventListener('click', () => {
                clearInterval(window.statCycleInterval); // Reset timer
                window.statCycleInterval = setInterval(switchStat, 8000);
                switchStat();
            });
        }

        const currentStat = stats[window.currentStatIndex % stats.length];
        statsDisplay.style.transition = 'opacity 0.5s ease-in-out';
        statsDisplay.style.display = 'flex';
        statsDisplay.style.justifyContent = 'center';
        statsDisplay.style.alignItems = 'center';
        statsDisplay.style.textAlign = 'center';
        statsDisplay.style.minHeight = '80px';

        // Only update content if it has changed and not currently fading out
        if (statsDisplay.style.opacity !== '0' && statsDisplay.getAttribute('data-current-stat') !== currentStat) {
            statsDisplay.innerHTML = `<div class="stat-box carousel-active">${currentStat}</div>`;
            statsDisplay.setAttribute('data-current-stat', currentStat);
        }
    }
});
