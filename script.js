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
    const containerPadding = 16; // tighter padding
    const availableHeight = window.innerHeight - formHeight - containerPadding -
