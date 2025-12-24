# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-8bbt7fcnal1d

# سامكو - تطبيق صناعة المحتوى بالذكاء الاصطناعي

## نظرة عامة

**سامكو** (المصمم سامكو) هو تطبيق مجاني شامل لصناعة المحتوى بالذكاء الاصطناعي يتيح للمستخدمين توليد الصور والفيديوهات والأصوات باستخدام أدوات AI متقدمة.

**الجملة التعريفية:** "اصنع صورك وفيديوهاتك وأصواتك بالذكاء الاصطناعي… بسهولة"

**الاسم التسويقي:** Samco AI – Content & Voice Studio

## الميزات الرئيسية

### 🎨 توليد الصور (Nano Banana Pro)
- توليد صور احترافية من النص
- دعم رفع صورة مرجعية اختيارية
- نصوص طويلة (حتى 4000 حرف)
- مقاسات متعددة:
  - 1:1 (1024×1024) - مربع
  - 9:16 (1080×1920) - عمودي (Stories)
  - 16:9 (1920×1080) - أفقي (YouTube)
  - 4:5 (1080×1350) - Instagram

### 🎬 توليد الفيديو (Sora2 / Kling)
- توليد فيديو من نص
- توليد فيديو من صورة
- مدة قابلة للتخصيص (5-10 ثوانٍ)
- نسب عرض متعددة:
  - 9:16 - عمودي (TikTok/Reels)
  - 16:9 - أفقي (YouTube)
  - 1:1 - مربع

### 🎙️ تحويل النص إلى صوت (Text-to-Speech)
- تحويل النص إلى صوت احترافي
- دعم اللغة العربية والإنجليزية
- أنواع أصوات متعددة:
  - رجل، امرأة، طفل
  - سينمائي، هادئ، حماسي
- لهجات متنوعة:
  - عربي: سعودي، خليجي، مصري، فصحى
  - إنجليزي: أمريكي، بريطاني
- تحكم كامل:
  - سرعة الصوت (بطيء، طبيعي، سريع)
  - نبرة الصوت (هادئ، طبيعي، درامي)
- دعم نصوص طويلة (حتى 5000 حرف)
- مناسب للإعلانات والفيديوهات

### 🧬 استنساخ الصوت (Voice Cloning)
- استنساخ صوتك الخاص
- رفع عينة صوت (10-30 ثانية)
- توليد نصوص جديدة بصوتك
- جودة احترافية عالية
- موافقة قانونية مطلوبة
- حماية الخصوصية

### 🔓 بوابة المتابعة
- بدون تسجيل أو تسجيل دخول
- متابعة حساب TikTok (@samco_designer) لفتح الاستخدام المجاني
- حفظ حالة المتابعة محليًا

### 🎨 التصميم
- واجهة عربية كاملة مع دعم RTL
- وضع داكن افتراضي
- ألوان مخصصة:
  - Primary: #6A5CFF (بنفسجي)
  - Secondary: #00E5FF (سياني)
  - Accent: #FF0050 (وردي TikTok)

## Project Info

**TikTok Account:** [@samco_designer](https://www.tiktok.com/@samco_designer)

**App Name:** المصمم سامكو (Samco AI – Content & Voice Studio)

## Project Directory

```
├── README.md # Documentation
├── components.json # Component library configuration
├── index.html # Entry file
├── package.json # Package management
├── postcss.config.js # PostCSS configuration
├── public # Static resources directory
│   ├── favicon.png # Icon
│   └── images # Image resources
├── src # Source code directory
│   ├── App.tsx # Entry file
│   ├── components # Components directory
│   ├── contexts # Context directory
│   ├── db # Database configuration directory
│   ├── hooks # Common hooks directory
│   ├── index.css # Global styles
│   ├── lib # Utility library directory
│   ├── main.tsx # Entry file
│   ├── routes.tsx # Routing configuration
│   ├── pages # Pages directory
│   │   ├── SplashPage.tsx # Splash screen
│   │   ├── FollowGatePage.tsx # Follow gate
│   │   ├── HomePage.tsx # Home page
│   │   ├── CreateImagePage.tsx # Image generation
│   │   ├── CreateVideoPage.tsx # Video generation
│   │   ├── CreateVoicePage.tsx # Text-to-Speech
│   │   └── VoiceClonePage.tsx # Voice cloning
│   ├── services # API services directory
│   │   └── api.ts # AI generation APIs (Image, Video, Voice)
│   ├── types # Type definitions directory
│   │   └── api.ts # API types (Image, Video, Voice)
├── tsconfig.app.json # TypeScript frontend configuration file
├── tsconfig.json # TypeScript configuration file
├── tsconfig.node.json # TypeScript Node.js configuration file
└── vite.config.ts # Vite configuration file
```

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **UI:** shadcn/ui + Tailwind CSS
- **Routing:** React Router v6
- **APIs:** 
  - Nano Banana Pro (Image Generation)
  - Sora2 / Kling (Video Generation)
  - Text-to-Speech API (Voice Generation)
  - Speech-to-Text API (Audio Transcription)

## Development Guidelines

### Environment Requirements

```bash
# Node.js ≥ 20
# npm ≥ 10
Example:
# node -v   # v20.18.3
# npm -v    # 10.8.2
```

### Installing Node.js on Windows

```
# Step 1: Visit the Node.js official website: https://nodejs.org/, click download. The website will automatically suggest a suitable version (32-bit or 64-bit) for your system.
# Step 2: Run the installer: Double-click the downloaded installer to run it.
# Step 3: Complete the installation: Follow the installation wizard to complete the process.
# Step 4: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### Installing Node.js on macOS

```
# Step 1: Using Homebrew (Recommended method): Open Terminal. Type the command `brew install node` and press Enter. If Homebrew is not installed, you need to install it first by running the following command in Terminal:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
Alternatively, use the official installer: Visit the Node.js official website. Download the macOS .pkg installer. Open the downloaded .pkg file and follow the prompts to complete the installation.
# Step 2: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### Development Setup

```bash
# Step 1: Download the code package
# Step 2: Extract the code package
# Step 3: Open the code package with your IDE and navigate into the code directory

# Step 4: Install dependencies
npm i

# Step 5: Start the development server
npm run dev -- --host 127.0.0.1

# If step 5 failed, try this command:
npx vite --host 127.0.0.1
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_ID=app-8bbt7fcnal1d
```

## API Integration

The app uses the following APIs:

1. **Nano Banana Image Generation API**
   - Endpoint: `/v1beta/models/gemini-3-pro-image-preview:generateContent`
   - Method: POST
   - Timeout: 300s (5 minutes)

2. **Text-to-Video API**
   - Create: `/v1/videos/text2video`
   - Query: `/v1/videos/text2video/{id}`

3. **Image-to-Video API**
   - Create: `/v1/videos/image2video`
   - Query: `/v1/videos/image2video/{id}`

4. **Text-to-Speech API**
   - Endpoint: `/v1/audio/speech`
   - Method: POST
   - Supports multiple voices and languages

5. **Speech-to-Text API** (for future voice cloning)
   - Endpoint: `/v1/audio/transcriptions`
   - Method: POST
   - Audio transcription and analysis

## Usage Flow

1. **Splash Screen** → Auto-redirects after 1.5s
2. **Follow Gate** → User follows TikTok account
3. **Home Page** → Choose between 4 options:
   - 🎨 Image Generation
   - 🎬 Video Generation
   - 🎙️ Text-to-Speech
   - 🧬 Voice Cloning
4. **Generation Page** → Input prompt, upload files (optional), select settings
5. **Result** → Download, share, or regenerate

## Key Features Implementation

- ✅ No authentication required
- ✅ Local storage for follow gate state
- ✅ Long text prompts (up to 5000 characters for voice)
- ✅ Reference image upload (jpg/png/webp)
- ✅ Audio file upload (mp3/wav/ogg/webm)
- ✅ Multiple aspect ratios
- ✅ Progress tracking for video generation
- ✅ Download and share functionality
- ✅ Error handling and user feedback
- ✅ Arabic RTL support
- ✅ Dark mode by default
- ✅ Text-to-Speech with multiple voices and accents
- ✅ Voice cloning with consent checkbox
- ✅ Audio player with controls
- ✅ 4 main features (Image, Video, Voice, Clone)

## Learn More

You can also check the help documentation: Download and Building the app（ [https://intl.cloud.baidu.com/en/doc/MIAODA/s/download-and-building-the-app-en](https://intl.cloud.baidu.com/en/doc/MIAODA/s/download-and-building-the-app-en)）to learn more detailed content.

---

© 2025 المصمم سامكو - Samco AI Content & Voice Studio
