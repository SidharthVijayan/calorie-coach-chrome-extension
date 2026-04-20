// 🔐 GOOGLE LOGIN (WORKING VERSION)
document.getElementById("loginBtn").addEventListener("click", () => {

  console.log("Login clicked");

  chrome.identity.getAuthToken({ interactive: true }, function(token) {

    if (chrome.runtime.lastError) {
      console.error("Auth Error:", chrome.runtime.lastError);
      alert("Login failed: " + chrome.runtime.lastError.message);
      return;
    }

    console.log("Token:", token);

    fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(user => {

      chrome.storage.local.set({
        userId: user.id,
        username: user.name,
        email: user.email
      });

      document.getElementById("userBox").innerText =
        `👤 ${user.name}`;

      alert("Login successful");

    })
    .catch(err => {
      console.error(err);
      alert("Failed to fetch user");
    });

  });

});


// 🍽️ EXISTING LOGIC (UNCHANGED)
document.getElementById("logBtn").addEventListener("click", () => {

  const input = document.getElementById("foodInput").value;
  const calories = parseInput(input);

  chrome.storage.local.get(["total", "userProfile", "xp"], (data) => {

    let total = (data.total || 0) + calories;
    let xp = data.xp || 0;

    const tdee = calculateTDEE(data.userProfile.weight, data.userProfile.activity);
    const target = adjustForGoal(tdee, data.userProfile.goal);

    if (total <= target) xp += 20;
    else xp -= 10;

    if (xp < 0) xp = 0;

    chrome.storage.local.set({ total, xp });

    document.getElementById("gameResponse").innerText =
      `+${calories} kcal`;

    document.getElementById("totalCalories").innerText =
      `${total} kcal`;

    renderLevel();

  });

});

function renderLevel() {
  chrome.storage.local.get(["xp"], (data) => {

    const xp = data.xp || 0;
    const level = Math.floor(xp / 100);

    const titles = ["🍔 Rookie", "🔥 Burner", "💪 Beast", "🏆 Legend"];

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

renderLevel();
