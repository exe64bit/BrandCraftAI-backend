/**
 * Pollinations AI Image Generation Service
 * Uses the current gen.pollinations.ai image endpoint.
 */

export const generatePollinationsImage = async (prompt, options = {}) => {
  const {
    width = 1024,
    height = 1024,
    model = 'openai/gpt-image-1.5',
    seed = Math.floor(Math.random() * 1000000),
    nologo = true,
  } = options;

  const safePrompt = String(prompt || '').trim();
  if (!safePrompt) {
    throw new Error('A valid image prompt is required.');
  }

  const encodedPrompt = encodeURIComponent(safePrompt);
  const baseUrl = `https://gen.pollinations.ai/image/${encodedPrompt}`;

  const queryParams = new URLSearchParams({
    model,
    width: String(width),
    height: String(height),
    seed: String(seed),
  });

  if (nologo !== undefined) {
    queryParams.set('nologo', String(nologo));
  }

  const apiKey = process.env.POLLINATIONS_API_KEY;
  if (apiKey) {
    queryParams.set('key', apiKey);
  }

  const url = `${baseUrl}?${queryParams.toString()}`;
  console.log(`[Pollinations AI] Generating image with prompt length: ${safePrompt.length}...`);

  const headers = {
    'User-Agent': 'BrandCraft-AI/1.0',
    Accept: 'image/*',
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(
        `Pollinations API returned status: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`
      );
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`[Pollinations AI] Successfully generated image (${buffer.length} bytes, ${contentType})`);
    return {
      buffer,
      contentType,
      directUrl: url,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Image generation request to Pollinations timed out after 45 seconds.');
    }
    console.error('[Pollinations AI] Error:', error.message);
    throw error;
  }
};