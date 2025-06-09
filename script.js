// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase, ref, onValue, set, get, child } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const wordsRef = ref(db, 'words');

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

  // Enable Enter key submission
  wordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addWordBtn.click();
    }
  });

  // Render using WordCloud2.js
  function renderCloud(words) {
    const entries = Object.entries(words).sort((a, b) => b[1] - a[1]);
    const list = entries.map(([word, count]) => [word, count]);

    WordCloud(wordCanvas, {
      list: list,
      gridSize: 8,
      weightFactor: 10,
      fontFamily: 'Arial',
      color: function () {
        // Example palette of blue shades
        const palette = ['#1E90FF', '#00BFFF', '#4682B4', '#5F9EA0', '#87CEFA'];
        return palette[Math.floor(Math.random() * palette.length)];
      },
      rotateRatio: 0.5,
      rotationSteps: 2,
      backgroundColor: '#f9f9f9'
    });
  }

  // Listen for DB changes
  onValue(wordsRef, (snapshot) => {
    const words = snapshot.val() || {};
    renderCloud(words);
  });
});
