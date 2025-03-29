const chunks = [
  { english: "budding poets", mandarin: "新兴诗人" },
  { english: "adjudge", mandarin: "判定" },
  { english: "adjourned", mandarin: "休会" },
  { english: "impart", mandarin: "传授" },
  { english: "rival", mandarin: "竞争对手" },
  { english: "synonymous", mandarin: "同义的" },
  { english: "pampering", mandarin: "溺爱" },
  { english: "instill", mandarin: "灌输" },
  { english: "cultivate", mandarin: "培养" },
  { english: "counteract", mandarin: "抵消" },
  { english: "stalagmites", mandarin: "石笋" },
  { english: "pillars", mandarin: "柱子" },
  { english: "white water rafting", mandarin: "激流漂流" },
  { english: "abseiling", mandarin: "绳降" },
  
];

let currentQuestionIndex = 0;
let score = 0;
let wrongAnswers = [];

const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const feedbackElement = document.getElementById("feedback");
const submitAnswerButton = document.getElementById("submit-answer");
const nextQuestionButton = document.getElementById("next-question");
const scoreElement = document.getElementById("score");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function displayQuestion() {
  const currentChunk = chunks[currentQuestionIndex];
  questionElement.textContent = `What is the Mandarin for: "${currentChunk.english}"?`;

  const shuffledChunks = shuffle([...chunks]);
  const options = shuffledChunks.slice(0, 4).map((chunk) => chunk.mandarin);

  if (!options.includes(currentChunk.mandarin)) {
    options[Math.floor(Math.random() * 4)] = currentChunk.mandarin;
  }

  optionsContainer.innerHTML = "";
  options.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.textContent = option;
    optionElement.classList.add("option");
    optionElement.addEventListener("click", () => {
      document
        .querySelectorAll(".option")
        .forEach((opt) => opt.classList.remove("selected"));
      optionElement.classList.add("selected");
    });
    optionsContainer.appendChild(optionElement);
  });

  feedbackElement.textContent = "";
  scoreElement.textContent = `Score: ${score}`;
}

function checkAnswer() {
  const selectedOption = document.querySelector(".option.selected");
  if (!selectedOption) {
    feedbackElement.textContent = "Please select an answer.";
    feedbackElement.style.color = "red";
    return;
  }

  const userAnswer = selectedOption.textContent;
  const correctAnswer = chunks[currentQuestionIndex].mandarin;

  if (userAnswer === correctAnswer) {
    feedbackElement.textContent = "Correct!";
    feedbackElement.style.color = "green";
    score++;
  } else {
    feedbackElement.textContent = `Incorrect! The correct answer is: "${correctAnswer}"`;
    feedbackElement.style.color = "red";
    wrongAnswers.push(chunks[currentQuestionIndex]);
  }

  submitAnswerButton.disabled = true;
  nextQuestionButton.disabled = false;
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= chunks.length) {
    gameOver();
  } else {
    displayQuestion();
    submitAnswerButton.disabled = false;
    nextQuestionButton.disabled = true;
  }
}

function gameOver() {
  questionElement.textContent = "Game Over!";
  optionsContainer.innerHTML = "";
  feedbackElement.textContent = `Final Score: ${score}`;
  feedbackElement.style.color = "blue";
  nextQuestionButton.style.display = "none";
  if (wrongAnswers.length > 0) {
    let wrongText = "Review these phrases:<br>";
    wrongAnswers.forEach((chunk) => {
      wrongText += `${chunk.english}: ${chunk.mandarin}<br>`;
    });
    feedbackElement.innerHTML += `<br>${wrongText}`;
  }
  //downloadJSON(wrongAnswers); // Download the wrong answers after game over
}

function downloadJSON(data, filename = "wrong_answers.json") {
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Add functionality to the back button
const backButton = document.getElementById("back-button");
backButton.addEventListener("click", () => {
  window.location.href = "../menu/menu.html"; // Go back to the main menu
});


submitAnswerButton.addEventListener("click", checkAnswer);
nextQuestionButton.addEventListener("click", nextQuestion);

// Initialize the first question
displayQuestion();
nextQuestionButton.disabled = true;
