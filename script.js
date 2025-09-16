const input = document.getElementById("word-input");
const resetBtn = document.getElementById("reset-btn");
const wordList = document.getElementById("word-list");
const canvas = document.getElementById("word-cloud");

let wordsMap = {};

// Fix canvas for high-DPI displays
function resizeCanvasForHDPI(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// Sort by frequency descending and update sidebar
function updateWordList() {
  wordList.innerHTML = "";
  const sortedEntries = Object.entries(wordsMap).sort((a, b) => b[1] - a[1]);
  for (const [word, count] of sortedEntries) {
    const li = document.createElement("li");
    li.textContent = `${word} (${count})`;
    wordList.appendChild(li);
  }
}

function getWordCloudList() {
  return Object.entries(wordsMap).map(([word, count]) => [word, count]);
}

function drawCloud() {
  resizeCanvasForHDPI(canvas);
  WordCloud(canvas, {
    list: getWordCloudList(),
    gridSize: 8,
    weightFactor: function (size) {
      return 10 + size * 5;
    },
    rotateRatio: 0.5,
    rotationSteps: 2,
    backgroundColor: "#ffffff",
    color: function () {
      const hue = Math.floor(Math.random() * 360);
      const saturation = 60 + Math.random() * 40;
      const lightness = 40 + Math.random() * 20;
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    },
    fontFamily: "Arial, sans-serif"
  });
}



input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const word = input.value.trim().toLowerCase();
    if (word) {
      wordsMap[word] = (wordsMap[word] || 0) + 1;
      updateWordList();
      drawCloud();
    }
    input.value = "";
  }
});

resetBtn.addEventListener("click", function () {
  wordsMap = {};
  wordList.innerHTML = "";
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
