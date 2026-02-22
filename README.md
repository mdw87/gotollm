# GoToLLM

> Prompt any LLM instantly from the Chrome address bar.

## How It Works

1. Type **`ai`** in the address bar
2. Press **`Tab`**
3. Type your prompt and hit **`Enter`**

You land directly at your chosen AI with the prompt ready to go.

## Supported LLMs

| LLM | Override prefix |
|---|---|
| ChatGPT | `chatgpt:` |
| Claude | `claude:` |
| Gemini | `gemini:` |
| Perplexity | `perplexity:` |
| Grok | `grok:` |

## Default LLM

Click the extension icon to open settings and choose your default LLM. Prompts without a prefix go there automatically.

## Prefix Override

To send a prompt to a specific LLM regardless of your default, prefix with its name:

```
ai [Tab] claude: what is the meaning of life?
ai [Tab] chatgpt: write me a poem
ai [Tab] perplexity: latest AI news
```

## Installation

1. Clone or download this repo
2. Open Chrome → `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** → select this folder
5. The extension is ready — type `ai` in the address bar and press `Tab`

## Privacy

This extension does **not** collect any data. All routing happens locally in your browser. The only network request made is the navigation to the LLM's website with your prompt in the URL. The source code is intentionally kept minimal and readable so you can verify this yourself.

## Files

```
GoToLLM/
├── manifest.json    # Extension config (MV3)
├── background.js    # Omnibox routing logic (~60 lines)
├── popup.html       # Settings UI
├── popup.css        # Styles
├── popup.js         # Settings persistence
└── icons/           # Extension icons
```
