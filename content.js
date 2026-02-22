// GoToLLM - content script
// Runs on LLM pages when a ?q= prompt is in the URL.
// Waits for the send button to become available, then clicks it once.
// No data is collected or transmitted — this script only reads the URL
// and interacts with the page's own UI.

(function () {
    const url = new URL(window.location.href);

    // Support both ?q= (ChatGPT, Claude, Perplexity, Grok)
    // and ?prompt= (AI Studio / Gemini)
    const prompt = url.searchParams.get("q") || url.searchParams.get("prompt");

    // Only activate when we arrived here with a prompt in the URL
    if (!prompt) return;

    const host = window.location.hostname;

    // Per-LLM send button selectors, ordered from most to least specific.
    const SELECTORS = {
        "chatgpt.com": [
            'button[data-testid="send-button"]',
            'button[aria-label="Send prompt"]',
            'button[aria-label="Send message"]',
            'form button[type="submit"]',
        ],
        "claude.ai": [
            'button[aria-label="Send Message"]',
            'button[aria-label="Send message"]',
            '[data-testid="send-button"]',
            'fieldset button[type="submit"]',
        ],
        "aistudio.google.com": [
            'button[aria-label="Run"]',
            'button[mattooltip="Run"]',
            'run-button button',
            'button[type="submit"]',
        ],
        "www.perplexity.ai": [
            'button[aria-label="Submit"]',
            'button[type="submit"]',
        ],
        "grok.com": [
            'button[aria-label="Send message"]',
            'button[type="submit"]',
        ],
    };

    const selectors = SELECTORS[host] ?? ['button[aria-label="Send message"]', 'button[type="submit"]'];

    let clicked = false;

    function tryClick() {
        if (clicked) return;
        for (const sel of selectors) {
            const btn = document.querySelector(sel);
            if (btn && !btn.disabled) {
                btn.click();
                clicked = true;
                observer.disconnect();
                return;
            }
        }
    }

    // Watch for DOM changes (LLMs are SPAs that render asynchronously)
    const observer = new MutationObserver(tryClick);
    observer.observe(document.body, { childList: true, subtree: true });

    // Also try immediately and after short delays in case the button
    // is already present when the script runs
    tryClick();
    setTimeout(tryClick, 500);
    setTimeout(tryClick, 1500);

    // Safety timeout: stop watching after 10 s to avoid lingering observers
    setTimeout(() => observer.disconnect(), 10_000);
})();
