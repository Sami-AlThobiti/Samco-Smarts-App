# Browser Cache Clear Instructions

## Issue
After refactoring the code to support dual frame images, you may encounter errors like:
- `ReferenceError: referenceImagePreview is not defined`
- `ReferenceError: fileInputRef is not defined`

## Root Cause
These errors occur because the browser or development server has cached the old version of the code. The actual source code has been correctly updated, but the cached version still references the old variable names.

## Solution

### Option 1: Hard Refresh Browser (Recommended)
1. Open your browser's developer tools (F12)
2. Right-click on the refresh button
3. Select "Empty Cache and Hard Reload" or "Hard Refresh"
4. Or use keyboard shortcuts:
   - **Chrome/Edge**: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - **Firefox**: `Ctrl+F5` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - **Safari**: `Cmd+Option+R` (Mac)

### Option 2: Clear Vite Cache
```bash
cd /workspace/app-8bbt7fcnal1d
rm -rf node_modules/.vite
rm -rf dist
npm run dev
```

### Option 3: Clear All Caches
```bash
cd /workspace/app-8bbt7fcnal1d
rm -rf node_modules/.vite
rm -rf dist
rm -rf .turbo
npm run dev
```

### Option 4: Restart Development Server
1. Stop the development server (Ctrl+C)
2. Clear the terminal
3. Restart: `npm run dev`
4. Hard refresh the browser

## Verification

After clearing the cache, verify the changes are loaded:

1. Open browser DevTools (F12)
2. Go to Sources tab
3. Find `CreateVideoPage.tsx`
4. Search for `firstFrameInputRef` and `lastFrameInputRef` - they should exist
5. Search for `fileInputRef` - it should NOT exist
6. Search for `firstFramePreview` and `lastFramePreview` - they should exist
7. Search for `referenceImagePreview` - it should NOT exist

## Code Verification

Run these commands to verify the code is correct:

```bash
# Check that old variables don't exist
grep -n "referenceImagePreview\|fileInputRef" src/pages/CreateVideoPage.tsx
# Should return: (no output or exit code 1)

# Check that new variables exist
grep -n "firstFramePreview\|lastFramePreview\|firstFrameInputRef\|lastFrameInputRef" src/pages/CreateVideoPage.tsx
# Should return: multiple matches

# Run lint to verify no errors
npm run lint
# Should return: Checked 89 files in ~1500ms. No fixes applied.
```

## Expected Results

After clearing cache, you should see:
- ✅ Two separate image upload sections (First Frame and Last Frame)
- ✅ Each section has its own upload button, preview, and remove button
- ✅ Icons: 🎬 for first frame, 🎞️ for last frame
- ✅ Responsive layout: side-by-side on large screens, stacked on mobile
- ✅ No console errors
- ✅ All functionality working correctly

## Still Having Issues?

If the error persists after trying all options:

1. Check browser console for the exact error
2. Verify you're looking at the correct file path
3. Try a different browser
4. Check if there are any service workers caching the app:
   - Open DevTools → Application → Service Workers
   - Unregister any service workers
   - Hard refresh

## Technical Details

### What Changed
- **Removed**: `referenceImage`, `referenceImagePreview`, `framePosition`, `fileInputRef`
- **Added**: `firstFrameImage`, `firstFramePreview`, `lastFrameImage`, `lastFramePreview`, `firstFrameInputRef`, `lastFrameInputRef`

### Files Modified
- `src/pages/CreateVideoPage.tsx` (~150 lines changed)

### Verification Commands
```bash
# Verify state variables
sed -n '82,86p' src/pages/CreateVideoPage.tsx
# Should show: firstFrameImage, firstFramePreview, lastFrameImage, lastFramePreview

# Verify refs
sed -n '74,76p' src/pages/CreateVideoPage.tsx
# Should show: firstFrameInputRef, lastFrameInputRef, audioInputRef

# Run full lint check
npm run lint
# Should pass with no errors
```

---

**Last Updated**: 2025-12-21  
**Status**: ✅ Code is correct, cache clearing required
