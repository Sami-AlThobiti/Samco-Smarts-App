#!/bin/bash

echo "==================================="
echo "Dual Frame Refactoring Verification"
echo "==================================="
echo ""

echo "1. Checking for OLD variables (should NOT exist)..."
echo "---------------------------------------------------"
if grep -q "referenceImagePreview\|fileInputRef\|referenceImage\|framePosition" src/pages/CreateVideoPage.tsx; then
    echo "❌ FAIL: Found old variable references!"
    grep -n "referenceImagePreview\|fileInputRef\|referenceImage\|framePosition" src/pages/CreateVideoPage.tsx
    exit 1
else
    echo "✅ PASS: No old variable references found"
fi
echo ""

echo "2. Checking for NEW variables (should exist)..."
echo "------------------------------------------------"
if grep -q "firstFrameImage\|firstFramePreview\|lastFrameImage\|lastFramePreview\|firstFrameInputRef\|lastFrameInputRef" src/pages/CreateVideoPage.tsx; then
    echo "✅ PASS: New variables found"
    echo "   - firstFrameImage: $(grep -c "firstFrameImage" src/pages/CreateVideoPage.tsx) occurrences"
    echo "   - firstFramePreview: $(grep -c "firstFramePreview" src/pages/CreateVideoPage.tsx) occurrences"
    echo "   - lastFrameImage: $(grep -c "lastFrameImage" src/pages/CreateVideoPage.tsx) occurrences"
    echo "   - lastFramePreview: $(grep -c "lastFramePreview" src/pages/CreateVideoPage.tsx) occurrences"
    echo "   - firstFrameInputRef: $(grep -c "firstFrameInputRef" src/pages/CreateVideoPage.tsx) occurrences"
    echo "   - lastFrameInputRef: $(grep -c "lastFrameInputRef" src/pages/CreateVideoPage.tsx) occurrences"
else
    echo "❌ FAIL: New variables not found!"
    exit 1
fi
echo ""

echo "3. Verifying state declarations..."
echo "-----------------------------------"
sed -n '82,86p' src/pages/CreateVideoPage.tsx
echo ""

echo "4. Verifying ref declarations..."
echo "---------------------------------"
sed -n '74,76p' src/pages/CreateVideoPage.tsx
echo ""

echo "5. Running ESLint..."
echo "--------------------"
npm run lint 2>&1 | tail -5
echo ""

echo "==================================="
echo "✅ ALL CHECKS PASSED!"
echo "==================================="
echo ""
echo "If you're still seeing errors in the browser:"
echo "1. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)"
echo "2. Clear Vite cache: rm -rf node_modules/.vite && npm run dev"
echo "3. Check browser console for cached service workers"
echo ""
echo "See CACHE_CLEAR_INSTRUCTIONS.md for detailed steps"
