const words = ["the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "I", "with", "as", "not", "on", "she", "at", "by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", "can", "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", "new", "year", "some", "take"];

const TEST_TIME = 30; // 30 seconds
let timeRemaining = TEST_TIME;
let timer = null;
let isTyping = false;
let totalKeystrokes = 0;
let correctKeystrokes = 0;

// DOM Elements
const testScreen = document.getElementById('test-screen');
const resultsScreen = document.getElementById('results-screen');
const leaderboardScreen = document.getElementById('leaderboard-screen');
const wordDisplay = document.getElementById('word-display');
const timerDisplay = document.getElementById('timer');

// Initialize the test
function initTest() {
    clearInterval(timer);
    timeRemaining = TEST_TIME;
    timerDisplay.innerText = timeRemaining;
    isTyping = false;
    totalKeystrokes = 0;
    correctKeystrokes = 0;
    
    // Generate random words
    wordDisplay.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const wordStr = words[Math.floor(Math.random() * words.length)] + " ";
        const wordEl = document.createElement('div');
        wordEl.className = 'word';
        
        wordStr.split('').forEach(char => {
            const letterEl = document.createElement('span');
            letterEl.className = 'letter';
            letterEl.innerText = char;
            wordEl.appendChild(letterEl);
        });
        wordDisplay.appendChild(wordEl);
    }
    
    // Set first letter active
    wordDisplay.querySelector('.letter').classList.add('active');
    showScreen('test-screen');
}

// Handle typing logic
document.addEventListener('keydown', (e) => {
    // Don't do anything if we aren't on the test screen
    if (testScreen.classList.contains('hidden')) return;

    const activeLetter = document.querySelector('.letter.active');
    if (!activeLetter) return;

    // --- NEW: Handle Backspace ---
    if (e.key === 'Backspace') {
        // 1. Find the previous letter (either in this word, or the last letter of the previous word)
        let prevLetter = activeLetter.previousSibling;
        if (!prevLetter && activeLetter.parentElement.previousSibling) {
            prevLetter = activeLetter.parentElement.previousSibling.lastChild;
        }

        // 2. If a previous letter exists, move the caret back
        if (prevLetter) {
            activeLetter.classList.remove('active');
            prevLetter.classList.add('active');

            // 3. If we are undoing a correct character, deduct it from our score
            if (prevLetter.classList.contains('correct')) {
                correctKeystrokes--;
            }

            // 4. Clear the visual status so it looks untyped again
            prevLetter.classList.remove('correct', 'incorrect');
        }
        return; // Exit early so Backspace isn't counted as a typed character
    }

    // Ignore other non-character keys (like Shift, Tab, CapsLock, etc.)
    if (e.key.length !== 1) return;

    // --- ORIGINAL: Handle Normal Typing ---
    if (!isTyping) {
        isTyping = true;
        timer = setInterval(updateTimer, 1000);
    }

    totalKeystrokes++;
    const expectedChar = activeLetter.innerText;

    if (e.key === expectedChar) {
        activeLetter.classList.add('correct');
        correctKeystrokes++;
    } else {
        activeLetter.classList.add('incorrect');
    }

    // Move caret forward
    activeLetter.classList.remove('active');
    
    // Find the next letter (either in this word, or the first letter of the next word)
    const nextLetter = activeLetter.nextSibling || activeLetter.parentElement.nextSibling?.firstChild;
    
    if (nextLetter) {
        nextLetter.classList.add('active');
    } else {
        endTest(); // Reached end of generated text early
    }
});

function endTest() {
    clearInterval(timer);
    
    // Convert your test time (e.g., 30 seconds) into minutes
    const timeInMinutes = TEST_TIME / 60;
    
    // Calculate Raw WPM
    // Uses ALL keystrokes. Math.round prevents decimals.
    let rawWpm = Math.round((totalKeystrokes / 5) / timeInMinutes);
    
    // Calculate Net WPM
    // Uses ONLY correct keystrokes.
    let netWpm = Math.round((correctKeystrokes / 5) / timeInMinutes);

    // Calculate Accuracy
    let accuracy = Math.round((correctKeystrokes / totalKeystrokes) * 100);

    // Edge Case Handling: 
    // If the user didn't type anything, prevent NaN from showing up
    if (totalKeystrokes === 0) {
        rawWpm = 0;
        netWpm = 0;
        accuracy = 0;
    }

    // Output to your DOM elements
    // (You would need to add an id="raw-wpm-result" to your HTML)
    document.getElementById('raw-wpm-result').innerText = rawWpm;
    document.getElementById('wpm-result').innerText = netWpm; // Net WPM is usually the main score
    document.getElementById('acc-result').innerText = accuracy;
    
    showScreen('results-screen');
}

// Leaderboard Logic
document.getElementById('save-score-btn').addEventListener('click', () => {
    const name = document.getElementById('name-input').value || 'Anonymous';
    const wpm = parseInt(document.getElementById('wpm-result').innerText);
    
    const scores = JSON.parse(localStorage.getItem('typingScores')) || [];
    scores.push({ name, wpm, date: new Date().toLocaleDateString() });
    scores.sort((a, b) => b.wpm - a.wpm); // Sort descending
    localStorage.setItem('typingScores', JSON.stringify(scores.slice(0, 10))); // Keep top 10
    
    renderLeaderboard();
});

function renderLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('typingScores')) || [];
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';
    
    scores.forEach((score, index) => {
        const li = document.createElement('li');
        li.innerText = `${index + 1}. ${score.name} - ${score.wpm} WPM`;
        list.appendChild(li);
    });
    
    showScreen('leaderboard-screen');
}

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    document.getElementById(screenId).classList.add('active');
}

document.getElementById('restart-btn').addEventListener('click', initTest);
document.getElementById('play-again-btn').addEventListener('click', initTest);



// Boot
initTest();