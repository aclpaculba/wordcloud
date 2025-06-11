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

const bannedWords = [
  "badword1", "badword2", "nastyword", "slur", "offensiveword"
];

document.addEventListener("DOMContentLoaded", () => {
  const wordInput = document.getElementById("wordInput");
  const addWordBtn = document.getElementById("addWordBtn");
  const resetBtn = document.getElementById("resetBtn");
  const wordCanvas = document.getElementById("wordCanvas");

  function fitCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const formHeight = document.querySelector(".input-group").offsetHeight;
    const containerPadding = 32;
    const availableHeight = window.innerHeight - formHeight - containerPadding - 100;

    wordCanvas.width = wordCanvas.clientWidth * dpr;
    wordCanvas.height = availableHeight * dpr;
    wordCanvas.style.height = `${availableHeight}px`;

    const ctx = wordCanvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", fitCanvas);
  fitCanvas();

  async function addWord() {
    const word = wordInput.value.trim().toLowerCase();
    if (!word) return;

    if (bannedWords.includes(word)) {
      alert("That word is not allowed.");
      wordInput.value = "";
      return;
    }

    const snapshot = await get(child(ref(db), `words/${word}`));
    const newCount = (snapshot.exists() ? snapshot.val() : 0) + 1;

    await set(ref(db, `words/${word}`), newCount);
    wordInput.value = "";
  }

  addWordBtn.addEventListener("click", addWord);
  wordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addWord();
  });

  resetBtn.addEventListener("click", async () => {
    await set(wordsRef, {});
    alert("Word cloud has been reset.");
  });

  function renderCloud(words) {
    const entries = Object.entries(words).sort((a, b) => b[1] - a[1]);
    const list = entries.map(([word, count]) => [word, count]);

    WordCloud(wordCanvas, {
      list: list,
      gridSize: 8,
      weightFactor: 15, // Larger font
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
});
