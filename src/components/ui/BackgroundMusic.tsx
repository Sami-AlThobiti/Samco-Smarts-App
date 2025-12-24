import { useEffect, useRef, useState } from "react";
import { Button } from "./button";

type Props = {
  src?: string; // مسار الأغنية داخل public
};

// مكون الموسيقى الخلفية مع زر تشغيل/إيقاف
export default function BackgroundMusic({ 
  src = "https://cdn.pixabay.com/audio/2022/03/10/audio_4a1f1c2eac.mp3" 
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  // حفظ تفضيل المستخدم
  const STORAGE_KEY = "samco_music_enabled";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // إعدادات أساسية
    audio.loop = true;
    audio.preload = "auto";

    // معالجة الأخطاء
    const handleError = () => {
      console.error("فشل تحميل الموسيقى");
      setError(true);
      setReady(true);
    };

    const handleCanPlay = () => {
      setError(false);
    };

    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    // هل المستخدم كان مشغل الموسيقى سابقًا؟
    const saved = localStorage.getItem(STORAGE_KEY);
    const shouldPlay = saved === "1";

    // نحاول تشغيل تلقائي "Muted" (قد ينجح)
    const tryAutoplay = async () => {
      try {
        audio.muted = true;
        await audio.play(); // غالبًا يسمح إذا muted
        setPlaying(true);
      } catch {
        setPlaying(false);
      } finally {
        setReady(true);
      }
    };

    // إذا المستخدم سبق واختار تشغيلها، نحاول تشغيلها بعد أول تفاعل
    // لأن autoplay بالصوت غالبًا ممنوع
    const unlockWithFirstUserGesture = async () => {
      if (!shouldPlay) return;
      try {
        audio.muted = false;
        await audio.play();
        setPlaying(true);
      } catch {
        // سيظل يحتاج ضغط زر
      }
    };

    tryAutoplay();

    window.addEventListener("pointerdown", unlockWithFirstUserGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockWithFirstUserGesture);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (!playing) {
        audio.muted = false;
        await audio.play();
        setPlaying(true);
        localStorage.setItem(STORAGE_KEY, "1");
      } else {
        audio.pause();
        setPlaying(false);
        localStorage.setItem(STORAGE_KEY, "0");
      }
    } catch (e) {
      console.error("Audio toggle error:", e);
    }
  };

  return (
    <>
      {/* عنصر الصوت */}
      <audio ref={audioRef} src={src} />

      {/* زر التشغيل/الإيقاف */}
      {ready && !error && (
        <Button
          onClick={toggle}
          variant="outline"
          size="sm"
          className="fixed bottom-4 left-4 z-50 shadow-lg backdrop-blur-sm"
          title={playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
        >
          {playing ? "🔊" : "🔇"}
        </Button>
      )}
    </>
  );
}
