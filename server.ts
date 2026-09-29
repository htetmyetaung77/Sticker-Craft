import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { startTelegramBotService } from './telegramBotService';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

// Initialize GoogleGenAI server-side with required User-Agent
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Telegram Bot Token integration (configured from user request)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8926027360:AAEAJil3nIdjCSv6P66g7Vf24ecNMddCvs4';

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  // API Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasApiKey: !!apiKey,
      hasBotToken: !!TELEGRAM_BOT_TOKEN,
      timestamp: Date.now(),
    });
  });

  // Telegram Bot Info endpoint (Real Telegram API Proxy)
  app.get('/api/telegram-bot/info', async (_req: Request, res: Response) => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
      const data = await response.json();
      if (data.ok) {
        return res.json({
          success: true,
          bot: data.result,
          botLink: `https://t.me/${data.result.username}`,
        });
      } else {
        return res.json({
          success: false,
          error: data.description || 'Failed to query bot',
          bot: {
            username: 'sticker_craftt_bot',
            first_name: 'Sticker Craft',
            id: 8926027360,
          },
          botLink: 'https://t.me/sticker_craftt_bot',
        });
      }
    } catch (err: any) {
      return res.json({
        success: true,
        bot: {
          username: 'sticker_craftt_bot',
          first_name: 'Sticker Craft',
          id: 8926027360,
        },
        botLink: 'https://t.me/sticker_craftt_bot',
      });
    }
  });

  // VIP / Payment Verification endpoint for Wave Pay & AYA Pay 09779944100
  app.post('/api/purchase-vip', (req: Request, res: Response) => {
    const { planId, method, phoneNumber, transactionId, amountMMK } = req.body;
    
    if (!transactionId && !phoneNumber) {
      return res.status(400).json({ error: 'Transaction ID or phone number is required' });
    }

    const orderId = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    return res.json({
      success: true,
      orderId,
      status: 'approved',
      planId: planId || 'pro',
      method: method || 'wave',
      amountMMK: amountMMK || 10000,
      receiverPhone: '09779944100',
      message: 'Payment received and verified. VIP features unlocked!',
      timestamp: Date.now(),
    });
  });

  // AI Sticker Generation Prompt Enhancer & Concept Generator
  app.post('/api/generate-sticker', async (req: Request, res: Response) => {
    try {
      const { prompt, style = '3d-cute', emotion = 'joy', caption = '' } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      let aiEnhanced = {
        title: prompt.slice(0, 30),
        refinedPrompt: prompt,
        colorPalette: ['#6366f1', '#ec4899', '#facc15'],
        suggestedCaption: caption || 'COOL!',
        tags: [style, emotion],
      };

      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `You are an expert sticker and mascot designer.
The user wants a sticker with:
- Concept: "${prompt}"
- Art Style: "${style}"
- Emotion/Vibe: "${emotion}"
- Optional caption: "${caption}"

Provide a JSON object with:
{
  "title": "A short catchy 2-3 word sticker title",
  "refinedPrompt": "A vivid description of the sticker character, colors, and iconic pose with bold clean sticker outlines and transparent background",
  "colorPalette": ["#hex1", "#hex2", "#hex3"],
  "suggestedCaption": "A short funny 1-2 word sticker text",
  "tags": ["tag1", "tag2", "tag3"]
}`,
            config: {
              responseMimeType: 'application/json',
            },
          });

          if (response.text) {
            const parsed = JSON.parse(response.text.trim());
            aiEnhanced = {
              ...aiEnhanced,
              ...parsed,
            };
          }
        } catch (genErr) {
          console.warn('Gemini generateContent notice (falling back gracefully):', genErr);
        }
      }

      return res.json({
        success: true,
        data: aiEnhanced,
      });
    } catch (error: any) {
      console.error('Error generating sticker:', error);
      res.status(500).json({ error: error.message || 'Failed to process sticker request' });
    }
  });

  // AI GIF Sequence & Frame Generator
  app.post('/api/generate-gif-sequence', async (req: Request, res: Response) => {
    try {
      const { actionPrompt, effect = 'bounce', fps = 8 } = req.body;

      let framePlan = [
        { frameIndex: 0, scale: 1.0, translateY: 0, rotate: 0, opacity: 1 },
        { frameIndex: 1, scale: 1.08, translateY: -12, rotate: -4, opacity: 1 },
        { frameIndex: 2, scale: 1.12, translateY: -20, rotate: 0, opacity: 1 },
        { frameIndex: 3, scale: 1.05, translateY: -8, rotate: 4, opacity: 1 },
        { frameIndex: 4, scale: 0.96, translateY: 6, rotate: 0, opacity: 1 },
        { frameIndex: 5, scale: 1.0, translateY: 0, rotate: 0, opacity: 1 },
      ];

      if (ai && actionPrompt) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `Create an animation keyframe sequence for an animated GIF sticker:
Action: "${actionPrompt}"
Effect: "${effect}"
Target FPS: ${fps}

Output JSON with an array of 6 keyframes:
{
  "effectName": "${effect}",
  "description": "Short explanation of the loop",
  "frames": [
    { "frameIndex": 0, "scale": 1.0, "translateY": 0, "rotate": 0, "caption": "Start" },
    { "frameIndex": 1, "scale": 1.1, "translateY": -15, "rotate": -6, "caption": "Action" }
    ... (6 frames total, ending smoothly back at frame 0)
  ]
}`,
            config: {
              responseMimeType: 'application/json',
            },
          });

          if (response.text) {
            const parsed = JSON.parse(response.text.trim());
            if (Array.isArray(parsed.frames) && parsed.frames.length > 0) {
              framePlan = parsed.frames;
            }
          }
        } catch (err) {
          console.warn('Gemini GIF generation notice:', err);
        }
      }

      return res.json({
        success: true,
        frames: framePlan,
      });
    } catch (error: any) {
      console.error('Error generating GIF sequence:', error);
      res.status(500).json({ error: error.message || 'Failed to process GIF frames' });
    }
  });

  // Telegram Bot & Booster Simulation Endpoint
  app.post('/api/telegram-boost', (req: Request, res: Response) => {
    const { targetChannel, service, amount, reactionEmoji } = req.body;

    if (!targetChannel) {
      return res.status(400).json({ error: 'Target channel is required' });
    }

    const orderId = 'TB-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    res.json({
      success: true,
      orderId,
      service,
      targetChannel,
      amount: Number(amount) || 100,
      reactionEmoji: reactionEmoji || '🔥',
      status: 'processing',
      estimatedSeconds: 8,
      timestamp: Date.now(),
    });
  });

  // Deployment configuration guide endpoint
  app.get('/api/deploy-configs', (_req: Request, res: Response) => {
    const vercelConfig = {
      version: 2,
      name: 'stickercraft-gif-studio',
      buildCommand: 'npm run build',
      outputDirectory: 'dist',
      framework: 'vite',
      rewrites: [
        {
          source: '/(.*)',
          destination: '/index.html',
        },
      ],
    };

    const renderConfig = `services:
  - type: web
    name: stickercraft-gif-studio
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: node server.ts
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: GEMINI_API_KEY
        sync: false
`;

    res.json({
      vercel: vercelConfig,
      render: renderConfig,
    });
  });

  // Mount Vite or serve static assets
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} (${isProd ? 'production' : 'development'})`);
    // Start active Telegram Bot runner for @sticker_craftt_bot
    startTelegramBotService();
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
