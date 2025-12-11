const symbols = ['C', 'D', 'E', 'F', 'G', 'A', 'B']; // Re-ordered C-B for easier reading, but random pick doesn't care
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const spinBtn = document.getElementById('spin-btn');
const statusMsg = document.getElementById('status-message');

let isSpinning = false;

// Note name to Semitone value (C=0)
const noteValues = {
    'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
};

// Note name to Index (for calculating Degree: 2nd, 3rd...)
// C=0, D=1, E=2, F=3, G=4, A=5, B=6
// Ordered naturally C D E F G A B
const noteIndices = {
    'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6
};

function getRandomSymbol() {
    // Return random key from noteValues
    const keys = Object.keys(noteValues);
    return keys[Math.floor(Math.random() * keys.length)];
}

function getIntervalName(note1, note2) {
    // 1. Calculate Degree Interval (e.g., C to E is 3rd)
    const idx1 = noteIndices[note1];
    const idx2 = noteIndices[note2];

    // Check distance ascending (modulo 7)
    let degreeDist = (idx2 - idx1 + 7) % 7;
    // 0=1st(Unison), 1=2nd, 2=3rd...

    // 2. Calculate Semitone Interval
    const val1 = noteValues[note1];
    const val2 = noteValues[note2];
    let semitoneDist = (val2 - val1 + 12) % 12;

    // 3. Determine Name
    // Map based on Degree + Semitones
    const degreeMap = {
        0: '1度', // Unison (Disabled in our logic, but handling for safety)
        1: '2度',
        2: '3度',
        3: '4度',
        4: '5度',
        5: '6度',
        6: '7度'
    };

    const baseDegree = degreeMap[degreeDist];

    // Resolve Quality
    if (degreeDist === 1) { // 2nd
        if (semitoneDist === 1) return "短2度";
        if (semitoneDist === 2) return "長2度";
    }
    if (degreeDist === 2) { // 3rd
        if (semitoneDist === 3) return "短3度";
        if (semitoneDist === 4) return "長3度";
    }
    if (degreeDist === 3) { // 4th
        if (semitoneDist === 5) return "完全4度";
        if (semitoneDist === 6) return "増4度"; // e.g. F-B
    }
    if (degreeDist === 4) { // 5th
        if (semitoneDist === 7) return "完全5度";
        if (semitoneDist === 6) return "減5度"; // e.g. B-F
    }
    if (degreeDist === 5) { // 6th
        if (semitoneDist === 8) return "短6度";
        if (semitoneDist === 9) return "長6度";
    }
    if (degreeDist === 6) { // 7th
        if (semitoneDist === 10) return "短7度";
        if (semitoneDist === 11) return "長7度";
    }

    return baseDegree + " (?)"; // Fallback
}

function spinReel(reelElement, duration, targetSymbol) {
    return new Promise(resolve => {
        reelElement.classList.add('spinning');
        const symbolElement = reelElement.querySelector('.symbol');

        const interval = setInterval(() => {
            symbolElement.textContent = getRandomSymbol();
        }, 80);

        setTimeout(() => {
            clearInterval(interval);
            reelElement.classList.remove('spinning');
            symbolElement.textContent = targetSymbol;
            resolve(targetSymbol);
        }, duration);
    });
}

spinBtn.addEventListener('click', async () => {
    if (isSpinning) return;

    isSpinning = true;
    spinBtn.disabled = true;
    statusMsg.textContent = "Spinning...";
    statusMsg.className = "status";
    statusMsg.classList.remove('win'); // Remove win style if present

    const result1 = getRandomSymbol();
    let result2 = getRandomSymbol();

    while (result2 === result1) {
        result2 = getRandomSymbol();
    }

    const p1 = spinReel(reel1, 800, result1);
    const p2 = spinReel(reel2, 1100, result2);

    await Promise.all([p1, p2]);

    isSpinning = false;
    spinBtn.disabled = false;

    // DISPLAY INTERVAL
    const intervalName = getIntervalName(result1, result2);
    statusMsg.textContent = intervalName;
    statusMsg.classList.add('win'); // Maintain the glow effect for visibility
});
