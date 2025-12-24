import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PORT = process.env.PORT || 8080;

// Helper: build WAV header for PCM 16-bit little-endian
function pcmToWav(pcmBuffer, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;

  const wavHeader = Buffer.alloc(44);
  wavHeader.write("RIFF", 0);
  wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4);
  wavHeader.write("WAVE", 8);
  wavHeader.write("fmt ", 12);
  wavHeader.writeUInt32LE(16, 16); // PCM
  wavHeader.writeUInt16LE(1, 20);  // AudioFormat=1 (PCM)
  wavHeader.writeUInt16LE(channels, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(byteRate, 28);
  wavHeader.writeUInt16LE(blockAlign, 32);
  wavHeader.writeUInt16LE(bitsPerSample, 34);
  wavHeader.write("data", 36);
  wavHeader.writeUInt32LE(pcmBuffer.length, 40);

  return Buffer.concat([wavHeader, pcmBuffer]);
}

app.post("/tts", async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    const {
      text,
      voiceName = "ar-XA-Chirp3-HD-Kore",
      styleHint = `أنت قارئ صوتي محترف.
اقرأ النص العربي التالي كما هو مكتوب حرفيًا دون أي تعديل أو إعادة صياغة.
نطق عربي فصيح واضح جدًا، مخارج حروف دقيقة، التزم بعلامات الترقيم.
بنبرة سينمائية فخمة، سرعة متوسطة، وقفات طبيعية بعد الجمل.
لا تغيّر الكلمات، لا تفسّر المعنى، اقرأ النص فقط.`,
      returnWavBase64 = true
    } = req.body || {};

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "text is required" });
    }

    // Prompt للعربية الفصحى السينمائية: البرومبت الصارم + النص
    const prompt = `${styleHint}\n\nالنص:\n${text}`;

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      "gemini-2.5-flash-preview-tts:generateContent";

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      }
    };

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      const errText = await r.text();
      return res.status(r.status).json({ error: "Gemini TTS error", details: errText });
    }

    const json = await r.json();

    // حسب الوثائق: audio يرجع في inlineData.data (base64 PCM)
    const pcmBase64 =
      json?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!pcmBase64) {
      return res.status(500).json({ error: "No audio returned", raw: json });
    }

    const pcmBuffer = Buffer.from(pcmBase64, "base64");
    const wavBuffer = pcmToWav(pcmBuffer, 24000, 1, 16);

    if (returnWavBase64) {
      return res.json({
        mimeType: "audio/wav",
        sampleRate: 24000,
        channels: 1,
        audioBase64: wavBuffer.toString("base64")
      });
    }

    // أو ترجع WAV مباشرة كباينري
    res.setHeader("Content-Type", "audio/wav");
    return res.send(wavBuffer);
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: String(e?.message || e) });
  }
});

app.listen(PORT, () => console.log(`TTS server running on :${PORT}`));
