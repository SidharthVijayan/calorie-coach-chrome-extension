// 🔊 Sounds
const clickSound = new Audio("sounds/click.mp3");
const levelUpSound = new Audio("sounds/levelup.mp3");

// 🔐 LOGIN
document.getElementById("loginBtn").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then(result => {
      const user = result.user;

      chrome.storage.local.set({
        userId: user.uid,
        username: user.displayName
      });

      document.getElementById("userBox").innerText =
        `👤 ${user.displayName}`;
    })
    .catch(err => console.error(err));
});

// 🍽️ FOOD PARSER
function parseInput(text) {
  text = text.toLowerCase();
  let total = 0;

  for (let food in FOOD_DB) {
    if (text.includes(food)) {
      let qty = 1;
      let match = text.match(new RegExp(`(\\d+)\\s*${food}`));
      if (match) qty = parseInt(match[1]);

      total += FOOD_DB[food] * qty;
    }
  }

  return total;
}

// 🤖 RESPONSE
function funnyResponse(total, target) {
  if (total > target + 500) return "🐷 That escalated quickly.";
  if (total > target) return "😅 Careful...";
  if (total < target - 300) return "🔥 Fat melting!";
  return "🧘 Perfect.";
}

// ☁️ SYNC TO FIREBASE
function syncUser(userId, total, xp) {
  db.collection("users").doc(userId).set({
    totalCalories: total,
    xp: xp,
    updatedAt: Date.now()
  });
}

// 🏆 LEADERBOARD
function loadLeaderboard() {
  db.collection("users")
    .orderBy("xp", "desc")
    .limit(5)
    .get()
    .then(snapshot => {
      let text = "🏆 Leaderboard\n";

      snapshot.forEach(doc => {
        const d = doc.data();
        text += `${d.xp} XP\n`;
      });

      document.getElementById("coachStatus").innerText = text;
    });
}

// 🎮 MAIN ACTION
document.getElementById("logBtn").addEventListener("click", () => {

  clickSound.play();

  const input = document.getElementById("foodInput").value;
  const calories = parseInput(input);

  chrome.storage.local.get(["total", "userProfile", "xp", "userId"], (data) => {

    let total = (data.total || 0) + calories;
    let xp = data.xp || 0;

    const tdee = calculateTDEE(data.userProfile.weight, data.userProfile.activity);
    const target = adjustForGoal(tdee, data.userProfile.goal);

    // XP logic
    let oldLevel = Math.floor(xp / 100);

    if (total <= target) xp += 20;
    else xp -= 10;

    if (xp < 0) xp = 0;

    let newLevel = Math.floor(xp / 100);

    chrome.storage.local.set({ total, xp });

    // 🎉 LEVEL UP
    if (newLevel > oldLevel) {
      levelUpSound.play();

      document.querySelector(".level-box").classList.add("level-up");

      setTimeout(() => {
        document.querySelector(".level-box").classList.remove("level-up");
      }, 600);
    }

    // UI
    document.getElementById("gameResponse").innerText =
      `+${calories} kcal\n${funnyResponse(total, target)}`;

    document.getElementById("totalCalories").innerText =
      `${total} kcal`;

    renderLevel();

    // ☁️ SYNC
    if (data.userId) {
      syncUser(data.userId, total, xp);
      loadLeaderboard();
    }

  });
});

// 🎯 LEVEL UI
function renderLevel() {
  chrome.storage.local.get(["xp"], (data) => {
    const xp = data.xp || 0;
    const level = Math.floor(xp / 100);

    const titles = [
      "🍔 Rookie",
      "🔥 Burner",
      "💪 Beast",
      "🏆 Legend"
    ];

    document.getElementById("levelTitle").innerText =
      titles[level] || "👑 God";

    document.getElementById("levelNumber").innerText =
      `Level ${level + 1}`;

    document.getElementById("xpText").innerText =
      `${xp % 100}/100 XP`;

    document.getElementById("xpFill").style.width =
      `${xp % 100}%`;
  });
}

// INIT
renderLevel();
loadLeaderboard();
