import { callGeminiJSON } from './gemini.js';
import { buildVisualPrompt } from '../prompts/visual.js';

export const runVisualStage = async ({
  originalIdea,
  discovery,
  positioning,
  personality,
  selectedName,
  critique,
  previousResult = null,
}) => {
  const prompt = buildVisualPrompt({
    originalIdea,
    discovery,
    positioning,
    personality,
    selectedName,
    critique,
    previousResult,
  });

  const systemInstruction = 'You are a world-class creative director. Return a rich, sophisticated visual system specification in strict JSON format with hex color codes and typographic pairings.';

  const result = await callGeminiJSON({ prompt, systemInstruction });

  // Helper to ensure valid hex color
  const sanitizeHex = (hex, fallback) => {
    if (typeof hex === 'string' && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim())) {
      return hex.trim();
    }
    return fallback;
  };

  const colors = {
    primary: sanitizeHex(result.colors?.primary, '#3B82F6'),
    secondary: sanitizeHex(result.colors?.secondary, '#10B981'),
    accent: sanitizeHex(result.colors?.accent, '#F59E0B'),
    background: sanitizeHex(result.colors?.background, '#F8FAFC'),
    text: sanitizeHex(result.colors?.text, '#0F172A'),
    paletteRationale: result.colors?.paletteRationale || 'An electric, focused palette conveying digital energy and grounded collaboration.',
  };

  const typography = {
    headingFont: result.typography?.headingFont || 'Space Grotesk',
    bodyFont: result.typography?.bodyFont || 'Inter',
    styleGuide: result.typography?.styleGuide || 'Bold headline weights (600/700) paired with clean geometric body copy (400) for maximum scannability.',
  };

  return {
    colors,
    typography,
    mood: result.mood || 'High-agency, collegiate momentum infused with modern engineering precision.',
    shapes: Array.isArray(result.shapes) && result.shapes.length ? result.shapes : ['Interlocking nodes', 'Asymmetric modular cards', 'Subtle dynamic pill containers'],
    symbols: Array.isArray(result.symbols) && result.symbols.length ? result.symbols : ['Overlapping orbital paths', 'Catalytic spark node', 'Interlocking chevron badge'],
    imagery: {
      style: result.imagery?.style || 'Candid collaborative snapshots with tactile studio lighting and crisp UI overlays.',
      photography: result.imagery?.photography || 'Diverse collegiate creators actively co-building in modern studio spaces.',
      composition: result.imagery?.composition || 'Golden-ratio rule of thirds with prominent breathing room and clean focal points.',
      lighting: result.imagery?.lighting || 'Natural ambient daylight with warm accent rim glows.',
    },
    logoDirection: result.logoDirection || 'Minimalist geometric emblem featuring two stylized interlocking pathways forming an abstract compass or star, accompanied by a clean neo-grotesque wordmark.',
    avoid: Array.isArray(result.avoid) && result.avoid.length ? result.avoid : ['Generic stock handshake photography', 'Cluttered 3D cartoon avatars', 'Unbalanced neon gradients'],
  };
};
