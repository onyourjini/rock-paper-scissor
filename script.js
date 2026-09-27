const MOVES = {
    rock: { emoji:"✊", beats: "scissors" },
    paper: { emoji: "✋", beats: "rock" },
    scissors: { emoji: "✌️", beats: "paper" },
};

const MOVE_KEYS = Object.keys(MOVES);

const playerHand = document.getElementById("playerHand");
const cpuHand = document.getElementById("cpuHand");
const resultMsg = document.getElementById("resultMsg");
const choiceButtons = document.querySelectorAll(".choice-btn");
const resetBtn = document.getElementById("resetBtn");
const playerScoreEl = document.getElementById("playerScore");
const tieScoreEl = document.getElementById("tieScore");
const cpuScoreEl = document.getElementById("cpuScore");
const streakBox = document.getElementById("streakBox");
const streakCountEl = document.getElementById("streakCount");

let playerScore = 0;
let tieScore = 0;
let cpuScore = 0;
let winStreak = 0;
let playing = false;

function randomMove() {
    return MOVE_KEYS[Math.floor(Math.random() * MOVE_KEYS.length)];
}

function getOutcome(playerMove, cpuMove) {
    if (playerMove === cpuMove) return "tie";
    return MOVES[playerMove].beats === cpuMove ? "win" : "lose";
}

function renderScores() {
    playerScoreEl.textContent = playerScore;
    tieScoreEl.textContent = tieScore;
    cpuScoreEl.textContent = cpuScore;
}

function renderStreak() {
    if (winStreak >= 2) {
        streakBox.classList.remove("hidden");
        streakCountEl.textContent = winStreak;
    } else {
        streakBox.classList.add("hidden");
    }
}

function playRound(playerMove) {
    if (playing) return;

    playing = true;

    choiceButtons.forEach(btn => (btn.disabled = true));
    resultMsg.textContent = "Rock... Paper... Scissors...";
    resultMsg.className = "result-msg";

    playerHand.textContent = "✊";
    cpuHand.textContent = "✊";
    playerHand.className = "hand shaking";
    cpuHand.className = "hand shaking";

    setTimeout(() => {
        const cpuMove = randomMove();
        const outcome = getOutcome(playerMove, cpuMove);

        playerHand.textContent = MOVES[playerMove].emoji;
        cpuHand.textContent = MOVES[cpuMove].emoji;
        playerHand.className = "hand pop";

        if (outcome === "win") {
            playerHand.classList.add("win");
            cpuHand.classList.add("lose");
        } else if (outcome === "lose") {
            cpuHand.classList.add("win");
            playerHand.classList.add("lose");
        }

        applyOutcome(outcome, playerMove, cpuMove);

        choiceButtons.forEach(btn => (btn.disabled = false));
        playing = false;
    }, 750);
}

function applyOutcome(outcome, playerMove, cpuMove) {
    if (outcome === "win") {
        playerScore++;
        winStreak++;
        resultMsg.textContent =`You win ${capitalize(playerMove)} beats ${cpuMove}.`;
        resultMsg.className = "result-msg win";
    } else if (outcome === "lose") {
        cpuScore++;
        winStreak = 0;
        resultMsg.textContent = `You lose! ${capitalize(cpuMove)} beats ${playerMove}.`;
        resultMsg.className = "result-msg lose";
    } else {
        tieScore++;
        resultMsg.textContent = `It's a tie! Both chose ${playerMove}.`;
        resultMsg.className = "result-msg tie";
    }

    renderScores();
    renderStreak();
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

choiceButtons.forEach(btn => {
    btn.addEventListener("click", () => playRound(btn.dataset.choice));
});

resetBtn.addEventListener("click", () => {
    if (playing) return;
    playerScore = 0;
    tieScore = 0;
    cpuScore = 0;
    winStreak = 0;
    renderScores();
    renderStreak();
    resultMsg.textContent = "Choose your move!";
    resultMsg.className = "result-msg";
    playerHand.textContent ="✊";
    cpuHand.textContent = "✊";
    playerHand.className = "hand";
    cpuHand.className = "hand";
});
