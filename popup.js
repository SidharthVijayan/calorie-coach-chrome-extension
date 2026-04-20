// INPUT PARSER
function parseInput(text) {
  text = text.toLowerCase();
  let total = 0;

  for (let food in FOOD_DB) {
    if (text.includes(food)) {
      let calories = FOOD_DB[food];

      let match = text.match(new RegExp(`(\\d+)\\s*${food}`));
      let qty = match ? parseInt(match[1]) : 1;

      total += calories * qty;
    }
  }

  return total;
}

// FUN RESPONSES
function funnyResponse(consumed, target) {
  if (consumed > target + 500) return "🐷 That escalated quickly.";
  if (consumed > target) return "😅 Careful… you're crossing the line.";
  if (consumed < target - 300) return "🔥 Fat is melting!";
  return "🧘 Perfect balance.";
}

// LOAD USER
function loadUser() {
  chrome.storage.local.get(["userProfile", "username"], (data) => {
    if (!data.userProfile) {
      window.location.href = "onboarding.html";
      return;
    }

    document.getElementById("userBox").innerText =
      `👤 ${data.username}`;
  });
}

// MAIN LOGIC
document.getElementById("logBtn").addEventListener("click", () => {
  const input = document.getElementById("foodInput").value;

  const calories = parseInput(input);

  chrome.storage.local.get(["total", "userProfile"], (data) => {
    let total = (data.total || 0) + calories;

    const { weight, goal, activity } = data.userProfile;

    const tdee = calculateTDEE(weight, activity);
    const target = adjustForGoal(tdee, goal);

    chrome.storage.local.set({ total });

    updateXP(total, target);

    document.getElementById("gameResponse").innerText =
      `+${calories} kcal\n${funnyResponse(total, target)}`;

    document.getElementById("totalCalories").innerText =
      `Total: ${total} kcal`;

    renderLevel();
    renderMissions(total, target);
  });
});

// LOAD LEVEL
function renderLevel() {
  chrome.storage.local.get(["xp"], (data) => {
    const xp = data.xp || 0;
    const level = Math.floor(xp / 100);
    const currentXP = xp % 100;

    const LEVELS = [
      "🍔 Rookie",
      "🥗 Conscious",
      "🔥 Fat Burner",
      "💪 Master",
      "⚡ Beast",
      "🧠 Ninja",
      "🏆 Legend"
    ];

    document.getElementById("levelTitle").innerText =
      LEVELS[level] || "👑 God";

    document.getElementById("levelNumber").innerText =
      `Level ${level + 1}`;

    document.getElementById("xpText").innerText =
      `${currentXP}/100 XP`;

    document.getElementById("xpFill").style.width =
      `${currentXP}%`;
  });
}

// MISSIONS
function renderMissions(total, target) {
  const div = document.getElementById("missions");

  let mission = total <= target
    ? "✅ Stay under calories"
    : "❌ Over target — recover tomorrow";

  div.innerText = `🎯 Mission: ${mission}`;
}

// INIT
loadUser();
renderLevel();
