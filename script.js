
const characterFolder = document.getElementById("characterFolder");
const maxResultInput = document.getElementById("maxResult");
const roundCountInput = document.getElementById("roundCount");
const startButton = document.getElementById("startButton");
const settingsMessage = document.getElementById("settingsMessage");

const settings = document.getElementById("settings");
const game = document.getElementById("game");

const firstRow = document.getElementById("firstRow");
const secondRow = document.getElementById("secondRow");
const resultRow = document.getElementById("resultRow");

const roundInfo = document.getElementById("roundInfo");
const answerInput = document.getElementById("answerInput");
const checkButton = document.getElementById("checkButton");
const nextButton = document.getElementById("nextButton");
const feedback = document.getElementById("feedback");
const backButton = document.getElementById("backButton");

// --------------------------------------------------
// ΕΙΚΟΝΕΣ ΑΝΑ ΚΑΤΗΓΟΡΙΑ
// Πρόσθεσε εδώ τα ονόματα των δικών σου εικόνων.
// --------------------------------------------------

const imageFolders = {
    "toy-story": [
        "images/woody.jpg",
        //"images/thomas/percy.png"
    ],

    //"toy-story": [
      //  "images/toy-story/woody.png",
        //"images/toy-story/buzz.png"
    //],

    //"animals": [
      //  "images/animals/dog.png",
        //"images/animals/cat.png"
    //]
};

// --------------------------------------------------
// ΜΕΤΑΒΛΗΤΕΣ ΠΑΙΧΝΙΔΙΟΥ
// --------------------------------------------------

let imageFiles = [];
let currentRound = 0;
let totalRounds = 10;
let maxResult = 10;
let correctAnswer = 0;
let gameFinished = false;

// --------------------------------------------------
// ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ
// --------------------------------------------------

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearRows() {
    firstRow.replaceChildren();
    secondRow.replaceChildren();
    resultRow.replaceChildren();
}

function resetFeedback() {
    feedback.textContent = "";
    feedback.className = "message";
}

function createCharacter(imageFile) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "character";
    button.setAttribute("aria-label", "Κρυφή εικόνα");

    const img = document.createElement("img");

    img.src = imageFile;
    img.alt = "";

    // Ενημέρωση αν δεν βρεθεί το αρχείο εικόνας
    img.addEventListener("error", function () {
        button.title = "Δεν βρέθηκε η εικόνα: " + imageFile;
        button.style.borderColor = "#c62828";
    });

    button.appendChild(img);

    button.addEventListener("click", function () {
        button.classList.add("revealed");
        button.setAttribute("aria-label", "Αποκαλυμμένη εικόνα");
    });

    return button;
}

function addCharacters(container, count, imageFile) {
    for (let i = 0; i < count; i++) {
        container.appendChild(createCharacter(imageFile));
    }
}

// --------------------------------------------------
// ΕΝΑΡΞΗ ΠΑΙΧΝΙΔΙΟΥ
// --------------------------------------------------

startButton.addEventListener("click", function () {
    const maxValue = Number(maxResultInput.value);
    const roundsValue = Number(roundCountInput.value);

    const selectedFolder = characterFolder.value;
    const selectedImages = imageFolders[selectedFolder];

    // Έλεγχος κατηγορίας
    if (!selectedImages || selectedImages.length === 0) {
        settingsMessage.textContent =
            "Η κατηγορία δεν περιέχει εικόνες.";

        settingsMessage.className = "message error";
        return;
    }

    // Έλεγχος μέγιστου αποτελέσματος
    if (
        maxResultInput.value.trim() === "" ||
        !Number.isInteger(maxValue) ||
        maxValue < 2 ||
        maxValue > 100
    ) {
        settingsMessage.textContent =
            "Γράψε ακέραιο αριθμό από 2 έως 100.";

        settingsMessage.className = "message error";
        return;
    }

    // Έλεγχος αριθμού προσθέσεων
    if (
        roundCountInput.value.trim() === "" ||
        !Number.isInteger(roundsValue) ||
        roundsValue < 1 ||
        roundsValue > 100
    ) {
        settingsMessage.textContent =
            "Γράψε αριθμό προσθέσεων από 1 έως 100.";

        settingsMessage.className = "message error";
        return;
    }

    // Φόρτωση εικόνων της επιλεγμένης κατηγορίας
    imageFiles = selectedImages.slice();

    maxResult = maxValue;
    totalRounds = roundsValue;
    currentRound = 0;
    gameFinished = false;

    settingsMessage.textContent = "";
    settingsMessage.className = "message";

    settings.hidden = true;
    game.hidden = false;

    nextRound();
});

// --------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΝΕΑΣ ΠΡΟΣΘΕΣΗΣ
// --------------------------------------------------

function nextRound() {
    if (currentRound >= totalRounds) {
        finishGame();
        return;
    }

    currentRound++;
    gameFinished = false;

    clearRows();
    resetFeedback();

    answerInput.value = "";
    answerInput.disabled = false;

    checkButton.disabled = false;
    nextButton.hidden = true;
    nextButton.textContent = "Επόμενη πρόσθεση";

    roundInfo.textContent =
        "Πρόσθεση " + currentRound + " / " + totalRounds;

    // Τυχαίο αποτέλεσμα από το 2 μέχρι το όριο
    correctAnswer = randomInt(2, maxResult);

    // Δύο θετικοί αριθμοί με το συγκεκριμένο άθροισμα
    const firstNumber = randomInt(1, correctAnswer - 1);
    const secondNumber = correctAnswer - firstNumber;

    // Επιλογή τυχαίου χαρακτήρα από την κατηγορία
    const randomImage = imageFiles[
        randomInt(0, imageFiles.length - 1)
    ];

    // Πρώτη σειρά
    addCharacters(firstRow, firstNumber, randomImage);

    // Δεύτερη σειρά
    addCharacters(secondRow, secondNumber, randomImage);

    // Τρίτη σειρά: εικόνες ίσες με το αποτέλεσμα
    addCharacters(resultRow, correctAnswer, randomImage);

    answerInput.focus();
}

// --------------------------------------------------
// ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΗΣ
// --------------------------------------------------

function checkAnswer() {
    if (gameFinished) return;

    if (answerInput.value.trim() === "") {
        feedback.textContent = "Γράψε πρώτα έναν αριθμό.";
        feedback.className = "message error";
        return;
    }

    const answer = Number(answerInput.value);

    if (!Number.isInteger(answer)) {
        feedback.textContent = "Γράψε έναν ακέραιο αριθμό.";
        feedback.className = "message error";
        return;
    }

    if (answer === correctAnswer) {
        feedback.textContent = "Σωστά! Μπράβο!";
        feedback.className = "message success";

        gameFinished = true;

        answerInput.disabled = true;
        checkButton.disabled = true;

        if (currentRound === totalRounds) {
            nextButton.textContent = "Ολοκλήρωση παιχνιδιού";
        } else {
            nextButton.textContent = "Επόμενη πρόσθεση";
        }

        nextButton.hidden = false;
        nextButton.focus();

    } else {
        feedback.textContent = "Δοκίμασε ξανά!";
        feedback.className = "message error";

        answerInput.focus();
        answerInput.select();
    }
}

checkButton.addEventListener("click", checkAnswer);

answerInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

// --------------------------------------------------
// ΕΠΟΜΕΝΗ ΠΡΟΣΘΕΣΗ
// --------------------------------------------------

nextButton.addEventListener("click", function () {
    if (!gameFinished) return;

    if (currentRound >= totalRounds) {
        finishGame();
    } else {
        nextRound();
    }
});

// --------------------------------------------------
// ΟΛΟΚΛΗΡΩΣΗ ΠΑΙΧΝΙΔΙΟΥ
// --------------------------------------------------

function finishGame() {
    game.hidden = true;
    settings.hidden = false;

    settingsMessage.textContent =
        "Το παιχνίδι ολοκληρώθηκε! Παίχτηκαν " +
        totalRounds + " προσθέσεις.";

    settingsMessage.className = "message success";
}

// --------------------------------------------------
// ΕΠΙΣΤΡΟΦΗ ΣΤΗΝ ΑΡΧΙΚΗ ΟΘΟΝΗ
// --------------------------------------------------

backButton.addEventListener("click", function () {
    game.hidden = true;
    settings.hidden = false;

    resetFeedback();

    settingsMessage.textContent =
        "Μπορείς να αλλάξεις τις ρυθμίσεις και να ξεκινήσεις ξανά.";

    settingsMessage.className = "message";
});
