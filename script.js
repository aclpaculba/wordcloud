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
  const wordCloud = document.getElementById("wordCloud");

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
    wordCloud.innerHTML = "";
    const containerWidth = wordCloud.clientWidth;
    const containerHeight = wordCloud.clientHeight;

    Object.entries(words).forEach(([word, count]) => {
      const size = 14 + count * 5;
      const span = document.createElement("span");
      span.textContent = word;
      span.style.fontSize = `${size}px`;
      span.style.left = `${Math.random() * (containerWidth - 100)}px`;
      span.style.top = `${Math.random() * (containerHeight - 30)}px`;
      span.style.transform = `rotate(${Math.floor(Math.random() * 30 - 15)}deg)`;
      wordCloud.appendChild(span);
    });
  }

  onValue(wordsRef, (snapshot) => {
    const words = snapshot.val() || {};
    renderCloud(words);
  });

  window.addEventListener("resize", () => {
    const words = {};
    document.querySelectorAll("#wordCloud span").forEach((span) => {
      const text = span.textContent;
      const size = parseInt(span.style.fontSize);
      const count = Math.round((size - 14) / 5);
      words[text] = count;
    });
    renderCloud(words);
  });
});
