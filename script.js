// Check if user is admin from URL
const urlParams = new URLSearchParams(window.location.search);
const isAdmin = urlParams.get("code") === "532579";

document.addEventListener("DOMContentLoaded", () => {
  const wordInput = document.getElementById("wordInput");
  const addWordBtn = document.getElementById("addWordBtn");
  const wordCanvas = document.getElementById("wordCanvas");

  // Add word or increment count
  addWordBtn.addEventListener("click", async () => {
    const word = wordInput.value.trim().toLowerCase();
    if (!word) return;

    const snapshot = await get(child(ref(db), `words/${word}`));
    const newCount = (snapshot.exists() ? snapshot.val() : 0) + 1;

    await set(ref(db, `words/${word}`), newCount);
    wordInput.value = "";
  });

  wordInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      const word = wordInput.value.trim().toLowerCase();
      if (!word) return;

      const snapshot = await get(child(ref(db), `words/${word}`));
      const newCount = (snapshot.exists() ? snapshot.val() : 0) + 1;

      await set(ref(db, `words/${word}`), newCount);
      wordInput.value = "";
    }
  });

  function renderCloud(words) {
    const entries = Object.entries(words).sort((a, b) => b[1] - a[1]);
    const list = entries.map(([word, count]) => [word, count]);

    WordCloud(wordCanvas, {
      list: list,
      gridSize: 8,
      weightFactor: 10,
      fontFamily: 'Arial',
      color: function () {
        const palette = ['#1E90FF', '#00BFFF', '#4682B4', '#5F9EA0', '#87CEFA'];
        return palette[Math.floor(Math.random() * palette.length)];
      },
      rotateRatio: 0.5,
      rotationSteps: 2,
      backgroundColor: '#f9f9f9'
    });
  }

  onValue(wordsRef, (snapshot) => {
    const words = snapshot.val() || {};
    renderCloud(words);
  });

  // Show reset button only if admin
  if (isAdmin) {
    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset Word Cloud";
    resetBtn.style.marginTop = "1rem";
    resetBtn.style.backgroundColor = "#ff4d4d";
    resetBtn.style.color = "#fff";
    resetBtn.style.border = "none";
    resetBtn.style.padding = "0.5rem 1rem";
    resetBtn.style.borderRadius = "8px";
    resetBtn.style.cursor = "pointer";

    resetBtn.addEventListener("click", async () => {
      const confirmReset = confirm("Are you sure you want to reset the word cloud?");
      if (confirmReset) {
        await set(wordsRef, {}); // Clear all words
      }
    });

    document.querySelector(".container").appendChild(resetBtn);
  }
});
