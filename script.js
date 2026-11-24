let giftTaps = 0;
let giftOpened = false;
let noDodges = 0;

// 0. Top scroll progress bar
window.addEventListener("scroll", () => {
    const bar = document.getElementById("readingProgress");
    if (!bar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    bar.style.width = pct + "%";
});

// 1. Interactive 3-tap gift unboxing
function handleGiftTap() {
    if (giftOpened) {
        createHearts(10);
        return;
    }

    const gift = document.getElementById("gift");
    const hint = document.getElementById("hint");

    giftTaps++;
    gift.classList.remove("shake");
    void gift.offsetWidth;
    gift.classList.add("shake");

    playMusicBoxNote(523.25 + giftTaps * 80, 0.45);

    if (giftTaps === 1) {
        hint.textContent = "Ooh, something's inside! Tap again! ✨";
        createHearts(5);
    } else if (giftTaps === 2) {
        hint.textContent = "Almost open... one last tap! 🤭🎁";
        createHearts(8);
    } else {
        giftOpened = true;
        const letter = document.getElementById("letter");

        letter.classList.remove("hidden");
        letter.classList.add("revealed");

        gift.textContent = "💝";
        gift.style.transform = "none";
        hint.textContent = "Awww, you opened it! ❤️";

        createHearts(22);
        playMusicBoxNote(783.99, 0.65);

        setTimeout(() => {
            letter.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 250);
    }
}

// 2. Surprise reveal
function showSurprise() {
    const surprise = document.getElementById("surprise");
    const btn = document.getElementById("surpriseBtn");

    surprise.classList.remove("hidden");
    btn.textContent = "Hehehe caught you smiling 🤭";
    createHearts(18);
    playMusicBoxNote(659.25, 0.55);

    surprise.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// 3. Playful dodging "Not yet" button
const noMessages = [
    "Hala, nag-dodge! 😜",
    "Bawal mag-No today 🤭",
    "Oops, too slow! 💕",
    "Click the pink one na~ 🥺",
    "Sige na nga, smile ka na! ❤️"
];

function dodgeNo() {
    const noBtn = document.getElementById("noBtn");
    const yesBtn = document.getElementById("yesBtn");
    const answer = document.getElementById("answer");

    noDodges++;

    const offsetX = (Math.random() - 0.5) * 140;
    const offsetY = (Math.random() - 0.5) * 50;
    noBtn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    noBtn.textContent = noMessages[(noDodges - 1) % noMessages.length];
    const yesScale = Math.min(1 + noDodges * 0.08, 1.45);
    yesBtn.style.transform = `scale(${yesScale})`;

    answer.textContent = "Aba! Ayaw magpa-click ng 'Not yet' oh! 🤭💕";
    createHearts(6);
}

function answerYes() {
    const noBtn = document.getElementById("noBtn");
    const yesBtn = document.getElementById("yesBtn");

    noBtn.style.display = "none";
    yesBtn.style.transform = "scale(1.08)";

    document.getElementById("answer").textContent =
        "YAY! Mission accomplished! Hehehe 🥰❤️";

    createHearts(25);
    playMusicBoxNote(783.99, 0.65);
}

// 4. Floating hearts generator
function createHearts(count = 12) {
    const area = document.getElementById("hearts");
    const icons = ["💕", "💗", "♡", "💖", "✨"];

    for (let i = 0; i < count; i++) {
        const heart = document.createElement("span");
        heart.className = "floating-heart";
        heart.textContent = icons[Math.floor(Math.random() * icons.length)];

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.fontSize = (16 + Math.random() * 20) + "px";
        heart.style.animationDuration = (3 + Math.random() * 2) + "s";

        area.appendChild(heart);
        setTimeout(() => heart.remove(), 5000);
    }
}

// 5. Tap-anywhere sparkle burst
document.addEventListener("pointerdown", (e) => {
    const sparkles = ["♡", "✨", "💗", "❄"];
    for (let i = 0; i < 4; i++) {
        const spark = document.createElement("span");
        spark.className = "tap-sparkle";
        spark.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        spark.style.left = e.clientX + "px";
        spark.style.top = e.clientY + "px";
        spark.style.fontSize = (12 + Math.random() * 10) + "px";
        spark.style.color = "#e07a9b";

        const angle = Math.random() * Math.PI * 2;
        const dist = 25 + Math.random() * 35;
        spark.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
        spark.style.setProperty("--ty", `${Math.sin(angle) * dist - 20}px`);

        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 900);
    }
});

// 6. Falling snowflakes & sparkles
const snow = document.getElementById("snow");
const flakes = ["❄", "❅", "✨", "•"];

for (let i = 0; i < 36; i++) {
    const flake = document.createElement("span");
    flake.className = "falling";
    flake.textContent = flakes[Math.floor(Math.random() * flakes.length)];

    flake.style.left = Math.random() * 100 + "vw";
    flake.style.fontSize = (9 + Math.random() * 14) + "px";
    flake.style.opacity = (0.45 + Math.random() * 0.55).toFixed(2);
    flake.style.animationDuration = (6 + Math.random() * 9) + "s";
    flake.style.animationDelay = Math.random() * 8 + "s";
    flake.style.color = "#ffffff";

    snow.appendChild(flake);
}

// 7. Longer two-part music-box waltz with soft low harmony notes
let audioCtx = null;
let isPlaying = false;
let loopTimer = null;

function playMusicBoxNote(freq, duration = 1.25, volume = 0.03) {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === "suspended") audioCtx.resume();

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const overtone = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const overtoneGain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        overtone.type = "triangle";
        overtone.frequency.setValueAtTime(freq * 2, now);
        overtoneGain.gain.setValueAtTime(volume * 0.22, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        overtone.connect(overtoneGain);
        overtoneGain.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        overtone.start(now);
        osc.stop(now + duration);
        overtone.stop(now + duration);
    } catch (_) {}
}

function playLullabyCycle() {
    // 16-note two-part phrase (~9.2s) with soft low harmony pulses
    const arrangement = [
        // Phrase A (warm Cmaj7 -> Am9 feel)
        { freq: 523.25, delay: 0,    dur: 1.2, bass: 130.81 }, // C5 + C3
        { freq: 659.25, delay: 560,  dur: 1.1, bass: null },
        { freq: 783.99, delay: 1120, dur: 1.2, bass: null },
        { freq: 987.77, delay: 1680, dur: 1.4, bass: null },
        { freq: 880.00, delay: 2320, dur: 1.2, bass: 110.00 }, // A5 + A2
        { freq: 783.99, delay: 2880, dur: 1.1, bass: null },
        { freq: 659.25, delay: 3440, dur: 1.2, bass: null },
        { freq: 587.33, delay: 4000, dur: 1.4, bass: null },

        // Phrase B (gentle Fmaj7 -> G6 resolution)
        { freq: 698.46, delay: 4680, dur: 1.2, bass: 174.61 }, // F5 + F3
        { freq: 880.00, delay: 5240, dur: 1.1, bass: null },
        { freq: 1046.50, delay: 5800, dur: 1.3, bass: null },
        { freq: 987.77, delay: 6360, dur: 1.2, bass: null },
        { freq: 783.99, delay: 6960, dur: 1.2, bass: 196.00 }, // G5 + G3
        { freq: 659.25, delay: 7520, dur: 1.1, bass: null },
        { freq: 587.33, delay: 8080, dur: 1.2, bass: null },
        { freq: 523.25, delay: 8640, dur: 1.7, bass: 130.81 }  // C5 + C3 resolve
    ];

    arrangement.forEach(({ freq, delay, dur, bass }) => {
        setTimeout(() => {
            if (!isPlaying) return;
            playMusicBoxNote(freq, dur, 0.03);
            if (bass) {
                playMusicBoxNote(bass, dur + 0.4, 0.022);
            }
        }, delay);
    });
}

function toggleMusic() {
    const btn = document.getElementById("musicBtn");
    isPlaying = !isPlaying;

    if (isPlaying) {
        if (btn) btn.textContent = "🎵";
        playLullabyCycle();
        loopTimer = setInterval(playLullabyCycle, 10400);
    } else {
        if (btn) btn.textContent = "🔇";
        clearInterval(loopTimer);
    }
}