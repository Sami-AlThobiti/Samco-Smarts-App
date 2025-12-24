# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-8bbt7fcnal1d

# Samco TTS Backend - Gemini Chirp3-HD

Backend server for Samco AI Content Creation App using **Gemini API with Chirp3-HD voices** for high-quality Arabic text-to-speech.

## Features

- ✅ Gemini 2.5 Flash Preview TTS model
- ✅ Chirp3-HD voices (ar-XA-Chirp3-HD-Kore, Puck, Charon, Aoede)
- ✅ Strict Arabic prompt for accurate pronunciation
- ✅ Style presets (cinematic, calm, energetic, child-like)
- ✅ High-quality audio (24kHz WAV)
- ✅ PCM to WAV conversion
- ✅ Base64 or Binary response

## Installation

```bash
cd backend-tts
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your Gemini API key:
```
GEMINI_API_KEY=YOUR_ACTUAL_KEY_HERE
PORT=8080
```

## Get Gemini API Key

1. Go to https://aistudio.google.com/
2. Click "Get API Key"
3. Create a new API key
4. Copy and paste it into `.env`

## Running

```bash
npm start
```

Server will run on `http://localhost:8080`

## API Endpoint

### POST /tts

**Request Body**:
```json
{
  "text": "مرحبا بك في تطبيق سامكو",
  "voiceName": "ar-XA-Chirp3-HD-Kore",
  "styleHint": "أنت قارئ صوتي محترف...",
  "returnWavBase64": true
}
```

**Response** (JSON):
```json
{
  "mimeType": "audio/wav",
  "sampleRate": 24000,
  "channels": 1,
  "audioBase64": "UklGRi4..."
}
```

**Response** (Binary - if `returnWavBase64: false`):
```
Content-Type: audio/wav
[WAV audio data]
```

## Available Voices (Chirp3-HD)

| Voice Name | Display Name | Gender | Quality |
|------------|--------------|--------|---------|
| ar-XA-Chirp3-HD-Kore | كوري | Female | High |
| ar-XA-Chirp3-HD-Puck | باك | Male | High |
| ar-XA-Chirp3-HD-Charon | كارون | Male | High |
| ar-XA-Chirp3-HD-Aoede | أويدي | Female | High |

## Strict Arabic Prompt

The default styleHint ensures accurate pronunciation:

```
أنت قارئ صوتي محترف.
اقرأ النص العربي التالي كما هو مكتوب حرفيًا دون أي تعديل أو إعادة صياغة أو ترجمة.
التزم بعلامات الترقيم.
اقرأ الأرقام كأرقام عربية مفهومة في السياق.
نطق عربي فصيح واضح جدًا، مخارج حروف دقيقة، دون إدخال لهجة أجنبية.
```

## Style Presets

### Cinematic (سينمائي)
```
بنبرة سينمائية فخمة، سرعة متوسطة، توقفات واضحة بعد الجمل، وحماس متزن.
```

### Calm (هادئ)
```
بنبرة هادئة مطمئنة، سرعة بطيئة قليلاً، دون مبالغة.
```

### Energetic (حماسي)
```
بنبرة حماسية سريعة قليلاً، مع وضوح شديد.
```

### Child-like (طفولي)
```
بصوت طفولي لطيف مع الحفاظ على نطق العربية الصحيح.
```

## Testing

### Basic Test

```bash
curl -X POST http://localhost:8080/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "مرحبا",
    "voiceName": "ar-XA-Chirp3-HD-Kore",
    "returnWavBase64": true
  }'
```

### Test with Style

```bash
curl -X POST http://localhost:8080/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "مرحبا بك في تطبيق سامكو",
    "voiceName": "ar-XA-Chirp3-HD-Kore",
    "styleHint": "أنت قارئ صوتي محترف...\nبنبرة سينمائية فخمة، سرعة متوسطة، توقفات واضحة بعد الجمل، وحماس متزن.",
    "returnWavBase64": true
  }'
```

### Test with Punctuation

```bash
curl -X POST http://localhost:8080/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "مرحبا، كيف حالك اليوم؟ أتمنى أن تكون بخير!",
    "voiceName": "ar-XA-Chirp3-HD-Kore",
    "returnWavBase64": true
  }'
```

## Deployment

### Option 1: Railway
```bash
# Push to GitHub
git push origin main

# Deploy on Railway
# Add GEMINI_API_KEY environment variable
```

### Option 2: Render
1. Create new Web Service
2. Connect GitHub repo
3. Add environment variable: `GEMINI_API_KEY`
4. Deploy

### Option 3: Your Server
```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name samco-tts

# Save configuration
pm2 save

# Setup startup
pm2 startup
```

## Troubleshooting

### Error: "Missing GEMINI_API_KEY"
- Check `.env` file exists
- Check `GEMINI_API_KEY` is set correctly
- Restart server after changing `.env`

### Error: "Gemini TTS error"
- Check API key is valid
- Check API quota/limits
- Check voice name is correct (ar-XA-Chirp3-HD-Kore)

### Error: "No audio returned"
- Check request format
- Check voice name is valid (must include ar-XA-Chirp3-HD prefix)
- Check text is not empty

## Important Notes

### Voice Names
Always use the full voice name with prefix:
- ✅ `ar-XA-Chirp3-HD-Kore`
- ❌ `Kore`

### Arabic Pronunciation
The strict prompt is KEY for accurate Arabic pronunciation:
1. Prevents interpretation/paraphrasing
2. Ensures literal reading
3. Respects punctuation
4. Handles numbers correctly
5. Uses proper Arabic phonetics

### UTF-8 Encoding
Always use UTF-8 encoding for Arabic text:
```javascript
headers: {
  'Content-Type': 'application/json; charset=utf-8'
}
```

## Performance

- Average response time: 3-7 seconds
- Depends on text length and network
- Audio size: ~48KB per second

## License

MIT

## Support

For issues or questions:
1. Check console logs
2. Check Gemini API status
3. Verify voice names include Chirp3-HD prefix
4. Contact backend team
