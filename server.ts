import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const PORT = 3000;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ limit: '25mb', extended: true }));

  // API Health Check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // 1. Magic Captions API - analyzes image and produces 5 funny captions using gemini-3.1-pro-preview
  app.post('/api/gemini/magic-captions', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', style = 'mixed' } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'Image data is required.' });
      }

      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z0-9+.-]+;base64,/, '');
      const ai = getGeminiClient();

      const promptText = `You are a world-class meme master and internet culture comedian.
Analyze the provided image in detail: identify who/what is depicted, facial expressions, body language, tension, awkwardness, emotional energy, and comedic potential.
Generate exactly 5 distinct, hilarious, highly shareable meme captions that match the context and emotion of this image.
Requested style theme: "${style}".

For each caption:
- "topText": Short setup text (can be empty or null if single punchline format).
- "bottomText": The punchline text (or full meme text if topText is empty).
- "category": A catchy 1-2 word label (e.g. "Relatable Life", "Work / Tech", "Modern Irony", "Absurd POV", "Classic Punchline").
- "explanation": Brief 1-sentence explanation of why it fits this visual.

Make sure captions are genuinely funny, punchy, not cringey, and fit modern internet meme humor.`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64,
                },
              },
              {
                text: promptText,
              },
            ],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topText: {
                    type: Type.STRING,
                    description: 'Setup text at the top of the meme',
                  },
                  bottomText: {
                    type: Type.STRING,
                    description: 'Punchline text at the bottom of the meme',
                  },
                  category: {
                    type: Type.STRING,
                    description: 'Short category label for the meme style',
                  },
                  explanation: {
                    type: Type.STRING,
                    description: 'Brief reason why this caption matches the visual',
                  },
                },
                required: ['bottomText', 'category', 'explanation'],
              },
            },
          },
        });
      } catch (err: any) {
        console.warn('gemini-3.1-pro-preview failed, attempting fallback with gemini-3.8-flash:', err?.message);
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64,
                },
              },
              {
                text: promptText,
              },
            ],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topText: { type: Type.STRING },
                  bottomText: { type: Type.STRING },
                  category: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['bottomText', 'category', 'explanation'],
              },
            },
          },
        });
      }

      const rawText = response.text || '[]';
      const captions = JSON.parse(rawText);

      return res.json({ captions });
    } catch (error: any) {
      console.error('Error generating magic captions:', error);
      return res.status(500).json({
        error: error?.message || 'Failed to generate captions. Please try again.',
      });
    }
  });

  // 2. Image Analysis API - deep visual understanding using gemini-3.1-pro-preview
  app.post('/api/gemini/analyze-image', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg' } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'Image data is required.' });
      }

      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z0-9+.-]+;base64,/, '');
      const ai = getGeminiClient();

      const promptText = `Analyze this image thoroughly for meme creation.
Provide:
1. "visualSummary": Clear description of characters, subjects, and setting.
2. "detectedMood": Emotional vibe (e.g. "Pure existential dread disguised as a polite smile").
3. "memeabilityScore": An integer score from 1 to 100 on how meme-worthy this image is.
4. "keyElements": 3-5 notable visual cues or objects (e.g. "Side-eye glare", "Spilled coffee").
5. "comedicAngles": 3 suggestions of comedy themes (e.g. "Procrastination", "Imposter Syndrome").`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64,
                },
              },
              {
                text: promptText,
              },
            ],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                visualSummary: { type: Type.STRING },
                detectedMood: { type: Type.STRING },
                memeabilityScore: { type: Type.INTEGER },
                keyElements: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                comedicAngles: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['visualSummary', 'detectedMood', 'memeabilityScore', 'keyElements', 'comedicAngles'],
            },
          },
        });
      } catch (err: any) {
        console.warn('Analysis with gemini-3.1-pro-preview failed, attempting fallback:', err?.message);
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64,
                },
              },
              {
                text: promptText,
              },
            ],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                visualSummary: { type: Type.STRING },
                detectedMood: { type: Type.STRING },
                memeabilityScore: { type: Type.INTEGER },
                keyElements: { type: Type.ARRAY, items: { type: Type.STRING } },
                comedicAngles: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['visualSummary', 'detectedMood', 'memeabilityScore', 'keyElements', 'comedicAngles'],
            },
          },
        });
      }

      const analysis = JSON.parse(response.text || '{}');
      return res.json({ analysis });
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      return res.status(500).json({
        error: error?.message || 'Failed to analyze image.',
      });
    }
  });

  // 3. Create image using text prompt with gemini-3.1-flash-image-preview
  app.post('/api/gemini/generate-image', async (req, res) => {
    try {
      const { prompt, aspectRatio = '1:1' } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required.' });
      }

      const ai = getGeminiClient();
      const modelList = ['gemini-3.1-flash-image-preview', 'gemini-3.1-flash-image', 'gemini-3.1-flash-lite-image'];

      let imageBase64Result: string | null = null;
      let lastErr: any = null;

      for (const modelName of modelList) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts: [{ text: `Create a humorous meme-worthy image: ${prompt}. Photorealistic or high quality stylized format with vibrant expressive character.` }],
            },
            config: {
              imageConfig: {
                aspectRatio: (['1:1', '3:4', '4:3', '9:16', '16:9'].includes(aspectRatio) ? aspectRatio : '1:1') as any,
              },
            },
          });

          const parts = response.candidates?.[0]?.content?.parts || [];
          for (const part of parts) {
            if (part.inlineData?.data) {
              const mime = part.inlineData.mimeType || 'image/png';
              imageBase64Result = `data:${mime};base64,${part.inlineData.data}`;
              break;
            }
          }

          if (imageBase64Result) break;
        } catch (err: any) {
          lastErr = err;
          console.warn(`Model ${modelName} failed:`, err?.message);
        }
      }

      if (!imageBase64Result) {
        throw new Error(lastErr?.message || 'No image data returned from generation model.');
      }

      return res.json({ imageUrl: imageBase64Result });
    } catch (error: any) {
      console.error('Error generating image:', error);
      return res.status(500).json({
        error: error?.message || 'Failed to generate image from prompt.',
      });
    }
  });

  // 4. Edit image using text prompt with gemini-3.1-flash-image-preview
  app.post('/api/gemini/edit-image', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', prompt } = req.body;

      if (!imageBase64 || !prompt) {
        return res.status(400).json({ error: 'imageBase64 and prompt are required.' });
      }

      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z0-9+.-]+;base64,/, '');
      const ai = getGeminiClient();
      const modelList = ['gemini-3.1-flash-image-preview', 'gemini-3.1-flash-image', 'gemini-3.1-flash-lite-image'];

      let imageBase64Result: string | null = null;
      let lastErr: any = null;

      for (const modelName of modelList) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: cleanBase64,
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
          });

          const parts = response.candidates?.[0]?.content?.parts || [];
          for (const part of parts) {
            if (part.inlineData?.data) {
              const mime = part.inlineData.mimeType || 'image/png';
              imageBase64Result = `data:${mime};base64,${part.inlineData.data}`;
              break;
            }
          }

          if (imageBase64Result) break;
        } catch (err: any) {
          lastErr = err;
          console.warn(`Edit model ${modelName} failed:`, err?.message);
        }
      }

      if (!imageBase64Result) {
        throw new Error(lastErr?.message || 'No edited image returned.');
      }

      return res.json({ imageUrl: imageBase64Result });
    } catch (error: any) {
      console.error('Error editing image:', error);
      return res.status(500).json({
        error: error?.message || 'Failed to edit image.',
      });
    }
  });

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Meme Generator Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
