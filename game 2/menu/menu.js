// Add event listeners to the buttons
const mode1Button = document.getElementById("mode1");
const mode2Button = document.getElementById("mode2");



mode1Button.addEventListener("click", () => {
  window.location.href = "../mode1/mode1.html"; // Correct path for Mode 1
});

mode2Button.addEventListener("click", () => {
  window.location.href = "../mode2/game2.html"; // Correct path for Mode 2
});
