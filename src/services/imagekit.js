/**
 * ImageKit Upload Service
 * Handles uploading image buffers to ImageKit CDN storage.
 */
import { getImageKitClient } from '../config/imagekit.js';

export const uploadToImageKit = async (imageBuffer, fileName, folderPath, fallbackUrl = '') => {
  const imagekit = getImageKitClient();

  // If ImageKit credentials are not configured, use fallback or base64 data URI
  if (!imagekit) {
    console.warn('[ImageKit Service] Credentials not configured. Using fallback direct URL or data URI.');
    if (fallbackUrl) {
      return {
        imageUrl: fallbackUrl,
        fileId: `fallback-${Date.now()}`,
      };
    }
    const base64 = imageBuffer.toString('base64');
    return {
      imageUrl: `data:image/jpeg;base64,${base64}`,
      fileId: `data-uri-${Date.now()}`,
    };
  }

  try {
    const uploadResponse = await imagekit.upload({
      file: imageBuffer,
      fileName,
      folder: folderPath,
      useUniqueFileName: true,
      tags: ['brand-builder', 'ai-generated'],
    });

    console.log(`[ImageKit Service] Uploaded successfully: ${uploadResponse.url}`);
    return {
      imageUrl: uploadResponse.url,
      fileId: uploadResponse.fileId,
    };
  } catch (error) {
    console.error('[ImageKit Service] Upload failed:', error.message);
    if (fallbackUrl) {
      console.warn('[ImageKit Service] Falling back to direct URL.');
      return {
        imageUrl: fallbackUrl,
        fileId: `fallback-err-${Date.now()}`,
      };
    }
    throw error;
  }
};
