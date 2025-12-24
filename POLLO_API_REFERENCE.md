# Pollo AI API Reference

## Overview

This document provides the correct API reference for integrating with Pollo AI's video generation service.

---

## Base URL

```
https://pollo.ai/api/platform
```

---

## Authentication

All API requests require an API key in the header:

```
x-api-key: YOUR_API_KEY
```

---

## Endpoints

### 1. Create Generation

**Endpoint**: `POST /generation/pollo/pollo-v2-0`

**Description**: Create a new video generation task

**Headers**:
```
Content-Type: application/json
x-api-key: YOUR_API_KEY
```

**Request Body**:
```json
{
  "input": {
    "length": 5,
    "resolution": "720p",
    "prompt": "Create a portal-like cinematic transition...",
    "images": [
      {
        "data": "base64_encoded_image_data",
        "type": "base64"
      }
    ]
  },
  "webhookUrl": ""
}
```

**Parameters**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `input.length` | number | Yes | Video duration in seconds (5, 8, or 10) |
| `input.resolution` | string | Yes | Video resolution ("720p" or "1080p") |
| `input.prompt` | string | Yes | Text prompt describing the desired effect |
| `input.images` | array | Optional | Array of image objects |
| `input.images[].data` | string | Yes | Base64 encoded image data (without data:image prefix) |
| `input.images[].type` | string | Yes | Image type ("base64") |
| `webhookUrl` | string | Optional | Webhook URL for completion notification |

**Response**:
```json
{
  "taskId": "abc123xyz"
}
```

**Example cURL**:
```bash
curl --request POST \
  --url https://pollo.ai/api/platform/generation/pollo/pollo-v2-0 \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: YOUR_API_KEY' \
  --data '{
    "input": {
      "length": 5,
      "resolution": "720p",
      "prompt": "Create a cinematic video effect",
      "images": [
        {
          "data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          "type": "base64"
        }
      ]
    }
  }'
```

---

### 2. Check Status

**Endpoint**: `GET /generation/{taskId}/status`

**Description**: Check the status of a generation task

**Headers**:
```
x-api-key: YOUR_API_KEY
```

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `taskId` | string | Yes | The task ID returned from create generation |

**Response**:
```json
{
  "taskId": "abc123xyz",
  "generations": [
    {
      "status": "succeed",
      "url": "https://pollo.ai/storage/videos/abc123.mp4",
      "mediaType": "video"
    }
  ]
}
```

**Status Values**:

| Status | Description | Action |
|--------|-------------|--------|
| `pending` | Task is queued | Continue polling |
| `processing` | Video is being generated | Continue polling |
| `succeed` | Generation completed | Use `url` field |
| `failed` | Generation failed | Check `failMsg` field |

**Example cURL**:
```bash
curl --request GET \
  --url https://pollo.ai/api/platform/generation/abc123xyz/status \
  --header 'x-api-key: YOUR_API_KEY'
```

---

## Resolution Mapping

The application maps aspect ratios to resolutions:

| Aspect Ratio | Resolution | Use Case |
|--------------|------------|----------|
| 9:16 | 720p | TikTok, Reels, Stories (Portrait) |
| 16:9 | 1080p | YouTube, TV (Landscape) |
| 1:1 | 720p | Instagram Post (Square) |

---

## Workflow

### Complete Generation Flow

```
1. Prepare Images
   ↓
2. Convert to Base64 (remove data:image prefix)
   ↓
3. Create Generation Task
   ↓ (returns taskId)
4. Poll Status Every 2 Seconds
   ↓ (pending → processing → succeed)
5. Get Video URL from generations[0].url
   ↓
6. Use Proxy to Avoid CORS/MIME Issues
   ↓
7. Display Video
```

### TypeScript Example

```typescript
// 1. Convert image to base64
const imageBase64 = await new Promise<string>((resolve) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    const base64 = reader.result as string;
    resolve(base64.split(',')[1]); // Remove data:image/...;base64,
  };
  reader.readAsDataURL(imageFile);
});

// 2. Create generation
const response = await fetch('https://pollo.ai/api/platform/generation/pollo/pollo-v2-0', {
  method: 'POST',
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    input: {
      length: 8,
      resolution: '720p',
      prompt: 'Create a portal-like cinematic transition...',
      images: [{
        data: imageBase64,
        type: 'base64'
      }]
    }
  })
});

const { taskId } = await response.json();

// 3. Poll status
while (true) {
  const statusResponse = await fetch(
    `https://pollo.ai/api/platform/generation/${taskId}/status`,
    {
      headers: { 'x-api-key': API_KEY }
    }
  );
  
  const statusData = await statusResponse.json();
  const generation = statusData.generations[0];
  
  if (generation.status === 'succeed') {
    const videoUrl = generation.url;
    break;
  }
  
  if (generation.status === 'failed') {
    throw new Error(generation.failMsg);
  }
  
  await new Promise(r => setTimeout(r, 2000)); // Wait 2 seconds
}
```

---

## Error Handling

### Common Errors

**1. Invalid API Key**
```json
{
  "error": "Unauthorized",
  "message": "Invalid API key"
}
```
**Solution**: Check your API key in environment variables

**2. Invalid Request Body**
```json
{
  "error": "Bad Request",
  "message": "Invalid input parameters"
}
```
**Solution**: Verify request body matches the schema

**3. Generation Failed**
```json
{
  "taskId": "abc123xyz",
  "generations": [{
    "status": "failed",
    "failMsg": "Image processing error"
  }]
}
```
**Solution**: Check image format and size

**4. Timeout**
- If polling exceeds 2 minutes (60 attempts × 2 seconds)
- **Solution**: Increase `maxAttempts` or check Pollo AI status

---

## Rate Limits

- **Requests per minute**: Check your Pollo AI plan
- **Concurrent generations**: Check your Pollo AI plan
- **Image size**: Maximum 10MB per image
- **Video duration**: 5-10 seconds

---

## Best Practices

### 1. Image Preparation

```typescript
// Compress images before sending
import imageCompression from 'browser-image-compression';

const compressedImage = await imageCompression(file, {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
});
```

### 2. Polling Strategy

```typescript
// Use exponential backoff for failed requests
let retryDelay = 2000;
const maxRetries = 3;

for (let i = 0; i < maxRetries; i++) {
  try {
    const status = await checkStatus(taskId);
    break;
  } catch (error) {
    if (i === maxRetries - 1) throw error;
    await new Promise(r => setTimeout(r, retryDelay));
    retryDelay *= 2; // Exponential backoff
  }
}
```

### 3. Video URL Handling

```typescript
// Always use proxy to avoid CORS and MIME issues
const proxiedUrl = `http://localhost:8080/video?url=${encodeURIComponent(videoUrl)}`;

// Never use status endpoint URL as video source
// ❌ Wrong: https://pollo.ai/api/platform/generation/abc123/status
// ✅ Correct: https://pollo.ai/storage/videos/abc123.mp4
```

### 4. Error Messages

```typescript
// Provide user-friendly error messages
try {
  const videoUrl = await generateVideo(request);
} catch (error) {
  if (error.message.includes('API key')) {
    showError('Configuration error. Please contact support.');
  } else if (error.message.includes('timeout')) {
    showError('Generation is taking longer than expected. Please try again.');
  } else {
    showError('Failed to generate video. Please try again.');
  }
}
```

---

## Security

### 1. API Key Protection

```typescript
// ❌ Never expose API key in frontend
const API_KEY = 'sk-1234567890';

// ✅ Use environment variables
const API_KEY = import.meta.env.VITE_POLLO_API_KEY;

// ✅ Or use backend proxy
const response = await fetch('/api/pollo/generate', {
  method: 'POST',
  body: JSON.stringify(request)
});
```

### 2. Input Validation

```typescript
// Validate image type
const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid image type');
}

// Validate image size
const maxSize = 10 * 1024 * 1024; // 10MB
if (file.size > maxSize) {
  throw new Error('Image too large');
}

// Validate prompt length
if (prompt.length > 1000) {
  throw new Error('Prompt too long');
}
```

---

## Testing

### Test with cURL

```bash
# 1. Create generation
TASK_ID=$(curl -s --request POST \
  --url https://pollo.ai/api/platform/generation/pollo/pollo-v2-0 \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: YOUR_API_KEY' \
  --data '{
    "input": {
      "length": 5,
      "resolution": "720p",
      "prompt": "Test video"
    }
  }' | jq -r '.taskId')

echo "Task ID: $TASK_ID"

# 2. Check status
curl --request GET \
  --url "https://pollo.ai/api/platform/generation/$TASK_ID/status" \
  --header 'x-api-key: YOUR_API_KEY' | jq
```

---

## Resources

- **Pollo AI Website**: https://pollo.ai/
- **API Platform**: https://pollo.ai/api-platform
- **Documentation**: https://docs.pollo.ai/
- **Video Effects**: https://pollo.ai/video-effects

---

## Changelog

### v4.2.0 (2025-12-18)
- Updated to use correct Pollo API endpoint: `/generation/pollo/pollo-v2-0`
- Added proper request body format with `input` object
- Added resolution mapping for aspect ratios
- Added image base64 encoding support
- Improved error handling and status polling

---

## Support

For API issues or questions:
- Check Pollo AI documentation: https://docs.pollo.ai/
- Contact Pollo AI support through their platform
- Review this reference document for common issues

---

**Last Updated**: 2025-12-18  
**Version**: 4.2.0  
**Author**: Samco AI Team
