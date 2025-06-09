import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  get,
  child
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA7xyZ6pBpWPrTrzBWdR5M9POW_BODhqEQ",
  authDomain: "wordcloud-686da.firebaseapp.com",
  databaseURL: "https://wordcloud-686da-default-rtdb.firebaseio.com",
  projectId: "wordcloud-686da",
  storageBucket: "wordcloud-686da.appspot.com",
  messagingSenderId: "875887427422",
  appId: "1:875887427422:web:0afa9ee3e7a3815be619cf",
  measurementId: "G-KWF8CYKSBH"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const wordsRef = ref(db, 'words');

document.addEventListener("DOMContentLoaded", () => {
  const wordInput = document.getElementById("wordInput");
  const addWordBtn = document.getElementById("addWordBtn");
  const wordCanvas = document.getElementById("wordCanvas");

  // Add word function
  async function addWord() {
    const word = wordInput.value.trim().toLowerCase();
    if (!word) return;

    const snapshot = await get(child(ref(db), `words/${word}`));
    const newCount = (snapshot.exists() ? snapshot.val() : 0) + 1;

    await set(ref(db, `words/${word}`), newCount);
    wordInput.value = "";
  }

  addWordBtn.addEventListener("click", addWord);
  wordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addWord();
  });

  // Render cloud
  function renderCloud(words) {
    const entries = Object.entries(words).sort((a, b) => b[1] - a[1]);
    const list = entries.map(([word, count]) => [word, count]);

    WordCloud(wordCanvas, {
      list: list,
      gridSize: 8,
      weightFactor: 10,
      fontFamily: 'Arial',
      color: () => {
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

  // ✅ Password-protected reset button
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
    const password = prompt("Enter admin password to reset:");
    if (password === "banana42") {
      const confirmReset = confirm("Are you sure you want to reset the word cloud?");
      if (confirmReset) {
        await set(wordsRef, {});
        alert("Word cloud has been reset.");
      }
    } else {
      alert("Incorrect password. Reset canceled.");
    }
  });

  const container = document.querySelector(".container");
  if (container) {
    container.appendChild(resetBtn);
  } else {
    console.warn("Reset button failed: .container not found.");
  }
});
