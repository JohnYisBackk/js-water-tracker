"use strict";

// ======================================================
// SELECT ELEMENTS
// ======================================================

const waterFill = document.getElementById("waterFill");
const progressText = document.getElementById("progressText");
const currentAmount = document.getElementById("currentAmount");
const goalText = document.getElementById("goalText");

const goalInput = document.getElementById("goalInput");
const customInput = document.getElementById("customInput");

const waterBtns = document.querySelectorAll(".water-btn");
const addCustomBtn = document.getElementById("addCustomBtn");
const resetBtn = document.getElementById("resetBtn");

const entryCount = document.getElementById("entryCount");
const historyList = document.getElementById("historyList");

// ======================================================
// WATER STATE
// ======================================================

let currentWater = 0;

let dailyGoal = 2500;

let history = [];

// ======================================================
// STORAGE SYSTEM
// ======================================================

function saveWaterData() {
  const data = {
    currentWater: currentWater,
    dailyGoal: dailyGoal,
    history: history,
  };

  localStorage.setItem("waterTracker", JSON.stringify(data));
}

function loadWaterData() {
  const storedData = localStorage.getItem("waterTracker");

  if (!storedData) return;

  const data = JSON.parse(storedData);

  currentWater = data.currentWater;
  dailyGoal = data.dailyGoal;
  history = data.history;

  goalInput.value = dailyGoal;
}

// ======================================================
// WATER ACTIONS
// ======================================================

function addWater(amount) {
  currentWater += amount;

  if (currentWater > dailyGoal) {
    currentWater = dailyGoal;
  }

  const entry = {
    id: Date.now(),
    amount: amount,
    time: new Date().toLocaleTimeString(),
  };

  history.unshift(entry);

  saveWaterData();
  renderWater();
  renderHistory();
}

function deleteEntry(id) {
  const entry = history.find((item) => {
    return item.id === id;
  });

  if (!entry) return;

  currentWater -= entry.amount;

  if (currentWater < 0) {
    currentWater = 0;
  }

  history = history.filter((item) => {
    return item.id !== id;
  });

  saveWaterData();
  renderWater();
  renderHistory();
}

function resetDay() {
  currentWater = 0;

  history = [];

  saveWaterData();
  renderWater();
  renderHistory();
}

function updateGoal() {
  dailyGoal = Number(goalInput.value);

  if (dailyGoal <= 0) {
    dailyGoal = 2500;
    goalInput.value = dailyGoal;
  }

  if (currentWater > dailyGoal) {
    currentWater = dailyGoal;

    saveWaterData();
    renderWater();
  }
}

// ======================================================
// HELPERS
// ======================================================

function getProgress() {
  return Math.min(Math.round((currentWater / dailyGoal) * 100), 100);
}

// ======================================================
// UI RENDERING
// ======================================================

function renderWater() {
  const progress = getProgress();

  progressText.textContent = `${progress}%`;
  currentAmount.textContent = `${currentWater} ml`;
  goalText.textContent = `of ${dailyGoal} ml`;

  waterFill.style.height = `${progress}%`;
}

function renderHistory() {
  historyList.innerHTML = "";

  entryCount.textContent = `${history.length} entries`;

  if (history.length === 0) {
    historyList.innerHTML = `
      <div class="empty-history">
        No water entries yet.
      </div>
    `;

    return;
  }

  history.forEach((entry) => {
    historyList.innerHTML += `
      <div class="history-item">
        <div>
          <strong>+${entry.amount} ml</strong>
          <span>${entry.time}</span>
        </div>

        <button class="delete-entry" data-id="${entry.id}">
          ×
        </button>
      </div>
    `;
  });
}

// ======================================================
// EVENT LISTENERS
// ======================================================

waterBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const amount = Number(button.dataset.amount);

    addWater(amount);
  });
});

addCustomBtn.addEventListener("click", () => {
  const amount = Number(customInput.value);

  if (isNaN(amount) || amount <= 0) return;

  addWater(amount);

  customInput.value = "";
});

goalInput.addEventListener("change", updateGoal);

resetBtn.addEventListener("click", resetDay);

historyList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-entry")) {
    const id = Number(e.target.dataset.id);

    deleteEntry(id);
  }
});

// ======================================================
// INITIAL LOAD
// ======================================================

loadWaterData();
renderWater();
renderHistory();
