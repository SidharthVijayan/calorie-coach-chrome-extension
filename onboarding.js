document.getElementById("startBtn").addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const weight = parseFloat(document.getElementById("weight").value);
  const goal = document.getElementById("goal").value;
  const activity = document.getElementById("activity").value;

  // VALIDATION
  if (!username) {
    alert("Enter a username");
    return;
  }

  if (!weight || weight <= 0) {
    alert("Enter a valid weight");
    return;
  }

  // SAVE DATA
  chrome.storage.local.set({
    username: username,
    userProfile: {
      weight,
      goal,
      activity
    },
    total: 0,
    xp: 0,
    streak: 0,
    history: []
  }, () => {
    // REDIRECT TO MAIN APP
    window.location.href = "popup.html";
  });
});
