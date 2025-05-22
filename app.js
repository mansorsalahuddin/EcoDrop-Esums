const currentUser = localStorage.getItem("loggedInUser");

if (!currentUser) {
  window.location.href = "login.html";
}

const coinDisplay = document.getElementById("coin-count");
const result = document.getElementById("scan-result");
const scanBtn = document.getElementById("scan-btn");
const redeemSection = document.getElementById("redeem-section");
const redeemBtn = document.getElementById("redeem-btn");
const readerDiv = document.getElementById("reader");

const recyclableItems = {
  "water-bottle": true,
  "cereal-box": true,
  "can": true,
  "milk-jug": true,
};

let userData = JSON.parse(localStorage.getItem("ecoUserData")) || {};

if (!userData[currentUser]) {
  userData[currentUser] = { coins: 0, scanned: {} };
}

function updateStorage() {
  localStorage.setItem("ecoUserData", JSON.stringify(userData));
}

function updateCoinDisplay() {
  const coins = userData[currentUser].coins;
  coinDisplay.textContent = coins;
  redeemSection.style.display = coins >= 100 ? "block" : "none";
  updateStorage();
}

// ✅ Scanner logic
let html5QrCode;

function startScanner() {
  readerDiv.style.display = "block";
  scanBtn.style.display = "none";

  if (html5QrCode) {
    html5QrCode.clear().catch(() => {});
  }

  html5QrCode = new Html5Qrcode("reader");

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      html5QrCode.stop().then(() => {
        readerDiv.style.display = "none";
        scanBtn.style.display = "inline-block";
        scanItem(decodedText);
      }).catch((err) => {
        result.innerHTML = `<span style="color:red;">Stop error: ${err}</span>`;
      });
    },
    (err) => {
      console.warn("Scanning error:", err);
    }
  ).catch((err) => {
    result.innerHTML = `<span style="color:red;">Camera start error: ${err}</span>`;
    readerDiv.style.display = "none";
    scanBtn.style.display = "inline-block";
  });
}

function scanItem(code) {
  const item = code.trim().toLowerCase();
  const scanned = userData[currentUser].scanned;

  if (!scanned[item]) {
    scanned[item] = true;
    if (recyclableItems[item]) {
      userData[currentUser].coins += 10;
      result.innerHTML = `<span style="color: green;">✅ First scan of "${item}". +10 coins!</span>`;
    } else {
      result.innerHTML = `<span style="color: orange;">⚠️ "${item}" is not recyclable. No coins.</span>`;
    }
  } else {
    if (recyclableItems[item]) {
      userData[currentUser].coins += 1;
      result.innerHTML = `<span style="color: green;">♻️ "${item}" is recyclable. +1 coin</span>`;
    } else {
      result.innerHTML = `<span style="color: red;">❌ Still not recyclable. No coins.</span>`;
    }
  }

  updateCoinDisplay();
}

scanBtn.addEventListener("click", startScanner);

if (redeemBtn) {
  redeemBtn.addEventListener("click", () => {
    if (userData[currentUser].coins >= 100) {
      userData[currentUser].coins -= 100;
      result.innerHTML = "<span style='color: blue;'>🎉 Dress Down Day redeemed!</span>";
      updateCoinDisplay();
    }
  });
}

updateCoinDisplay();
