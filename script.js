const paragraphs = [
  "Programming is the art of telling another human being what one wants the computer to do.",
  "JavaScript is the language of the web, enabling dynamic and interactive experiences.",
  "Typing speed tests measure words per minute and accuracy of the user.",
  "Consistency is the key to improving your coding and typing skills over time."
];

let startTime, endTime, timerRunning = false;

const textDisplay = document.getElementById("textDisplay");
const textInput = document.getElementById("textInput");
const result = document.getElementById("result");
const leaderboardBody = document.getElementById("leaderboardBody");

let currentParagraph = "";

function loadParagraph() {
  currentParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
  textDisplay.textContent = currentParagraph;
}

function calculateResult() {
  endTime = new Date();
  const totalTime = (endTime - startTime) / 1000 / 60; // in minutes

  const typedText = textInput.value.trim();
  const wordsTyped = typedText.split(/\s+/).length;
  const wpm = Math.round(wordsTyped / totalTime);

  // Accuracy
  let correctChars = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === currentParagraph[i]) correctChars++;
  }
  const accuracy = ((correctChars / currentParagraph.length) * 100).toFixed(2);

  result.textContent = `⏱️ Speed: ${wpm} WPM | 🎯 Accuracy: ${accuracy}%`;

  saveToLeaderboard(wpm, accuracy);
  displayLeaderboard();
}

textInput.addEventListener("input", () => {
  if (!timerRunning) {
    startTime = new Date();
    timerRunning = true;
  }
  if (textInput.value.trim() === currentParagraph) {
    calculateResult();
    textInput.disabled = true;
  }
});

function saveToLeaderboard(wpm, accuracy) {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ wpm, accuracy });
  leaderboard.sort((a, b) => b.wpm - a.wpm); // sort by WPM
  leaderboard = leaderboard.slice(0, 5); // keep top 5
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardBody.innerHTML = "";
  leaderboard.forEach((entry, index) => {
    leaderboardBody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${entry.wpm}</td>
        <td>${entry.accuracy}%</td>
      </tr>
    `;
  });
}

function restartTest() {
  textInput.disabled = false;
  textInput.value = "";
  result.textContent = "";
  timerRunning = false;
  loadParagraph();
}

// Init
loadParagraph();
displayLeaderboard();
