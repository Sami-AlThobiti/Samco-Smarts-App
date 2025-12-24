# TTS Quick Test Guide

## 🚀 Quick Test Steps

### Test 1: English (Simple)
```
Text: Hello world
Locale: 🇺🇸 English (US)
Voice: Jenny (Female)
Speed: medium
Pitch: medium
```
**Expected**: Should hear "Hello world" in female American English voice

---

### Test 2: Arabic (Simple)
```
Text: مرحبا
Locale: 🇸🇦 عربي (السعودية)
Voice: زارية (أنثى)
Speed: medium
Pitch: medium
```
**Expected**: Should hear "مرحبا" in female Saudi Arabic voice

---

### Test 3: English (Longer)
```
Text: This is a test of the text to speech system. It should work correctly for both Arabic and English languages.
Locale: 🇺🇸 English (US)
Voice: Guy (Male)
Speed: medium
Pitch: medium
```
**Expected**: Should hear full sentence in male American English voice

---

### Test 4: Arabic (Longer)
```
Text: هذا اختبار لنظام تحويل النص إلى صوت. يجب أن يعمل بشكل صحيح للغة العربية والإنجليزية.
Locale: 🇸🇦 عربي (السعودية)
Voice: حامد (ذكر)
Speed: medium
Pitch: medium
```
**Expected**: Should hear full sentence in male Saudi Arabic voice

---

### Test 5: Fast Speed
```
Text: This is a fast speech test
Locale: 🇺🇸 English (US)
Voice: Jenny (Female)
Speed: fast
Pitch: medium
```
**Expected**: Should hear faster speech

---

### Test 6: High Pitch
```
Text: This is a high pitch test
Locale: 🇺🇸 English (US)
Voice: Jenny (Female)
Speed: medium
Pitch: high
```
**Expected**: Should hear higher pitched voice

---

### Test 7: Different Dialect (Egyptian)
```
Text: أهلا وسهلا
Locale: 🇪🇬 عربي (مصر)
Voice: سلمى (أنثى)
Speed: medium
Pitch: medium
```
**Expected**: Should hear Egyptian Arabic accent

---

### Test 8: British English
```
Text: Good morning, how are you today?
Locale: 🇬🇧 English (UK)
Voice: Sonia (Female)
Speed: medium
Pitch: medium
```
**Expected**: Should hear British English accent

---

## 🔍 What to Check

### In Browser Console (F12)
Look for these logs:
1. ✅ "Generation settings:" - Shows your input
2. ✅ "Azure TTS Request:" - Shows API request details
3. ✅ "Generated SSML:" - Shows the XML being sent
4. ✅ "Audio generated successfully:" - Shows audio file size

### If You See Errors
1. ❌ "Text-to-speech request failed: 401" → API key issue
2. ❌ "Text-to-speech request failed: 400" → Invalid SSML or voice
3. ❌ "Received empty audio file" → API returned empty response
4. ❌ "Network error" → Connection problem

---

## 📋 Checklist

- [ ] Test 1: English simple ✓
- [ ] Test 2: Arabic simple ✓
- [ ] Test 3: English longer ✓
- [ ] Test 4: Arabic longer ✓
- [ ] Test 5: Fast speed ✓
- [ ] Test 6: High pitch ✓
- [ ] Test 7: Egyptian dialect ✓
- [ ] Test 8: British English ✓

---

## 🐛 If Something Doesn't Work

1. **Open browser console** (F12)
2. **Copy all console logs**
3. **Note which test failed**
4. **Check error message**
5. **Report with details**

---

## ✅ Success Criteria

- Audio plays without errors
- Voice matches selected language/dialect
- Speed and pitch adjustments work
- No console errors
- Audio file downloads successfully

---

## 🎯 Priority Tests

If time is limited, test these first:
1. ✅ Test 1 (English simple)
2. ✅ Test 2 (Arabic simple)
3. ✅ Test 3 (English longer)
4. ✅ Test 4 (Arabic longer)

These cover the core functionality.
