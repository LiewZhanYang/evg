const chunks = [
  { english: "budding poets", mandarin: "\u65b0\u5174\u8bd7\u4eba" },
  { english: "adjudge", mandarin: "\u5224\u5b9a" },
  { english: "adjourned", mandarin: "\u4f11\u4f1a" },
  { english: "impart", mandarin: "\u4f20\u6388" },
  { english: "rival", mandarin: "\u7ade\u4e89\u5bf9\u624b" },
  { english: "synonymous", mandarin: "\u540c\u4e49\u7684" },
  { english: "pampering", mandarin: "\u6de1\u7231" },
  { english: "instill", mandarin: "\u704c\u6ce8" },
  { english: "cultivate", mandarin: "\u57f9\u517b" },
  { english: "counteract", mandarin: "\u62b5\u6d88" },
  { english: "stalagmites", mandarin: "\u77f3\u7b1e" },
  { english: "pillars", mandarin: "\u67f1\u5b50" },
  { english: "white water rafting", mandarin: "\u6fc0\u6d41\u6f02\u6d41" },
  { english: "abseiling", mandarin: "\u7ef3\u964d" },
];

let currentQuestionIndex = 0;
let score = 0;
let wrongAnswers = [];

const questionElement = document.getElementById("question");
const answerInput = document.getElementById("answer-input");
const feedbackElement = document.getElementById("feedback");
const submitAnswerButton = document.getElementById("submit-answer");
const nextQuestionButton = document.getElementById("next-question");
const scoreElement = document.getElementById("score");
const summaryContainer = document.getElementById("summary-container");
const finalScoreElement = document.getElementById("final-score");
const wrongQuestionsContainer = document.getElementById(
  "wrong-questions-container"
);
const retryButton = document.getElementById("retry-wrong");

// Add functionality to the back button
const backButton = document.getElementById("back-button");
backButton.addEventListener("click", () => {
  window.location.href = "../menu/menu.html"; // Go back to the main menu
});

let wrongQuestions = [];
let retryMode = false;

function displayQuestion() {
  const currentChunk = chunks[currentQuestionIndex];
  questionElement.textContent = `What is the English word for: "${currentChunk.mandarin}"?`;

  // Create letter input boxes again
  generateWordHint(currentChunk.english);

  feedbackElement.textContent = "";
  scoreElement.textContent = `Score: ${score}`;

  // Reset tips and buttons
  tipButton.disabled = false; // Enable tip for new question
  submitAnswerButton.disabled = false;
  nextQuestionButton.disabled = false;
}

function checkAnswer() {
  const inputs = document.querySelectorAll(".letter-input");
  let userAnswer = Array.from(inputs)
    .map((input) => input.value.trim().toLowerCase())
    .join("");

  const correctAnswer = chunks[currentQuestionIndex].english
    .toLowerCase()
    .replace(/\s+/g, "");

  if (userAnswer === correctAnswer) {
    feedbackElement.textContent = "✅ Correct!";
    feedbackElement.style.color = "green";
    score++;
  } else {
    feedbackElement.textContent = `❌ Incorrect! The correct answer is: "${chunks[currentQuestionIndex].english}"`;
    feedbackElement.style.color = "red";
    wrongAnswers.push(chunks[currentQuestionIndex]);
  }

  submitAnswerButton.disabled = true;
  nextQuestionButton.disabled = false;
}

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex >= chunks.length) {
    // Check if retry mode is active and go back to summary if done
    if (retryMode) {
      retryMode = false; // End retry mode after retrying wrong questions
      gameOver(); // Show summary again after retry
    } else {
      gameOver(); // Original game over for normal play
    }
  } else {
    displayQuestion();
    submitAnswerButton.disabled = false;
    nextQuestionButton.disabled = true; // Disable next button until submission
    tipButton.disabled = false; // Reset tip for retry mode
  }
}

function gameOver() {
  questionElement.style.display = "none";
  document.getElementById("word-hint").style.display = "none";
  submitAnswerButton.style.display = "none";
  nextQuestionButton.style.display = "none";
  tipButton.style.display = "none";

  // Show the summary container
  summaryContainer.style.display = "block";
  finalScoreElement.textContent = `🎉 Final Score: ${score} / ${chunks.length}`;

  // Show list of wrong answers
  if (wrongAnswers.length > 0) {
    let wrongList = "<h3>❌ Wrong Answers:</h3><ul>";
    wrongAnswers.forEach((chunk) => {
      wrongList += `<li><strong>${chunk.mandarin}</strong> → Correct: <em>${chunk.english}</em></li>`;
    });
    wrongList += "</ul>";
    wrongQuestionsContainer.innerHTML = wrongList;
    retryButton.style.display = "inline-block"; // Show retry button if wrong questions
  } else {
    wrongQuestionsContainer.innerHTML =
      "<p>✅ All questions answered correctly!</p>";
    retryButton.style.display = "none";
  }
}

function retryWrongQuestions() {
  // Reset game state for retry
  currentQuestionIndex = 0;
  score = 0;
  wrongAnswers = []; // Clear the wrong answers after retry
  retryMode = true;

  // Show the game container again and hide the summary
  summaryContainer.style.display = "none";
  questionElement.style.display = "block";
  document.getElementById("word-hint").style.display = "flex";
  submitAnswerButton.style.display = "inline-block";
  nextQuestionButton.style.display = "none"; // Hide until next question

  // Set chunks to only wrong answers for retry
  chunks.splice(0, chunks.length, ...wrongQuestions);
  wrongQuestions = [];

  // Display the first wrong question
  displayQuestion();
}

// Generate input boxes for the word length
function generateWordHint(word) {
  const hintContainer = document.getElementById("word-hint");
  hintContainer.innerHTML = "";

  for (let i = 0; i < word.length; i++) {
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.maxLength = 1;
    inputElement.classList.add("letter-input");
    inputElement.dataset.index = i; // Keep track of the position
    hintContainer.appendChild(inputElement);
  }

  // Automatically focus on the next input when typing
  const inputs = document.querySelectorAll(".letter-input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      if (e.target.value && index < word.length - 1) {
        inputs[index + 1].focus();
      }
    });
  });
}

// Show tip with the first 3 letters
function showTip() {
  const currentChunk = chunks[currentQuestionIndex];
  const correctAnswer = currentChunk.english;
  const tipLength = Math.min(3, correctAnswer.length);
  const tip = correctAnswer.substring(0, tipLength);

  // Fill the first 3 letters into the input boxes
  const inputs = document.querySelectorAll(".letter-input");
  for (let i = 0; i < tipLength; i++) {
    inputs[i].value = tip[i];
    inputs[i].disabled = true; // Lock the first 3 letters
  }

  // Disable the tips button after showing the tip
  document.getElementById("get-tips").disabled = true;
}

// Tip button event listener
const tipButton = document.getElementById("get-tips");
tipButton.addEventListener("click", showTip);

submitAnswerButton.addEventListener("click", checkAnswer);
nextQuestionButton.addEventListener("click", nextQuestion);

// Initialize the first question
displayQuestion();
nextQuestionButton.disabled = true;
