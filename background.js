// GoToLLM - background service worker
// Routes address-bar prompts to your chosen LLM.
// No data is collected. All routing happens locally in your browser.

const LLMS = {
  chatgpt: {
    name: "ChatGPT",
    url: (prompt) => `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
  },
  claude: {
    name: "Claude",
    url: (prompt) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
  },
  gemini: {
    name: "Gemini",
    // AI Studio supports ?prompt= natively; gemini.google.com does not
    url: (prompt) =>
      `https://aistudio.google.com/prompts/new_chat?prompt=${encodeURIComponent(prompt)}`,
  },
  perplexity: {
    name: "Perplexity",
    url: (prompt) =>
      `https://www.perplexity.ai/?q=${encodeURIComponent(prompt)}`,
  },
  grok: {
    name: "Grok",
    url: (prompt) => `https://grok.com/?q=${encodeURIComponent(prompt)}`,
  },
};

const DEFAULT_LLM = "chatgpt";

// Get the user's configured default LLM key
async function getDefaultLLM() {
  const result = await chrome.storage.sync.get({ defaultLLM: DEFAULT_LLM });
  return result.defaultLLM;
}

// Parse "claude: what is life?" → { llmKey: "claude", prompt: "what is life?" }
// If no prefix, llmKey is null (use default)
function parseInput(text) {
  const trimmed = text.trim();
  const colonIndex = trimmed.indexOf(":");
  if (colonIndex > 0) {
    const possibleKey = trimmed.slice(0, colonIndex).trim().toLowerCase();
    if (LLMS[possibleKey]) {
      return {
        llmKey: possibleKey,
        prompt: trimmed.slice(colonIndex + 1).trim(),
      };
    }
  }
  return { llmKey: null, prompt: trimmed };
}

// Build the destination URL for a given input
async function buildURL(text) {
  const { llmKey, prompt } = parseInput(text);
  const key = llmKey ?? (await getDefaultLLM());
  const llm = LLMS[key] ?? LLMS[DEFAULT_LLM];
  return llm.url(prompt);
}

// Navigate the current tab (or open a new one if needed)
function navigate(url, disposition) {
  if (disposition === "newForegroundTab") {
    chrome.tabs.create({ url });
  } else if (disposition === "newBackgroundTab") {
    chrome.tabs.create({ url, active: false });
  } else {
    // currentTab
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab) {
        chrome.tabs.update(tab.id, { url });
      } else {
        chrome.tabs.create({ url });
      }
    });
  }
}

// Show a hint as the user types
chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  if (text.trim().toLowerCase() === "settings") {
    chrome.omnibox.setDefaultSuggestion({ description: "Open GoToLLM settings to change your default LLM" });
    return;
  }

  const { llmKey, prompt } = parseInput(text);
  const resolvedKey = llmKey ?? (await getDefaultLLM());
  const llm = LLMS[resolvedKey] ?? LLMS[DEFAULT_LLM];

  const hint = prompt
    ? `Send to ${llm.name}: "${prompt}"`
    : `Type your prompt — goes to ${llm.name} by default. Or prefix with claude:, chatgpt:, gemini:, perplexity:, grok:`;

  chrome.omnibox.setDefaultSuggestion({ description: hint });
});

// Navigate when the user presses Enter
chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  if (!text.trim()) return;

  // "settings" opens the extension settings page
  if (text.trim().toLowerCase() === "settings") {
    chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
    return;
  }

  const url = await buildURL(text);
  navigate(url, disposition);
});
