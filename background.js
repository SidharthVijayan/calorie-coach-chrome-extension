chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.set({ total: 0 });
});
