const chunks = [
  { english: "took a cake", mandarin: "成为最杰出或最愚笨的人" },
  { english: "obsession", mandarin: "痴迷" },
  { english: "overwhelming", mandarin: "压制" },
  { english: "outdo", mandarin: "超越" },
  { english: "carefree", mandarin: "无忧无虑" },
  { english: "furtive", mandarin: "鬼鬼祟祟" },
  { english: "tense", mandarin: "紧张" },
  { english: "keyed up", mandarin: "紧张" },
  { english: "irritable", mandarin: "烦躁的" },
  { english: "irrespective", mandarin: "不顾一切" },
  { english: "wisdom", mandarin: "智慧" },
  { english: "joint", mandarin: "联合" },
  { english: "trail", mandarin: "踪迹" },
  { english: "nostalgia", mandarin: "怀旧之情" },
  { english: "blind man buff", mandarin: "盲抓游戏" },
  { english: "rankled", mandarin: "生气的" },
  { english: "pleaded", mandarin: "恳求" },
  { english: "appease", mandarin: "安抚" },
  { english: "blindfolded", mandarin: "蒙住眼睛" },
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

// Retry button event listener
retryButton.addEventListener("click", retryWrongQuestions);

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

    // Add only if not already in wrongAnswers
    if (
      !wrongAnswers.some(
        (item) => item.mandarin === chunks[currentQuestionIndex].mandarin
      )
    ) {
      wrongAnswers.push(chunks[currentQuestionIndex]);
    }
  }

  submitAnswerButton.disabled = true;
  nextQuestionButton.disabled = false;
  nextQuestionButton.style.display = "inline-block";
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
  // Check if there are wrong questions to retry
  if (wrongAnswers.length === 0) {
    alert("✅ No wrong questions to retry! Returning to menu.");
    window.location.href = "../menu/menu.html";
    return;
  }

  // Prepare wrong questions to retry
  currentQuestionIndex = 0;
  score = 0;
  retryMode = true;

  // Make a copy of wrongAnswers and replace chunks for retry
  const wrongChunkCopy = [...wrongAnswers]; // Create a copy to avoid reference issues
  chunks.length = 0; // Clear existing chunks
  chunks.push(...wrongChunkCopy); // Load wrong answers into chunks
  wrongAnswers = []; // Clear wrong answers after retrying

  // Hide the summary and show game screen again
  summaryContainer.style.display = "none";
  questionElement.style.display = "block";
  document.getElementById("word-hint").style.display = "flex";
  submitAnswerButton.style.display = "inline-block";
  nextQuestionButton.style.display = "none"; // Hide until next question
  tipButton.style.display = "inline-block";

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
