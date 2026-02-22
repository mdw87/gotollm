// GoToLLM popup script
// Loads and saves the user's default LLM preference.

const select = document.getElementById("defaultLLM");
const savedMsg = document.getElementById("savedMsg");
let saveTimer = null;

// Load saved preference
chrome.storage.sync.get({ defaultLLM: "chatgpt" }, ({ defaultLLM }) => {
    select.value = defaultLLM;
});

// Save on change
select.addEventListener("change", () => {
    chrome.storage.sync.set({ defaultLLM: select.value });

    // Show "Saved ✓" flash
    savedMsg.classList.add("show");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => savedMsg.classList.remove("show"), 1500);
});
