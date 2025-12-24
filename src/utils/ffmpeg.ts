// FFmpeg utility for merging audio and video
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;
let isLoading = false;
let isLoaded = false;

/**
 * تحميل FFmpeg (يتم مرة واحدة فقط)
 */
export async function loadFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance && isLoaded) {
    return ffmpegInstance;
  }

  if (isLoading) {
    // انتظر حتى ينتهي التحميل
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (ffmpegInstance && isLoaded) {
      return ffmpegInstance;
    }
  }

  isLoading = true;

  try {
    const ffmpeg = new FFmpeg();
    
    // تحميل FFmpeg core
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    ffmpegInstance = ffmpeg;
    isLoaded = true;
    isLoading = false;

    return ffmpeg;
  } catch (error) {
    isLoading = false;
    throw error;
  }
}

/**
 * دمج الصوت مع الفيديو
 * @param videoUrl رابط الفيديو
 * @param audioUrl رابط الصوت (يمكن أن يكون Blob URL)
 * @param onProgress دالة لتتبع التقدم (اختياري)
 * @returns Blob للفيديو المدمج
 */
export async function mergeAudioVideo(
  videoUrl: string,
  audioUrl: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  try {
    // تحميل FFmpeg
    if (onProgress) onProgress(5);
    const ffmpeg = await loadFFmpeg();
    if (onProgress) onProgress(10);

    // تحميل ملفات الفيديو والصوت
    const videoData = await fetchFile(videoUrl);
    if (onProgress) onProgress(30);
    
    const audioData = await fetchFile(audioUrl);
    if (onProgress) onProgress(50);

    // كتابة الملفات إلى نظام الملفات الافتراضي
    await ffmpeg.writeFile('input_video.mp4', videoData);
    await ffmpeg.writeFile('input_audio.webm', audioData);
    if (onProgress) onProgress(60);

    // تنفيذ أمر FFmpeg لدمج الصوت والفيديو
    // -i input_video.mp4: ملف الفيديو المدخل
    // -i input_audio.webm: ملف الصوت المدخل
    // -c:v copy: نسخ الفيديو بدون إعادة ترميز (أسرع)
    // -c:a aac: ترميز الصوت إلى AAC
    // -strict experimental: السماح بميزات تجريبية
    // -shortest: إنهاء عند انتهاء أقصر ملف
    await ffmpeg.exec([
      '-i', 'input_video.mp4',
      '-i', 'input_audio.webm',
      '-c:v', 'copy',
      '-c:a', 'aac',
      '-strict', 'experimental',
      '-shortest',
      'output.mp4'
    ]);
    if (onProgress) onProgress(90);

    // قراءة الملف الناتج
    const data = await ffmpeg.readFile('output.mp4');
    if (onProgress) onProgress(95);

    // تنظيف الملفات المؤقتة
    try {
      await ffmpeg.deleteFile('input_video.mp4');
      await ffmpeg.deleteFile('input_audio.webm');
      await ffmpeg.deleteFile('output.mp4');
    } catch (e) {
      console.warn('Failed to cleanup temp files:', e);
    }

    if (onProgress) onProgress(100);

    // تحويل البيانات إلى Blob
    // Create a new Uint8Array from the data to ensure compatibility
    const uint8Data = new Uint8Array(data as Uint8Array);
    const blob = new Blob([uint8Data], { type: 'video/mp4' });
    return blob;
  } catch (error) {
    console.error('Error merging audio and video:', error);
    throw new Error('فشل دمج الصوت مع الفيديو. يرجى المحاولة مرة أخرى.');
  }
}

/**
 * التحقق من دعم FFmpeg في المتصفح
 */
export function isFFmpegSupported(): boolean {
  try {
    // التحقق من دعم SharedArrayBuffer (مطلوب لـ FFmpeg)
    return typeof SharedArrayBuffer !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * تحويل Blob إلى URL
 */
export function blobToURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * تنظيف URL
 */
export function cleanupURL(url: string): void {
  try {
    URL.revokeObjectURL(url);
  } catch (e) {
    console.warn('Failed to revoke URL:', e);
  }
}
