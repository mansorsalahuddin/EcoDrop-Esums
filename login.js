function scanItem(code) {
  const item = code.trim().toLowerCase();
  const scannedItems = JSON.parse(localStorage.getItem("scannedItems")) || {};

  if (!scannedItems[item]) {
    // First time scanned
    scannedItems[item] = true;
    localStorage.setItem("scannedItems", JSON.stringify(scannedItems));

    if (recyclableItems[item]) {
      coins += 10;
      result.innerHTML = `<span style="color: green;">✅ "${item}" is recyclable! +10 coins (first scan)</span>`;
    } else {
      result.innerHTML = `<span style="color: orange;">⚠️ First scan of "${item}", but it's not recyclable. No coins.</span>`;
    }
  } else {
    // Already scanned before
    if (recyclableItems[item]) {
      coins += 1;
      result.innerHTML = `<span style="color: green;">♻️ "${item}" is recyclable! +1 coin</span>`;
    } else {
      result.innerHTML = `<span style="color: red;">❌ "${item}" is not recyclable. No coins.</span>`;
    }
  }

  updateCoinDisplay();
}
