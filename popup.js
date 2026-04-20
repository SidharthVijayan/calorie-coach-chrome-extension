const clickSound = new Audio("sounds/click.mp3");
const levelUpSound = new Audio("sounds/levelup.mp3");

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

function funnyResponse(total, target) {
  if (total > target + 500) return "🐷 That escalated quickly.";
  if (total > target) return "😅 Careful...";
  if (total < target - 300) return "🔥 Fat melting!";
  return "🧘 Perfect.";
}

document.getElementById("logBtn").addEventListener("click", () => {

  clickSound.play();

  const input = document.getElementById("foodInput").value;
  const calories = parseInput(input);

  chrome.storage.local.get(["total","userProfile","xp"], (data)=>{

    let total = (data.total||0) + calories;
    let oldXP = data.xp || 0;

    const tdee = calculateTDEE(data.userProfile.weight,data.userProfile.activity);
    const target = adjustForGoal(tdee,data.userProfile.goal);

    chrome.storage.local.set({total});
    updateXP(total,target);

    chrome.storage.local.get(["xp"],(d)=>{

      if(Math.floor(d.xp/100) > Math.floor(oldXP/100)){
        levelUpSound.play();
        document.querySelector(".level-box").classList.add("level-up");
        setTimeout(()=>document.querySelector(".level-box").classList.remove("level-up"),600);
      }

      document.getElementById("gameResponse").innerText =
        `+${calories} kcal\n${funnyResponse(total,target)}`;

      document.getElementById("totalCalories").innerText =
        `${total} kcal`;

      renderLevel();
    });
  });
});

function renderLevel(){
  chrome.storage.local.get(["xp"],(data)=>{
    const xp = data.xp||0;
    const lvl = Math.floor(xp/100);
    document.getElementById("levelTitle").innerText = ["🍔 Rookie","🔥 Burner","💪 Beast","🏆 Legend"][lvl] || "👑 God";
    document.getElementById("levelNumber").innerText = `Level ${lvl+1}`;
    document.getElementById("xpText").innerText = `${xp%100}/100 XP`;
    document.getElementById("xpFill").style.width = `${xp%100}%`;
  });
}
renderLevel();
