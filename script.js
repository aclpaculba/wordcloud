// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase, ref, onValue, set, get, child } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

// Firebase config (yours)
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

// DOM elements
const wordInput = document.getElementById("wordInput");
const addWordBtn = document.getElementById("addWordBtn");
const wordCloud = document.getElementById("wordCloud");

// Add new word or increment
addWordBtn.addEventListener("click", async () => {
  const word = wordInput.value.trim().toLowerCase();
  if (!word) return;

  const snapshot = await get(child(ref(db), `words/${word}`));
  const newCount = (snapshot.exists() ? snapshot.val() : 0) + 1;

  await set(ref(db, `words/${word}`), newCount);
  wordInput.value = "";
});

// Render cloud on DB change
onValue(wordsRef, (snapshot) => {
  const words = snapshot.val() || {};
  renderCloud(words);
});

function renderCloud(words) {
  wordCloud.innerHTML = "";

  const sortedWords = Object.entries(words).sort((a, b) => b[1] - a[1]);

  for (const [word, count] of sortedWords) {
    const span = document.createElement("span");
    span.className = "word";
    span.style.fontSize = `${1 + count * 0.3}rem`;
    span.textContent = word;
    wordCloud.appendChild(span);
  }
}
