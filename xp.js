function updateXP(consumed, target) {
  chrome.storage.local.get(["xp"], (data) => {
    let xp = data.xp || 0;

    if (consumed <= target) xp += 20;
    else xp -= 10;

    if (xp < 0) xp = 0;

    chrome.storage.local.set({ xp });
  });
}
