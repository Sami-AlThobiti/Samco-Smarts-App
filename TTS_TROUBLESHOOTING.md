# Text-to-Speech Troubleshooting Guide

## Recent Fixes Applied

### 1. SSML Generation Issues
**Problem**: The SSML was incorrectly extracting locale from voice name using `substring(0, 5)`.

**Solution**: Now passing locale explicitly as a parameter to `textToSSML()` function.

```typescript
// Before (incorrect)
const ssml = textToSSML(text, voiceName, speed, pitch, style);
// xml:lang was extracted from voiceName.substring(0, 5)

// After (correct)
const ssml = textToSSML(text, voiceName, locale, speed, pitch, style);
// xml:lang uses the actual locale parameter
```

### 2. Speed and Pitch Conversion
**Problem**: Speed and pitch values were being passed directly as strings without proper conversion to SSML format.

**Solution**: Added conversion functions:
- `speedToRate()`: Converts 'medium', 'fast', etc. to SSML rate values
- `pitchToValue()`: Converts 'medium', 'high', etc. to percentage values ('+0%', '+10%', etc.)

### 3. XML Escaping
**Problem**: Special characters in text could break SSML XML structure.

**Solution**: Added proper XML escaping for:
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&apos;`

### 4. Error Messages
**Problem**: All error messages were in Arabic, making debugging difficult for English users.

**Solution**: Updated all error messages to English with detailed information.

### 5. Enhanced Logging
**Problem**: Insufficient logging made debugging difficult.

**Solution**: Added comprehensive console logging:
- Request parameters
- Generated SSML (first 200 chars)
- Response status and errors
- Audio blob size and type

## Testing the TTS Feature

### Test Cases

#### 1. English Text
```
Text: "Hello, this is a test of the text to speech system."
Locale: en-US
Voice: en-US-JennyNeural (Female) or en-US-GuyNeural (Male)
Speed: medium
Pitch: medium
Style: default
```

#### 2. Arabic Text
```
Text: "مرحبا، هذا اختبار لنظام تحويل النص إلى صوت"
Locale: ar-SA
Voice: ar-SA-ZariyahNeural (Female) or ar-SA-HamedNeural (Male)
Speed: medium
Pitch: medium
Style: default
```

#### 3. Mixed Speed/Pitch
```
Text: "Testing different speeds and pitches"
Locale: en-US
Voice: en-US-JennyNeural
Speed: fast
Pitch: high
Style: default
```

#### 4. With Style (if supported)
```
Text: "This is an exciting announcement!"
Locale: en-US
Voice: en-US-JennyNeural
Speed: medium
Pitch: medium
Style: cheerful
```

## Common Errors and Solutions

### Error: "Text-to-speech request failed: 401"
**Cause**: Missing or invalid Azure API key

**Solution**: 
1. Check that the API endpoint is correctly configured
2. Verify the X-App-Id header is being sent
3. Contact backend team to verify Azure credentials

### Error: "Text-to-speech request failed: 400"
**Cause**: Invalid SSML or unsupported voice/locale combination

**Solution**:
1. Check browser console for the generated SSML
2. Verify the voice name matches the locale (e.g., ar-SA-ZariyahNeural for ar-SA)
3. Ensure the style is supported by the selected voice

### Error: "Received empty audio file from Azure TTS"
**Cause**: API returned 200 but with empty content

**Solution**:
1. Check if the text is too short (try longer text)
2. Verify the output format is supported
3. Check Azure service status

### Error: "Failed to generate speech: Network error"
**Cause**: Network connectivity issues or CORS problems

**Solution**:
1. Check internet connection
2. Verify the API endpoint is accessible
3. Check browser console for CORS errors

## Debugging Steps

### 1. Open Browser Console
Press F12 or right-click → Inspect → Console tab

### 2. Check Request Logs
Look for logs starting with:
- "Azure TTS Request:" - Shows request parameters
- "Generated SSML:" - Shows the SSML being sent
- "Audio generated successfully:" - Shows successful response

### 3. Check Error Logs
Look for logs starting with:
- "Azure TTS API Error:" - Shows API error details
- "Error in azureTextToSpeech:" - Shows caught exceptions

### 4. Verify SSML Format
The generated SSML should look like:
```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="ar-SA">
  <voice name="ar-SA-ZariyahNeural">
    <prosody rate="medium" pitch="+0%">
      Your text here
    </prosody>
  </voice>
</speak>
```

### 5. Test with Simple Text
Start with very simple text:
- English: "Hello"
- Arabic: "مرحبا"

If simple text works but longer text doesn't, the issue might be:
- Text length limits
- Special characters in the text
- SSML escaping issues

## API Endpoint Details

**Endpoint**: `https://api-integrations.appmedo.com/app-8bbt7fcnal1d/api-azure-tts/cognitiveservices/v1`

**Method**: POST

**Headers**:
- `Content-Type`: `application/ssml+xml`
- `X-Microsoft-OutputFormat`: `audio-24khz-48kbitrate-mono-mp3`
- `X-App-Id`: `app-8bbt7fcnal1d`

**Body**: SSML XML string

**Response**: Binary audio data (MP3)

## Voice Names Reference

### Arabic Voices
- **Saudi Arabia (ar-SA)**:
  - Female: ar-SA-ZariyahNeural
  - Male: ar-SA-HamedNeural

- **Egypt (ar-EG)**:
  - Female: ar-EG-SalmaNeural
  - Male: ar-EG-ShakirNeural

- **UAE (ar-AE)**:
  - Female: ar-AE-FatimaNeural
  - Male: ar-AE-HamdanNeural

### English Voices
- **US (en-US)**:
  - Female: en-US-JennyNeural, en-US-AriaNeural
  - Male: en-US-GuyNeural, en-US-TonyNeural

- **UK (en-GB)**:
  - Female: en-GB-SoniaNeural
  - Male: en-GB-RyanNeural

## Next Steps if Issues Persist

1. **Check Backend Logs**: Contact backend team to check Azure API logs
2. **Verify Azure Subscription**: Ensure Azure Speech Services subscription is active
3. **Test Direct API Call**: Use Postman or curl to test the endpoint directly
4. **Check Rate Limits**: Verify if Azure rate limits are being hit
5. **Review Azure Quotas**: Check if the subscription has sufficient quota

## Support

If the issue persists after trying all troubleshooting steps:
1. Copy the browser console logs
2. Note the exact error message
3. Record the test case that's failing
4. Contact the development team with these details
