#!/bin/bash
# GoToLLM - publish helper
# Packages the extension and reminds you what to do next.

set -e

EXTENSION_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PARENT_DIR="$(dirname "$EXTENSION_DIR")"
ZIP_PATH="$PARENT_DIR/GoToLLM.zip"

echo "📦 Packaging GoToLLM..."
cd "$PARENT_DIR"
rm -f GoToLLM.zip
zip -r GoToLLM.zip GoToLLM/ --exclude "*.git*" --exclude "*scripts*" --exclude "*.DS_Store*"

echo ""
echo "✅ Created: $ZIP_PATH"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Next steps to publish on the Chrome Web Store"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to: https://chrome.google.com/webstore/devconsole"
echo "   (One-time \$5 developer registration if not done yet)"
echo ""
echo "2. Click 'New Item' and upload: GoToLLM.zip"
echo ""
echo "3. Fill in the store listing:"
echo "   - Name:        GoToLLM"
echo "   - Category:    Productivity"
echo "   - Description: Prompt any LLM instantly from the address bar."
echo "                  Type 'ai' + Tab + your question."
echo ""
echo "4. Upload store assets:"
echo "   - At least 1 screenshot (1280×800 or 640×400)"
echo "   - Promo tile (440×280) — optional but recommended"
echo ""
echo "5. Privacy practices:"
echo "   - Declare that NO user data is collected"
echo "   - 'storage' permission is used only to save the default LLM"
echo "     preference locally on the user's device"
echo ""
echo "6. Click 'Submit for Review' — usually approved in 1–3 business days"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
